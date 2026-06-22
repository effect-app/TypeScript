# Effect schema facade emit (`.d.ts` declaration step)

Fork of `microsoft/TypeScript` that expands effect-app schema models into compact, named
**facades** when it writes declaration files — moving what was an in-source "native model
codegen" step into the compiler's `.d.ts` emitter. Source files stay clean; every project
reference consumes a `.d.ts` where each model is expanded **once**, so downstream consumers read
cheap named interfaces instead of re-instantiating schema generics.

Mirrored 1:1 in the Go compiler: **effect-app/typescript-go** (and as `_patches/` on
**effect-app/tsgo**).

---

## What

For every effect-app schema model the declaration emitter rewrites the emitted type and generates
a companion namespace:

- **Class / error models** (`S.Class`, `S.TaggedClass`, `S.ErrorClass`, `S.TaggedErrorClass`):
  the hoisted `X_base` const's type is rewritten from `S.EnhancedClass<X, S.Struct<{…full…}>, Inherited>`
  to the matching facade, and a `namespace X { Encoded; Make; DecodingServices; EncodingServices }`
  plus a `Type` `interface X` are generated (when absent).
- **Opaque models / requests** (`S.Opaque<X>`, `Req.Query`/`Req.Command`): same, via `OpaqueFacade`.
- **Struct models** (`S.Struct`, `S.TaggedStruct` — top-level `const`): the giant inline
  `S.Struct<{…}>` annotation on the const is replaced by `S.StructFacade<…>`, with a sibling
  `interface X` (decoded `Self`) and a **type-only** `declare namespace X` (`Fields`, `Encoded`,
  `Make`, services) that merges with the `const` value with no value-space collision. The source
  `export type X = typeof X.Type` companion is dropped.

Constructor → facade mapping:

| source constructor | emitted base | brand (6th arg) |
|---|---|---|
| `S.Class` / `S.TaggedClass` | `S.OpaqueClassFacade` | `{}` |
| `S.ErrorClass` / `S.TaggedErrorClass` | `S.OpaqueErrorFacadeClass` | `Cause.YieldableError` |
| `S.Opaque` / `S.OpaqueFacade` / requests | `S.OpaqueFacade` | `{}` |
| `S.Struct` / `S.TaggedStruct` | `S.StructFacade` | — (6th arg is `X.Fields`) |

The facade types live in **effect-app** (`>= 4.0.0-beta.279`; the `StructFacade` effect-app-`Struct`
fix lands in the next release). Exact interfaces (effect-app/libs `@`f74ba9e):

- [`OpaqueFacade`](https://github.com/effect-app/libs/blob/f74ba9e6b6805010ec2ff54dd7db119209ea5521/packages/effect-app/src/Schema/Class.ts#L471)
- [`OpaqueClassFacade`](https://github.com/effect-app/libs/blob/f74ba9e6b6805010ec2ff54dd7db119209ea5521/packages/effect-app/src/Schema/Class.ts#L502)
- [`OpaqueErrorFacadeClass`](https://github.com/effect-app/libs/blob/f74ba9e6b6805010ec2ff54dd7db119209ea5521/packages/effect-app/src/Schema/Class.ts#L580)
- [`StructFacade`](https://github.com/effect-app/libs/blob/f74ba9e6b6805010ec2ff54dd7db119209ea5521/packages/effect-app/src/Schema/Class.ts#L654)
- [`EnhancedClass`](https://github.com/effect-app/libs/blob/f74ba9e6b6805010ec2ff54dd7db119209ea5521/packages/effect-app/src/Schema/Class.ts#L17) (the stock class base we rewrite away)
- [effect-app `Struct`](https://github.com/effect-app/libs/blob/f74ba9e6b6805010ec2ff54dd7db119209ea5521/packages/effect-app/src/Schema.ts#L204) (the base `StructFacade` extends — effect-app's own, not effect core's)

---

## Why

Effect schemas encode their decoded/encoded/make/services views as type-level fields computed
from `fields`. Without expansion, every consumer that touches a model re-instantiates those
generics (and risks depth-limit blowups that silently infer `any`/`unknown`).

The in-source benefit is two distinct things:

1. **Named view interfaces** — `Encoded`/`Make`/`Type` materialized as literal interfaces. On its
   own only ~24% of the win.
2. **Class-base facade** — dropping the `S.Struct<{…full…}>` from the model's emitted base. This
   is **~76%** of the win.

Doing both at `.d.ts` emit means: codegen is purely text-based again (no type checker in the
lint/codegen path), source stays clean, and the expansion happens once per model regardless of how
many consumers read it.

The whole `S.Bottom` surface is pinned by the facade type, so consumers never re-derive *any*
Bottom field from `fields` — `Type`/`Encoded`/`Make`/`DecodingServices`/`EncodingServices` resolve
to the named namespace interfaces; `ast`/`Rebuild`/`Iso`/`~type.parameters`/variance markers are
fixed to constants/`Self`.

---

## How

Three compiler files (kept minimal so the diff re-applies as a patch onto the Effect-TS forks):

- `src/compiler/types.ts` — add the `createTypeOfStructSchemaProperty` `EmitResolver` signature.
- `src/compiler/checker.ts` — implement the resolver methods that turn a class-schema property or a
  struct const's initializer property into a serialized `TypeNode`
  (`createTypeOfClassStaticProperty`, `createMakeTypeOfClassDeclaration`,
  `createTypeLiteralOfClassDeclaration`, and **`createTypeOfStructSchemaProperty`**). All go through
  `nodeBuilder.typeToTypeNode(… | UseFullyQualifiedType | MultilineObjectLiterals)`.
- `src/compiler/transformers/declarations.ts` — the transform
  (`createEffectSchemaSourceFileDeclarations` and helpers).

Key mechanics:

- **Materialization reads the source, serializes the resolved type.** Class members come off the
  class heritage's schema expression; struct members come off the const's initializer
  (`createTypeOfStructSchemaProperty`). Serializing the *resolved* type (not a synthesized
  `S.Struct.*` / indexed-access reference) keeps `never` services as `never` and avoids checker
  flow/position crashes.
- **`identifier` is NOT compiler-emitted.** It is a generic `string` `S.Class` static, so it lives
  on the class facade interfaces (`OpaqueClassFacade`/`OpaqueErrorFacadeClass`) in effect-app — not
  on `OpaqueFacade` (`S.Opaque`/requests build on `S.Bottom`, not `S.Class`, so they have none).
  Only per-model, precisely-typed statics (`fields`/`mapFields`/`to`/`from`/`copy`) are emitted by
  the compiler.
- **Struct stays a `const`.** A type-only `declare namespace X` has no value side, so it merges with
  the struct `const` — no fake class needed.
- **`StructFacade` is Workflow-compatible.** It `Omit`s the overridden type-level keys off
  effect-app's `Struct<Fields>` and re-pins them, so the value is still a real (effect-app) struct
  schema: `Workflow.AnyStructSchema`, the `Struct<Fields & Context>` reconstruction, `Union`,
  `.fields.x` all keep working. (`OpaqueFacade` is *not* a `Struct` and breaks workflows — that's
  why structs need their own facade.)

### Gotchas

- `NodeBuilderFlags.UseFullyQualifiedType` is mandatory — without it nested model refs collapse to
  the bare sibling name (`address: Encoded` not `address: Address.Encoded`).
- `never` services materialize to `{}` if you go through `createTypeLiteralOfTypeNode`; serialize
  the resolved type instead so `never` stays `never`.
- `StructFacade` must extend **effect-app's** `Struct`, not `effect/Schema`'s — they are distinct
  types and the core one is not assignable where an effect-app struct is expected.

---

## Results

Scanner `api` `--build` (`tsconfig.src.json --force`, 13 projects, **0 errors**, identical source),
stock tsc 6.0.3 vs the final patched tsc:

| metric | stock tsc 6.0.3 | final patched | Δ |
|---|--:|--:|--:|
| **Type instantiations** | 15,704,767 | **11,077,561** | **−29.5%** |
| Types | 2,178,240 | 1,901,507 | −12.7% |
| Aggregate check time | 21.50s | 17.71s | −17.6% |

112 models faceted: **56 `StructFacade` + 46 `OpaqueErrorFacadeClass` + 10 `OpaqueClassFacade`**.
The Go compiler emits byte-identical facades (parity verified on the same tree).

The change also composes with Effect's tooling:
- **effect-app/tsgo** — re-expressed as `_patches/029-031`; the patched binary runs the scanner
  with **0 errors + Effect LSP diagnostics (hooks live) + our facades (emitter live)**.
- **`@effect/language-service`** — its build-time `_tsc.js` patch injects at `emitFilesAndReportErrors`
  (disjoint from our declaration-transformer change), so the two compose; `effect-language-service patch`
  applies cleanly on top of our patched compiler.

---

## Related

- effect-app/TypeScript#3 (this fork), effect-app/typescript-go#2, effect-app/tsgo#1 (patches).
- effect-app/libs#801 (facade `identifier` + `StructFacade`) + the `StructFacade` effect-app-`Struct` fix on `main`.
- Full plan / measurements / fork-layering: scanner `docs/planning/dts-emit-schema-codegen.md`.
