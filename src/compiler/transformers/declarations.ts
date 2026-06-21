import {
    AccessorDeclaration,
    addRelatedInfo,
    append,
    ArrayBindingElement,
    BindingElement,
    BindingName,
    BindingPattern,
    Bundle,
    CallSignatureDeclaration,
    canHaveModifiers,
    canProduceDiagnostics,
    ClassDeclaration,
    ClassElement,
    compact,
    concatenate,
    ConditionalTypeNode,
    ConstructorDeclaration,
    ConstructorTypeNode,
    ConstructSignatureDeclaration,
    contains,
    createDiagnosticForNode,
    createEmptyExports,
    createGetIsolatedDeclarationErrors,
    createGetSymbolAccessibilityDiagnosticForNode,
    createGetSymbolAccessibilityDiagnosticForNodeName,
    createSymbolTable,
    Debug,
    Declaration,
    DeclarationDiagnosticProducing,
    DeclarationName,
    declarationNameToString,
    Diagnostics,
    DiagnosticWithLocation,
    EmitFlags,
    EmitHost,
    EmitResolver,
    emptyArray,
    EntityNameOrEntityNameExpression,
    EntityName,
    EnumDeclaration,
    ExportAssignment,
    ExportDeclaration,
    Expression,
    ExpressionWithTypeArguments,
    factory,
    FileReference,
    filter,
    flatMap,
    flatten,
    forEach,
    FunctionDeclaration,
    FunctionTypeNode,
    GeneratedIdentifierFlags,
    GetAccessorDeclaration,
    getCommentRange,
    getDirectoryPath,
    getEffectiveBaseTypeNode,
    getEffectiveModifierFlags,
    getExternalModuleImportEqualsDeclarationExpression,
    getExternalModuleNameFromDeclaration,
    getFirstConstructorWithBody,
    getLineAndCharacterOfPosition,
    getNameOfDeclaration,
    getOriginalNodeId,
    getOutputPathsFor,
    getParseTreeNode,
    getRelativePathToDirectoryOrUrl,
    getResolutionModeOverride,
    getResolvedExternalModuleName,
    getSetAccessorValueParameter,
    getSourceFileOfNode,
    getSourceFilesToEmit,
    GetSymbolAccessibilityDiagnostic,
    getTextOfNode,
    getThisParameter,
    hasDynamicName,
    hasEffectiveModifier,
    hasInferredType,
    hasJSDocNodes,
    HasModifiers,
    hasSyntacticModifier,
    HeritageClause,
    Identifier,
    idText,
    ImportAttributes,
    ImportDeclaration,
    ImportEqualsDeclaration,
    ImportTypeNode,
    IndexSignatureDeclaration,
    IntersectionTypeNode,
    InterfaceDeclaration,
    InternalNodeBuilderFlags,
    isAmbientModule,
    isArray,
    isArrayBindingElement,
    isBinaryExpression,
    isBindingElement,
    isBindingPattern,
    isClassDeclaration,
    isClassElement,
    isComputedPropertyName,
    isDeclaration,
    isEntityName,
    isEntityNameExpression,
    isExpandoPropertyDeclaration,
    isExportAssignment,
    isExportDeclaration,
    isExpressionWithTypeArguments,
    isExternalModule,
    isExternalModuleAugmentation,
    isExternalModuleIndicator,
    isExternalOrCommonJsModule,
    isFunctionDeclaration,
    isFunctionLike,
    isGlobalScopeAugmentation,
    isIdentifierText,
    isImportEqualsDeclaration,
    isIndexSignatureDeclaration,
    isInterfaceDeclaration,
    isInternalDeclaration,
    isJSDocImportTag,
    isJsonSourceFile,
    isLateVisibilityPaintedStatement,
    isLiteralImportTypeNode,
    isMappedTypeNode,
    isMethodDeclaration,
    isMethodSignature,
    isModifier,
    isModuleDeclaration,
    isObjectLiteralExpression,
    isOmittedExpression,
    isParameter,
    isPropertyAccessExpression,
    isPrimitiveLiteralValue,
    isPrivateIdentifier,
    isSemicolonClassElement,
    isSetAccessorDeclaration,
    isSourceFile,
    isSourceFileJS,
    isSourceFileNotJson,
    isStatement,
    isStringANonContextualKeyword,
    isStringLiteralLike,
    isTupleTypeNode,
    isTypeAliasDeclaration,
    isTypeElement,
    isTypeLiteralNode,
    isTypeNode,
    isTypeParameterDeclaration,
    isTypeQueryNode,
    isVarAwaitUsing,
    isVariableDeclaration,
    isVarUsing,
    LateBoundDeclaration,
    LateVisibilityPaintedStatement,
    length,
    map,
    mapDefined,
    MethodDeclaration,
    MethodSignature,
    Modifier,
    ModifierFlags,
    ModifierLike,
    ModuleBody,
    ModuleDeclaration,
    ModuleName,
    NamedDeclaration,
    NamespaceDeclaration,
    needsScopeMarker,
    Node,
    NodeArray,
    NodeBuilderFlags,
    NodeFactory,
    NodeFlags,
    NodeId,
    normalizeSlashes,
    OmittedExpression,
    orderedRemoveItem,
    ParameterDeclaration,
    parseNodeFactory,
    PropertyDeclaration,
    PropertySignature,
    pushIfUnique,
    QualifiedName,
    removeAllComments,
    ScriptTarget,
    SetAccessorDeclaration,
    setCommentRange,
    setEmitFlags,
    setOriginalNode,
    setParent,
    setParentRecursive,
    setTextRange,
    SignatureDeclaration,
    some,
    SourceFile,
    Statement,
    StringLiteral,
    Symbol,
    SymbolAccessibility,
    SymbolAccessibilityResult,
    SymbolFlags,
    SymbolTracker,
    SyntaxKind,
    TransformationContext,
    Transformer,
    transformNodes,
    tryCast,
    TypeAliasDeclaration,
    TypeElement,
    TypeNode,
    TypeParameterDeclaration,
    TypeQueryNode,
    TypeReferenceNode,
    unescapeLeadingUnderscores,
    unwrapParenthesizedExpression,
    VariableDeclaration,
    VariableDeclarationList,
    VariableStatement,
    visitArray,
    visitEachChild,
    visitNode,
    visitNodes,
    VisitResult,
} from "../_namespaces/ts.js";

/** @internal */
export function getDeclarationDiagnostics(
    host: EmitHost,
    resolver: EmitResolver,
    file: SourceFile,
): DiagnosticWithLocation[] | undefined {
    const compilerOptions = host.getCompilerOptions();
    const files = filter(getSourceFilesToEmit(host, file), isSourceFileNotJson);
    return contains(files, file) ?
        transformNodes(
            resolver,
            host,
            factory,
            compilerOptions,
            [file],
            [transformDeclarations],
            /*allowDtsFiles*/ false,
        ).diagnostics :
        undefined;
}

const declarationEmitNodeBuilderFlags = NodeBuilderFlags.MultilineObjectLiterals |
    NodeBuilderFlags.WriteClassExpressionAsTypeLiteral |
    NodeBuilderFlags.UseTypeOfFunction |
    NodeBuilderFlags.UseStructuralFallback |
    NodeBuilderFlags.AllowEmptyTuple |
    NodeBuilderFlags.GenerateNamesForShadowedTypeParams |
    NodeBuilderFlags.NoTruncation;

const declarationEmitInternalNodeBuilderFlags = InternalNodeBuilderFlags.AllowUnresolvedNames;

/**
 * Transforms a ts file into a .d.ts file
 * This process requires type information, which is retrieved through the emit resolver. Because of this,
 * in many places this transformer assumes it will be operating on parse tree nodes directly.
 * This means that _no transforms should be allowed to occur before this one_.
 *
 * @internal
 */
export function transformDeclarations(context: TransformationContext): Transformer<SourceFile | Bundle> {
    const throwDiagnostic = () => Debug.fail("Diagnostic emitted without context");
    let getSymbolAccessibilityDiagnostic: GetSymbolAccessibilityDiagnostic = throwDiagnostic;
    let needsDeclare = true;
    let isBundledEmit = false;
    let resultHasExternalModuleIndicator = false;
    let needsScopeFixMarker = false;
    let resultHasScopeMarker = false;
    let enclosingDeclaration: Node;
    let lateMarkedStatements: LateVisibilityPaintedStatement[] | undefined;
    let lateStatementReplacementMap: Map<NodeId, VisitResult<LateVisibilityPaintedStatement | ExportAssignment | undefined>>;
    let suppressNewDiagnosticContexts: boolean;

    const { factory } = context;
    const host = context.getEmitHost();
    let restoreFallbackNode = () => void 0;
    const symbolTracker: SymbolTracker = {
        trackSymbol,
        reportInaccessibleThisError,
        reportInaccessibleUniqueSymbolError,
        reportCyclicStructureError,
        reportPrivateInBaseOfClassExpression,
        reportLikelyUnsafeImportRequiredError,
        reportTruncationError,
        moduleResolverHost: host,
        reportNonlocalAugmentation,
        reportNonSerializableProperty,
        reportInferenceFallback,
        pushErrorFallbackNode(node) {
            const currentFallback = errorFallbackNode;
            const currentRestore = restoreFallbackNode;
            restoreFallbackNode = () => {
                restoreFallbackNode = currentRestore;
                errorFallbackNode = currentFallback;
            };
            errorFallbackNode = node;
        },
        popErrorFallbackNode() {
            restoreFallbackNode();
        },
    };
    let errorNameNode: DeclarationName | undefined;
    let errorFallbackNode: Declaration | undefined;

    let currentSourceFile: SourceFile;
    let rawReferencedFiles: readonly [SourceFile, FileReference][];
    let rawTypeReferenceDirectives: readonly FileReference[];
    let rawLibReferenceDirectives: readonly FileReference[];
    const resolver = context.getEmitResolver();
    const options = context.getCompilerOptions();
    const getIsolatedDeclarationError = createGetIsolatedDeclarationErrors(resolver);
    const { stripInternal, isolatedDeclarations } = options;
    return transformRoot;

    function reportExpandoFunctionErrors(node: FunctionDeclaration | VariableDeclaration) {
        resolver.getPropertiesOfContainerFunction(node).forEach(p => {
            if (isExpandoPropertyDeclaration(p.valueDeclaration)) {
                const errorTarget = isBinaryExpression(p.valueDeclaration) ?
                    p.valueDeclaration.left :
                    p.valueDeclaration;

                context.addDiagnostic(createDiagnosticForNode(
                    errorTarget,
                    Diagnostics.Assigning_properties_to_functions_without_declaring_them_is_not_supported_with_isolatedDeclarations_Add_an_explicit_declaration_for_the_properties_assigned_to_this_function,
                ));
            }
        });
    }
    function reportInferenceFallback(node: Node) {
        if (!isolatedDeclarations || isSourceFileJS(currentSourceFile)) return;
        if (getSourceFileOfNode(node) !== currentSourceFile) return; // Nested error on a declaration in another file - ignore, will be reemitted if file is in the output file set
        if (isVariableDeclaration(node) && resolver.isExpandoFunctionDeclaration(node)) {
            reportExpandoFunctionErrors(node);
        }
        else {
            context.addDiagnostic(getIsolatedDeclarationError(node));
        }
    }
    function handleSymbolAccessibilityError(symbolAccessibilityResult: SymbolAccessibilityResult) {
        if (symbolAccessibilityResult.accessibility === SymbolAccessibility.Accessible) {
            // Add aliases back onto the possible imports list if they're not there so we can try them again with updated visibility info
            if (symbolAccessibilityResult.aliasesToMakeVisible) {
                if (!lateMarkedStatements) {
                    lateMarkedStatements = symbolAccessibilityResult.aliasesToMakeVisible;
                }
                else {
                    for (const ref of symbolAccessibilityResult.aliasesToMakeVisible) {
                        pushIfUnique(lateMarkedStatements, ref);
                    }
                }
            }
            // TODO: Do all these accessibility checks inside/after the first pass in the checker when declarations are enabled, if possible
        }
        // The checker should issue errors on unresolvable names, skip the declaration emit error for using a private/unreachable name for those
        else if (symbolAccessibilityResult.accessibility !== SymbolAccessibility.NotResolved) {
            // Report error
            const errorInfo = getSymbolAccessibilityDiagnostic(symbolAccessibilityResult);
            if (errorInfo) {
                if (errorInfo.typeName) {
                    context.addDiagnostic(createDiagnosticForNode(symbolAccessibilityResult.errorNode || errorInfo.errorNode, errorInfo.diagnosticMessage, getTextOfNode(errorInfo.typeName), symbolAccessibilityResult.errorSymbolName!, symbolAccessibilityResult.errorModuleName!));
                }
                else {
                    context.addDiagnostic(createDiagnosticForNode(symbolAccessibilityResult.errorNode || errorInfo.errorNode, errorInfo.diagnosticMessage, symbolAccessibilityResult.errorSymbolName!, symbolAccessibilityResult.errorModuleName!));
                }
                return true;
            }
        }
        return false;
    }

    function trackSymbol(symbol: Symbol, enclosingDeclaration?: Node, meaning?: SymbolFlags) {
        if (symbol.flags & SymbolFlags.TypeParameter) return false;
        const issuedDiagnostic = handleSymbolAccessibilityError(resolver.isSymbolAccessible(symbol, enclosingDeclaration, meaning, /*shouldComputeAliasToMarkVisible*/ true));
        return issuedDiagnostic;
    }

    function reportPrivateInBaseOfClassExpression(propertyName: string) {
        if (errorNameNode || errorFallbackNode) {
            context.addDiagnostic(
                addRelatedInfo(
                    createDiagnosticForNode((errorNameNode || errorFallbackNode)!, Diagnostics.Property_0_of_exported_anonymous_class_type_may_not_be_private_or_protected, propertyName),
                    ...(isVariableDeclaration((errorNameNode || errorFallbackNode)!.parent) ? [createDiagnosticForNode((errorNameNode || errorFallbackNode)!, Diagnostics.Add_a_type_annotation_to_the_variable_0, errorDeclarationNameWithFallback())] : []),
                ),
            );
        }
    }

    function errorDeclarationNameWithFallback() {
        return errorNameNode ? declarationNameToString(errorNameNode) :
            errorFallbackNode && getNameOfDeclaration(errorFallbackNode) ? declarationNameToString(getNameOfDeclaration(errorFallbackNode)) :
            errorFallbackNode && isExportAssignment(errorFallbackNode) ? errorFallbackNode.isExportEquals ? "export=" : "default" :
            "(Missing)"; // same fallback declarationNameToString uses when node is zero-width (ie, nameless)
    }

    function reportInaccessibleUniqueSymbolError() {
        if (errorNameNode || errorFallbackNode) {
            context.addDiagnostic(createDiagnosticForNode((errorNameNode || errorFallbackNode)!, Diagnostics.The_inferred_type_of_0_references_an_inaccessible_1_type_A_type_annotation_is_necessary, errorDeclarationNameWithFallback(), "unique symbol"));
        }
    }

    function reportCyclicStructureError() {
        if (errorNameNode || errorFallbackNode) {
            context.addDiagnostic(createDiagnosticForNode((errorNameNode || errorFallbackNode)!, Diagnostics.The_inferred_type_of_0_references_a_type_with_a_cyclic_structure_which_cannot_be_trivially_serialized_A_type_annotation_is_necessary, errorDeclarationNameWithFallback()));
        }
    }

    function reportInaccessibleThisError() {
        if (errorNameNode || errorFallbackNode) {
            context.addDiagnostic(createDiagnosticForNode((errorNameNode || errorFallbackNode)!, Diagnostics.The_inferred_type_of_0_references_an_inaccessible_1_type_A_type_annotation_is_necessary, errorDeclarationNameWithFallback(), "this"));
        }
    }

    function reportLikelyUnsafeImportRequiredError(specifier: string, symbolName: string | undefined) {
        if (errorNameNode || errorFallbackNode) {
            if (symbolName) {
                context.addDiagnostic(createDiagnosticForNode((errorNameNode || errorFallbackNode)!, Diagnostics.The_inferred_type_of_0_cannot_be_named_without_a_reference_to_2_from_1_This_is_likely_not_portable_A_type_annotation_is_necessary, errorDeclarationNameWithFallback(), specifier, symbolName));
            }
            else {
                context.addDiagnostic(createDiagnosticForNode((errorNameNode || errorFallbackNode)!, Diagnostics.The_inferred_type_of_0_cannot_be_named_without_a_reference_to_1_This_is_likely_not_portable_A_type_annotation_is_necessary, errorDeclarationNameWithFallback(), specifier));
            }
        }
    }

    function reportTruncationError() {
        if (errorNameNode || errorFallbackNode) {
            context.addDiagnostic(createDiagnosticForNode((errorNameNode || errorFallbackNode)!, Diagnostics.The_inferred_type_of_this_node_exceeds_the_maximum_length_the_compiler_will_serialize_An_explicit_type_annotation_is_needed));
        }
    }

    function reportNonlocalAugmentation(containingFile: SourceFile, parentSymbol: Symbol, symbol: Symbol) {
        const primaryDeclaration = parentSymbol.declarations?.find(d => getSourceFileOfNode(d) === containingFile);
        const augmentingDeclarations = filter(symbol.declarations, d => getSourceFileOfNode(d) !== containingFile);
        if (primaryDeclaration && augmentingDeclarations) {
            for (const augmentations of augmentingDeclarations) {
                context.addDiagnostic(addRelatedInfo(
                    createDiagnosticForNode(augmentations, Diagnostics.Declaration_augments_declaration_in_another_file_This_cannot_be_serialized),
                    createDiagnosticForNode(primaryDeclaration, Diagnostics.This_is_the_declaration_being_augmented_Consider_moving_the_augmenting_declaration_into_the_same_file),
                ));
            }
        }
    }

    function reportNonSerializableProperty(propertyName: string) {
        if (errorNameNode || errorFallbackNode) {
            context.addDiagnostic(createDiagnosticForNode((errorNameNode || errorFallbackNode)!, Diagnostics.The_type_of_this_node_cannot_be_serialized_because_its_property_0_cannot_be_serialized, propertyName));
        }
    }

    function transformDeclarationsForJS(sourceFile: SourceFile) {
        const oldDiag = getSymbolAccessibilityDiagnostic;
        getSymbolAccessibilityDiagnostic = s => (s.errorNode && canProduceDiagnostics(s.errorNode) ? createGetSymbolAccessibilityDiagnosticForNode(s.errorNode)(s) : ({
            diagnosticMessage: s.errorModuleName
                ? Diagnostics.Declaration_emit_for_this_file_requires_using_private_name_0_from_module_1_An_explicit_type_annotation_may_unblock_declaration_emit
                : Diagnostics.Declaration_emit_for_this_file_requires_using_private_name_0_An_explicit_type_annotation_may_unblock_declaration_emit,
            errorNode: s.errorNode || sourceFile,
        }));
        const result = resolver.getDeclarationStatementsForSourceFile(sourceFile, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
        getSymbolAccessibilityDiagnostic = oldDiag;
        return result;
    }

    function transformRoot(node: SourceFile | Bundle): SourceFile | Bundle {
        if (node.kind === SyntaxKind.SourceFile && node.isDeclarationFile) {
            return node;
        }

        if (node.kind === SyntaxKind.Bundle) {
            isBundledEmit = true;
            rawReferencedFiles = [];
            rawTypeReferenceDirectives = [];
            rawLibReferenceDirectives = [];
            const bundle = factory.createBundle(
                map(node.sourceFiles, sourceFile => {
                    if (sourceFile.isDeclarationFile) return undefined!; // Omit declaration files from bundle results, too // TODO: GH#18217
                    currentSourceFile = sourceFile;
                    enclosingDeclaration = sourceFile;
                    lateMarkedStatements = undefined;
                    suppressNewDiagnosticContexts = false;
                    lateStatementReplacementMap = new Map();
                    getSymbolAccessibilityDiagnostic = throwDiagnostic;
                    needsScopeFixMarker = false;
                    resultHasScopeMarker = false;
                    collectFileReferences(sourceFile);
                    if (isExternalOrCommonJsModule(sourceFile) || isJsonSourceFile(sourceFile)) {
                        resultHasExternalModuleIndicator = false; // unused in external module bundle emit (all external modules are within module blocks, therefore are known to be modules)
                        needsDeclare = false;
                        const statements = isSourceFileJS(sourceFile) ? factory.createNodeArray(transformDeclarationsForJS(sourceFile)) : visitNodes(sourceFile.statements, visitDeclarationStatements, isStatement);
                        const newFile = factory.updateSourceFile(
                            sourceFile,
                            [factory.createModuleDeclaration(
                                [factory.createModifier(SyntaxKind.DeclareKeyword)],
                                factory.createStringLiteral(getResolvedExternalModuleName(context.getEmitHost(), sourceFile)),
                                factory.createModuleBlock(setTextRange(factory.createNodeArray(transformAndReplaceLatePaintedStatements(statements)), sourceFile.statements)),
                            )],
                            /*isDeclarationFile*/ true,
                            /*referencedFiles*/ [],
                            /*typeReferences*/ [],
                            /*hasNoDefaultLib*/ false,
                            /*libReferences*/ [],
                        );
                        return newFile;
                    }
                    needsDeclare = true;
                    const updated = isSourceFileJS(sourceFile) ? factory.createNodeArray(transformDeclarationsForJS(sourceFile)) : visitNodes(sourceFile.statements, visitDeclarationStatements, isStatement);
                    return factory.updateSourceFile(sourceFile, transformAndReplaceLatePaintedStatements(updated), /*isDeclarationFile*/ true, /*referencedFiles*/ [], /*typeReferences*/ [], /*hasNoDefaultLib*/ false, /*libReferences*/ []);
                }),
            );
            const outputFilePath = getDirectoryPath(normalizeSlashes(getOutputPathsFor(node, host, /*forceDtsPaths*/ true).declarationFilePath!));
            bundle.syntheticFileReferences = getReferencedFiles(outputFilePath);
            bundle.syntheticTypeReferences = getTypeReferences();
            bundle.syntheticLibReferences = getLibReferences();
            return bundle;
        }

        // Single source file
        needsDeclare = true;
        needsScopeFixMarker = false;
        resultHasScopeMarker = false;
        enclosingDeclaration = node;
        currentSourceFile = node;
        getSymbolAccessibilityDiagnostic = throwDiagnostic;
        isBundledEmit = false;
        resultHasExternalModuleIndicator = false;
        suppressNewDiagnosticContexts = false;
        lateMarkedStatements = undefined;
        lateStatementReplacementMap = new Map();
        rawReferencedFiles = [];
        rawTypeReferenceDirectives = [];
        rawLibReferenceDirectives = [];
        collectFileReferences(currentSourceFile);
        let combinedStatements: NodeArray<Statement>;
        if (isSourceFileJS(currentSourceFile)) {
            combinedStatements = factory.createNodeArray(transformDeclarationsForJS(node));
        }
        else {
            const statements = visitNodes(node.statements, visitDeclarationStatements, isStatement);
            combinedStatements = setTextRange(factory.createNodeArray(transformAndReplaceLatePaintedStatements(statements)), node.statements);
            combinedStatements = setTextRange(factory.createNodeArray(createEffectSchemaSourceFileDeclarations(combinedStatements)), combinedStatements);
            if (isExternalModule(node) && (!resultHasExternalModuleIndicator || (needsScopeFixMarker && !resultHasScopeMarker))) {
                combinedStatements = setTextRange(factory.createNodeArray([...combinedStatements, createEmptyExports(factory)]), combinedStatements);
            }
        }
        const outputFilePath = getDirectoryPath(normalizeSlashes(getOutputPathsFor(node, host, /*forceDtsPaths*/ true).declarationFilePath!));
        return factory.updateSourceFile(node, combinedStatements, /*isDeclarationFile*/ true, getReferencedFiles(outputFilePath), getTypeReferences(), /*hasNoDefaultLib*/ false, getLibReferences());

        function collectFileReferences(sourceFile: SourceFile) {
            rawReferencedFiles = concatenate(rawReferencedFiles, map(sourceFile.referencedFiles, f => [sourceFile, f]));
            rawTypeReferenceDirectives = concatenate(rawTypeReferenceDirectives, sourceFile.typeReferenceDirectives);
            rawLibReferenceDirectives = concatenate(rawLibReferenceDirectives, sourceFile.libReferenceDirectives);
        }

        function copyFileReferenceAsSynthetic(ref: FileReference): FileReference {
            const newRef: FileReference = { ...ref };
            newRef.pos = -1;
            newRef.end = -1;
            return newRef;
        }

        function getTypeReferences(): readonly FileReference[] {
            return mapDefined(rawTypeReferenceDirectives, ref => {
                if (!ref.preserve) return undefined;
                return copyFileReferenceAsSynthetic(ref);
            });
        }

        function getLibReferences(): readonly FileReference[] {
            return mapDefined(rawLibReferenceDirectives, ref => {
                if (!ref.preserve) return undefined;
                return copyFileReferenceAsSynthetic(ref);
            });
        }

        function getReferencedFiles(outputFilePath: string): readonly FileReference[] {
            return mapDefined(rawReferencedFiles, ([sourceFile, ref]) => {
                if (!ref.preserve) return undefined;

                const file = host.getSourceFileFromReference(sourceFile, ref);
                if (!file) {
                    return undefined;
                }

                let declFileName: string;
                if (file.isDeclarationFile) { // Neither decl files or js should have their refs changed
                    declFileName = file.fileName;
                }
                else {
                    if (isBundledEmit && contains((node as Bundle).sourceFiles, file)) return; // Omit references to files which are being merged
                    const paths = getOutputPathsFor(file, host, /*forceDtsPaths*/ true);
                    declFileName = paths.declarationFilePath || paths.jsFilePath || file.fileName;
                }

                if (!declFileName) return undefined;

                const fileName = getRelativePathToDirectoryOrUrl(
                    outputFilePath,
                    declFileName,
                    host.getCurrentDirectory(),
                    host.getCanonicalFileName,
                    /*isAbsolutePathAnUrl*/ false,
                );

                const newRef = copyFileReferenceAsSynthetic(ref);
                newRef.fileName = fileName;
                return newRef;
            });
        }
    }

    function filterBindingPatternInitializers(name: BindingName) {
        if (name.kind === SyntaxKind.Identifier) {
            return name;
        }
        else {
            if (name.kind === SyntaxKind.ArrayBindingPattern) {
                return factory.updateArrayBindingPattern(name, visitNodes(name.elements, visitBindingElement, isArrayBindingElement));
            }
            else {
                return factory.updateObjectBindingPattern(name, visitNodes(name.elements, visitBindingElement, isBindingElement));
            }
        }

        function visitBindingElement<T extends Node>(elem: T): T;
        function visitBindingElement(elem: ArrayBindingElement): ArrayBindingElement {
            if (elem.kind === SyntaxKind.OmittedExpression) {
                return elem;
            }
            if (elem.propertyName && isComputedPropertyName(elem.propertyName) && isEntityNameExpression(elem.propertyName.expression)) {
                checkEntityNameVisibility(elem.propertyName.expression, enclosingDeclaration);
            }

            return factory.updateBindingElement(
                elem,
                elem.dotDotDotToken,
                elem.propertyName,
                filterBindingPatternInitializers(elem.name),
                /*initializer*/ undefined,
            );
        }
    }

    function ensureParameter(p: ParameterDeclaration, modifierMask?: ModifierFlags): ParameterDeclaration {
        let oldDiag: typeof getSymbolAccessibilityDiagnostic | undefined;
        if (!suppressNewDiagnosticContexts) {
            oldDiag = getSymbolAccessibilityDiagnostic;
            getSymbolAccessibilityDiagnostic = createGetSymbolAccessibilityDiagnosticForNode(p);
        }
        const newParam = factory.updateParameterDeclaration(
            p,
            maskModifiers(factory, p, modifierMask),
            p.dotDotDotToken,
            filterBindingPatternInitializers(p.name),
            resolver.isOptionalParameter(p) ? (p.questionToken || factory.createToken(SyntaxKind.QuestionToken)) : undefined,
            ensureType(p, /*ignorePrivate*/ true), // Ignore private param props, since this type is going straight back into a param
            ensureNoInitializer(p),
        );
        if (!suppressNewDiagnosticContexts) {
            getSymbolAccessibilityDiagnostic = oldDiag!;
        }
        return newParam;
    }

    function shouldPrintWithInitializer(node: Node): node is CanHaveLiteralInitializer & { initializer: Expression; } {
        return canHaveLiteralInitializer(node)
            && !!node.initializer
            && resolver.isLiteralConstDeclaration(getParseTreeNode(node) as CanHaveLiteralInitializer); // TODO: Make safea
    }

    function ensureNoInitializer(node: CanHaveLiteralInitializer) {
        if (shouldPrintWithInitializer(node)) {
            const unwrappedInitializer = unwrapParenthesizedExpression(node.initializer);
            if (!isPrimitiveLiteralValue(unwrappedInitializer)) {
                reportInferenceFallback(node);
            }
            return resolver.createLiteralConstValue(getParseTreeNode(node, canHaveLiteralInitializer)!, symbolTracker);
        }
        return undefined;
    }
    function ensureType(node: VariableDeclaration | ParameterDeclaration | BindingElement | PropertyDeclaration | PropertySignature | ExportAssignment | SignatureDeclaration, ignorePrivate?: boolean): TypeNode | undefined {
        if (!ignorePrivate && hasEffectiveModifier(node, ModifierFlags.Private)) {
            // Private nodes emit no types (except private parameter properties, whose parameter types are actually visible)
            return;
        }
        if (shouldPrintWithInitializer(node)) {
            // Literal const declarations will have an initializer ensured rather than a type
            return;
        }
        // Should be removed createTypeOfDeclaration will actually now reuse the existing annotation so there is no real need to duplicate type walking
        // Left in for now to minimize diff during syntactic type node builder refactor
        if (
            !isExportAssignment(node)
            && !isBindingElement(node)
            && node.type
            && (!isParameter(node) || !resolver.requiresAddingImplicitUndefined(node, enclosingDeclaration))
        ) {
            return visitNode(node.type, visitDeclarationSubtree, isTypeNode);
        }

        const oldErrorNameNode = errorNameNode;
        errorNameNode = node.name;
        let oldDiag: typeof getSymbolAccessibilityDiagnostic;
        if (!suppressNewDiagnosticContexts) {
            oldDiag = getSymbolAccessibilityDiagnostic;
            if (canProduceDiagnostics(node)) {
                getSymbolAccessibilityDiagnostic = createGetSymbolAccessibilityDiagnosticForNode(node);
            }
        }
        let typeNode;
        if (hasInferredType(node)) {
            typeNode = resolver.createTypeOfDeclaration(node, enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
        }
        else if (isFunctionLike(node)) {
            typeNode = resolver.createReturnTypeOfSignatureDeclaration(node, enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
        }
        else {
            Debug.assertNever(node);
        }

        errorNameNode = oldErrorNameNode;
        if (!suppressNewDiagnosticContexts) {
            getSymbolAccessibilityDiagnostic = oldDiag!;
        }
        return typeNode ?? factory.createKeywordTypeNode(SyntaxKind.AnyKeyword);
    }

    function isDeclarationAndNotVisible(node: NamedDeclaration) {
        node = getParseTreeNode(node) as NamedDeclaration;
        switch (node.kind) {
            case SyntaxKind.FunctionDeclaration:
            case SyntaxKind.ModuleDeclaration:
            case SyntaxKind.InterfaceDeclaration:
            case SyntaxKind.ClassDeclaration:
            case SyntaxKind.TypeAliasDeclaration:
            case SyntaxKind.EnumDeclaration:
                return !resolver.isDeclarationVisible(node);
            // The following should be doing their own visibility checks based on filtering their members
            case SyntaxKind.VariableDeclaration:
                return !getBindingNameVisible(node as VariableDeclaration);
            case SyntaxKind.ImportEqualsDeclaration:
            case SyntaxKind.ImportDeclaration:
            case SyntaxKind.ExportDeclaration:
            case SyntaxKind.ExportAssignment:
                return false;
            case SyntaxKind.ClassStaticBlockDeclaration:
                return true;
        }
        return false;
    }

    // If the ExpandoFunctionDeclaration have multiple overloads, then we only need to emit properties for the last one.
    function shouldEmitFunctionProperties(input: FunctionDeclaration) {
        if (input.body) {
            return true;
        }

        const overloadSignatures = input.symbol.declarations?.filter(decl => isFunctionDeclaration(decl) && !decl.body);
        return !overloadSignatures || overloadSignatures.indexOf(input) === overloadSignatures.length - 1;
    }

    function getBindingNameVisible(elem: BindingElement | VariableDeclaration | OmittedExpression): boolean {
        if (isOmittedExpression(elem)) {
            return false;
        }
        if (isBindingPattern(elem.name)) {
            // If any child binding pattern element has been marked visible (usually by collect linked aliases), then this is visible
            return some(elem.name.elements, getBindingNameVisible);
        }
        else {
            return resolver.isDeclarationVisible(elem);
        }
    }

    function updateParamsList(node: Node, params: NodeArray<ParameterDeclaration>, modifierMask?: ModifierFlags): NodeArray<ParameterDeclaration> {
        if (hasEffectiveModifier(node, ModifierFlags.Private)) {
            return factory.createNodeArray();
        }
        const newParams = map(params, p => ensureParameter(p, modifierMask));
        if (!newParams) {
            return factory.createNodeArray();
        }
        return factory.createNodeArray(newParams, params.hasTrailingComma);
    }

    function updateAccessorParamsList(input: AccessorDeclaration, isPrivate: boolean) {
        let newParams: ParameterDeclaration[] | undefined;
        if (!isPrivate) {
            const thisParameter = getThisParameter(input);
            if (thisParameter) {
                newParams = [ensureParameter(thisParameter)];
            }
        }
        if (isSetAccessorDeclaration(input)) {
            let newValueParameter: ParameterDeclaration | undefined;
            if (!isPrivate) {
                const valueParameter = getSetAccessorValueParameter(input);
                if (valueParameter) {
                    newValueParameter = ensureParameter(valueParameter);
                }
            }
            if (!newValueParameter) {
                newValueParameter = factory.createParameterDeclaration(
                    /*modifiers*/ undefined,
                    /*dotDotDotToken*/ undefined,
                    "value",
                );
            }
            newParams = append(newParams, newValueParameter);
        }
        return factory.createNodeArray(newParams || emptyArray);
    }

    function ensureTypeParams(node: Node, params: NodeArray<TypeParameterDeclaration> | undefined) {
        return hasEffectiveModifier(node, ModifierFlags.Private) ? undefined : visitNodes(params, visitDeclarationSubtree, isTypeParameterDeclaration);
    }

    function isEnclosingDeclaration(node: Node) {
        return isSourceFile(node)
            || isTypeAliasDeclaration(node)
            || isModuleDeclaration(node)
            || isClassDeclaration(node)
            || isInterfaceDeclaration(node)
            || isFunctionLike(node)
            || isIndexSignatureDeclaration(node)
            || isMappedTypeNode(node);
    }

    function checkEntityNameVisibility(entityName: EntityNameOrEntityNameExpression, enclosingDeclaration: Node) {
        const visibilityResult = resolver.isEntityNameVisible(entityName, enclosingDeclaration);
        handleSymbolAccessibilityError(visibilityResult);
    }

    function preserveJsDoc<T extends Node>(updated: T, original: Node): T {
        if (hasJSDocNodes(updated) && hasJSDocNodes(original)) {
            updated.jsDoc = original.jsDoc;
        }
        return setCommentRange(updated, getCommentRange(original));
    }

    function rewriteModuleSpecifier<T extends Node>(parent: ImportEqualsDeclaration | ImportDeclaration | ExportDeclaration | ModuleDeclaration | ImportTypeNode, input: T | undefined): T | StringLiteral {
        if (!input) return undefined!; // TODO: GH#18217
        resultHasExternalModuleIndicator = resultHasExternalModuleIndicator || (parent.kind !== SyntaxKind.ModuleDeclaration && parent.kind !== SyntaxKind.ImportType);
        if (isStringLiteralLike(input)) {
            if (isBundledEmit) {
                const newName = getExternalModuleNameFromDeclaration(context.getEmitHost(), resolver, parent);
                if (newName) {
                    return factory.createStringLiteral(newName);
                }
            }
        }
        return input;
    }

    function transformImportEqualsDeclaration(decl: ImportEqualsDeclaration) {
        if (!resolver.isDeclarationVisible(decl)) return;
        if (decl.moduleReference.kind === SyntaxKind.ExternalModuleReference) {
            // Rewrite external module names if necessary
            const specifier = getExternalModuleImportEqualsDeclarationExpression(decl);
            return factory.updateImportEqualsDeclaration(
                decl,
                decl.modifiers,
                decl.isTypeOnly,
                decl.name,
                factory.updateExternalModuleReference(decl.moduleReference, rewriteModuleSpecifier(decl, specifier)),
            );
        }
        else {
            const oldDiag = getSymbolAccessibilityDiagnostic;
            getSymbolAccessibilityDiagnostic = createGetSymbolAccessibilityDiagnosticForNode(decl);
            checkEntityNameVisibility(decl.moduleReference, enclosingDeclaration);
            getSymbolAccessibilityDiagnostic = oldDiag;
            return decl;
        }
    }

    function transformImportDeclaration(decl: ImportDeclaration) {
        if (!decl.importClause) {
            // import "mod" - possibly needed for side effects? (global interface patches, module augmentations, etc)
            return factory.updateImportDeclaration(
                decl,
                decl.modifiers,
                decl.importClause,
                rewriteModuleSpecifier(decl, decl.moduleSpecifier),
                tryGetResolutionModeOverride(decl.attributes),
            );
        }
        const phaseModifier = decl.importClause.phaseModifier === SyntaxKind.DeferKeyword ? undefined : decl.importClause.phaseModifier;
        // The `importClause` visibility corresponds to the default's visibility.
        const visibleDefaultBinding = decl.importClause && decl.importClause.name && resolver.isDeclarationVisible(decl.importClause) ? decl.importClause.name : undefined;
        if (!decl.importClause.namedBindings) {
            // No named bindings (either namespace or list), meaning the import is just default or should be elided
            return visibleDefaultBinding && factory.updateImportDeclaration(
                decl,
                decl.modifiers,
                factory.updateImportClause(
                    decl.importClause,
                    phaseModifier,
                    visibleDefaultBinding,
                    /*namedBindings*/ undefined,
                ),
                rewriteModuleSpecifier(decl, decl.moduleSpecifier),
                tryGetResolutionModeOverride(decl.attributes),
            );
        }
        if (decl.importClause.namedBindings.kind === SyntaxKind.NamespaceImport) {
            // Namespace import (optionally with visible default)
            const namedBindings = resolver.isDeclarationVisible(decl.importClause.namedBindings) ? decl.importClause.namedBindings : /*namedBindings*/ undefined;
            return visibleDefaultBinding || namedBindings ? factory.updateImportDeclaration(
                decl,
                decl.modifiers,
                factory.updateImportClause(
                    decl.importClause,
                    phaseModifier,
                    visibleDefaultBinding,
                    namedBindings,
                ),
                rewriteModuleSpecifier(decl, decl.moduleSpecifier),
                tryGetResolutionModeOverride(decl.attributes),
            ) : undefined;
        }
        // Named imports (optionally with visible default)
        const bindingList = mapDefined(decl.importClause.namedBindings.elements, b => resolver.isDeclarationVisible(b) ? b : undefined);
        if ((bindingList && bindingList.length) || visibleDefaultBinding) {
            return factory.updateImportDeclaration(
                decl,
                decl.modifiers,
                factory.updateImportClause(
                    decl.importClause,
                    phaseModifier,
                    visibleDefaultBinding,
                    bindingList && bindingList.length ? factory.updateNamedImports(decl.importClause.namedBindings, bindingList) : undefined,
                ),
                rewriteModuleSpecifier(decl, decl.moduleSpecifier),
                tryGetResolutionModeOverride(decl.attributes),
            );
        }
        // Augmentation of export depends on import
        if (resolver.isImportRequiredByAugmentation(decl)) {
            if (isolatedDeclarations) {
                context.addDiagnostic(createDiagnosticForNode(decl, Diagnostics.Declaration_emit_for_this_file_requires_preserving_this_import_for_augmentations_This_is_not_supported_with_isolatedDeclarations));
            }
            return factory.updateImportDeclaration(
                decl,
                decl.modifiers,
                /*importClause*/ undefined,
                rewriteModuleSpecifier(decl, decl.moduleSpecifier),
                tryGetResolutionModeOverride(decl.attributes),
            );
        }
        // Nothing visible
    }

    function tryGetResolutionModeOverride(node: ImportAttributes | undefined) {
        const mode = getResolutionModeOverride(node);
        return node && mode !== undefined ? node : undefined;
    }

    function transformAndReplaceLatePaintedStatements(statements: NodeArray<Statement>): NodeArray<Statement> {
        // This is a `while` loop because `handleSymbolAccessibilityError` can see additional import aliases marked as visible during
        // error handling which must now be included in the output and themselves checked for errors.
        // For example:
        // ```
        // module A {
        //   export module Q {}
        //   import B = Q;
        //   import C = B;
        //   export import D = C;
        // }
        // ```
        // In such a scenario, only Q and D are initially visible, but we don't consider imports as private names - instead we say they if they are referenced they must
        // be recorded. So while checking D's visibility we mark C as visible, then we must check C which in turn marks B, completing the chain of
        // dependent imports and allowing a valid declaration file output. Today, this dependent alias marking only happens for internal import aliases.
        while (length(lateMarkedStatements)) {
            const i = lateMarkedStatements!.shift()!;
            if (!isLateVisibilityPaintedStatement(i)) {
                return Debug.fail(`Late replaced statement was found which is not handled by the declaration transformer!: ${Debug.formatSyntaxKind((i as Node).kind)}`);
            }
            const priorNeedsDeclare = needsDeclare;
            needsDeclare = i.parent && isSourceFile(i.parent) && !(isExternalModule(i.parent) && isBundledEmit);
            const result = transformTopLevelDeclaration(i);
            needsDeclare = priorNeedsDeclare;
            lateStatementReplacementMap.set(getOriginalNodeId(i), result);
        }

        // And lastly, we need to get the final form of all those indetermine import declarations from before and add them to the output list
        // (and remove them from the set to examine for outter declarations)
        return visitNodes(statements, visitLateVisibilityMarkedStatements, isStatement);

        function visitLateVisibilityMarkedStatements(statement: Statement) {
            if (isLateVisibilityPaintedStatement(statement)) {
                const key = getOriginalNodeId(statement);
                if (lateStatementReplacementMap.has(key)) {
                    const result = lateStatementReplacementMap.get(key) as Statement | readonly Statement[] | undefined;
                    lateStatementReplacementMap.delete(key);
                    if (result) {
                        if (isArray(result) ? some(result, needsScopeMarker) : needsScopeMarker(result)) {
                            // Top-level declarations in .d.ts files are always considered exported even without a modifier unless there's an export assignment or specifier
                            needsScopeFixMarker = true;
                        }
                        if (isSourceFile(statement.parent) && (isArray(result) ? some(result, isExternalModuleIndicator) : isExternalModuleIndicator(result))) {
                            resultHasExternalModuleIndicator = true;
                        }
                    }
                    return result;
                }
            }
            return statement;
        }
    }

    function visitDeclarationSubtree(input: Node): VisitResult<Node | undefined> {
        if (shouldStripInternal(input)) return;
        if (isDeclaration(input)) {
            if (isDeclarationAndNotVisible(input)) return;
            if (hasDynamicName(input)) {
                if (isolatedDeclarations) {
                    // Classes and object literals usually elide properties with computed names that are not of a literal type
                    // In isolated declarations TSC needs to error on these as we don't know the type in a DTE.
                    if (!resolver.isDefinitelyReferenceToGlobalSymbolObject(input.name.expression)) {
                        if (isClassDeclaration(input.parent) || isObjectLiteralExpression(input.parent)) {
                            context.addDiagnostic(createDiagnosticForNode(input, Diagnostics.Computed_property_names_on_class_or_object_literals_cannot_be_inferred_with_isolatedDeclarations));
                            return;
                        }
                        else if (
                            // Type declarations just need to double-check that the input computed name is an entity name expression
                            (isInterfaceDeclaration(input.parent) || isTypeLiteralNode(input.parent))
                            && !isEntityNameExpression(input.name.expression)
                        ) {
                            context.addDiagnostic(createDiagnosticForNode(input, Diagnostics.Computed_properties_must_be_number_or_string_literals_variables_or_dotted_expressions_with_isolatedDeclarations));
                            return;
                        }
                    }
                }
                else if (!resolver.isLateBound(getParseTreeNode(input) as Declaration) || !isEntityNameExpression(input.name.expression)) {
                    return;
                }
            }
        }

        // Elide implementation signatures from overload sets
        if (isFunctionLike(input) && resolver.isImplementationOfOverload(input)) return;

        // Elide semicolon class statements
        if (isSemicolonClassElement(input)) return;

        let previousEnclosingDeclaration: typeof enclosingDeclaration;
        if (isEnclosingDeclaration(input)) {
            previousEnclosingDeclaration = enclosingDeclaration;
            enclosingDeclaration = input as Declaration;
        }
        const oldDiag = getSymbolAccessibilityDiagnostic;

        // Setup diagnostic-related flags before first potential `cleanup` call, otherwise
        // We'd see a TDZ violation at runtime
        const canProduceDiagnostic = canProduceDiagnostics(input);
        const oldWithinObjectLiteralType = suppressNewDiagnosticContexts;
        let shouldEnterSuppressNewDiagnosticsContextContext = (input.kind === SyntaxKind.TypeLiteral || input.kind === SyntaxKind.MappedType) && input.parent.kind !== SyntaxKind.TypeAliasDeclaration;

        // Emit methods which are private as properties with no type information
        if (isMethodDeclaration(input) || isMethodSignature(input)) {
            if (hasEffectiveModifier(input, ModifierFlags.Private)) {
                if (input.symbol && input.symbol.declarations && input.symbol.declarations[0] !== input) return; // Elide all but the first overload
                return cleanup(factory.createPropertyDeclaration(ensureModifiers(input), input.name, /*questionOrExclamationToken*/ undefined, /*type*/ undefined, /*initializer*/ undefined));
            }
        }

        if (canProduceDiagnostic && !suppressNewDiagnosticContexts) {
            getSymbolAccessibilityDiagnostic = createGetSymbolAccessibilityDiagnosticForNode(input);
        }

        if (isTypeQueryNode(input)) {
            checkEntityNameVisibility(input.exprName, enclosingDeclaration);
        }

        if (shouldEnterSuppressNewDiagnosticsContextContext) {
            // We stop making new diagnostic contexts within object literal types. Unless it's an object type on the RHS of a type alias declaration. Then we do.
            suppressNewDiagnosticContexts = true;
        }

        if (isProcessedComponent(input)) {
            switch (input.kind) {
                case SyntaxKind.ExpressionWithTypeArguments: {
                    if ((isEntityName(input.expression) || isEntityNameExpression(input.expression))) {
                        checkEntityNameVisibility(input.expression, enclosingDeclaration);
                    }
                    const node = visitEachChild(input, visitDeclarationSubtree, context);
                    return cleanup(factory.updateExpressionWithTypeArguments(node, node.expression, node.typeArguments));
                }
                case SyntaxKind.TypeReference: {
                    checkEntityNameVisibility(input.typeName, enclosingDeclaration);
                    const node = visitEachChild(input, visitDeclarationSubtree, context);
                    return cleanup(factory.updateTypeReferenceNode(node, node.typeName, node.typeArguments));
                }
                case SyntaxKind.ConstructSignature:
                    return cleanup(factory.updateConstructSignature(
                        input,
                        ensureTypeParams(input, input.typeParameters),
                        updateParamsList(input, input.parameters),
                        ensureType(input),
                    ));
                case SyntaxKind.Constructor: {
                    // A constructor declaration may not have a type annotation
                    const ctor = factory.createConstructorDeclaration(
                        /*modifiers*/ ensureModifiers(input),
                        updateParamsList(input, input.parameters, ModifierFlags.None),
                        /*body*/ undefined,
                    );
                    return cleanup(ctor);
                }
                case SyntaxKind.MethodDeclaration: {
                    if (isPrivateIdentifier(input.name)) {
                        return cleanup(/*returnValue*/ undefined);
                    }
                    const sig = factory.createMethodDeclaration(
                        ensureModifiers(input),
                        /*asteriskToken*/ undefined,
                        input.name,
                        input.questionToken,
                        ensureTypeParams(input, input.typeParameters),
                        updateParamsList(input, input.parameters),
                        ensureType(input),
                        /*body*/ undefined,
                    );
                    return cleanup(sig);
                }
                case SyntaxKind.GetAccessor: {
                    if (isPrivateIdentifier(input.name)) {
                        return cleanup(/*returnValue*/ undefined);
                    }
                    return cleanup(factory.updateGetAccessorDeclaration(
                        input,
                        ensureModifiers(input),
                        input.name,
                        updateAccessorParamsList(input, hasEffectiveModifier(input, ModifierFlags.Private)),
                        ensureType(input),
                        /*body*/ undefined,
                    ));
                }
                case SyntaxKind.SetAccessor: {
                    if (isPrivateIdentifier(input.name)) {
                        return cleanup(/*returnValue*/ undefined);
                    }
                    return cleanup(factory.updateSetAccessorDeclaration(
                        input,
                        ensureModifiers(input),
                        input.name,
                        updateAccessorParamsList(input, hasEffectiveModifier(input, ModifierFlags.Private)),
                        /*body*/ undefined,
                    ));
                }
                case SyntaxKind.PropertyDeclaration:
                    if (isPrivateIdentifier(input.name)) {
                        return cleanup(/*returnValue*/ undefined);
                    }
                    return cleanup(factory.updatePropertyDeclaration(
                        input,
                        ensureModifiers(input),
                        input.name,
                        input.questionToken,
                        ensureType(input),
                        ensureNoInitializer(input),
                    ));
                case SyntaxKind.PropertySignature:
                    if (isPrivateIdentifier(input.name)) {
                        return cleanup(/*returnValue*/ undefined);
                    }
                    return cleanup(factory.updatePropertySignature(
                        input,
                        ensureModifiers(input),
                        input.name,
                        input.questionToken,
                        ensureType(input),
                    ));
                case SyntaxKind.MethodSignature: {
                    if (isPrivateIdentifier(input.name)) {
                        return cleanup(/*returnValue*/ undefined);
                    }
                    return cleanup(factory.updateMethodSignature(
                        input,
                        ensureModifiers(input),
                        input.name,
                        input.questionToken,
                        ensureTypeParams(input, input.typeParameters),
                        updateParamsList(input, input.parameters),
                        ensureType(input),
                    ));
                }
                case SyntaxKind.CallSignature: {
                    return cleanup(
                        factory.updateCallSignature(
                            input,
                            ensureTypeParams(input, input.typeParameters),
                            updateParamsList(input, input.parameters),
                            ensureType(input),
                        ),
                    );
                }
                case SyntaxKind.IndexSignature: {
                    return cleanup(factory.updateIndexSignature(
                        input,
                        ensureModifiers(input),
                        updateParamsList(input, input.parameters),
                        visitNode(input.type, visitDeclarationSubtree, isTypeNode) || factory.createKeywordTypeNode(SyntaxKind.AnyKeyword),
                    ));
                }
                case SyntaxKind.VariableDeclaration: {
                    if (isBindingPattern(input.name)) {
                        return recreateBindingPattern(input.name);
                    }
                    shouldEnterSuppressNewDiagnosticsContextContext = true;
                    suppressNewDiagnosticContexts = true; // Variable declaration types also suppress new diagnostic contexts, provided the contexts wouldn't be made for binding pattern types
                    return cleanup(factory.updateVariableDeclaration(input, input.name, /*exclamationToken*/ undefined, ensureType(input), ensureNoInitializer(input)));
                }
                case SyntaxKind.TypeParameter: {
                    if (isPrivateMethodTypeParameter(input) && (input.default || input.constraint)) {
                        return cleanup(factory.updateTypeParameterDeclaration(input, input.modifiers, input.name, /*constraint*/ undefined, /*defaultType*/ undefined));
                    }
                    return cleanup(visitEachChild(input, visitDeclarationSubtree, context));
                }
                case SyntaxKind.ConditionalType: {
                    // We have to process conditional types in a special way because for visibility purposes we need to push a new enclosingDeclaration
                    // just for the `infer` types in the true branch. It's an implicit declaration scope that only applies to _part_ of the type.
                    const checkType = visitNode(input.checkType, visitDeclarationSubtree, isTypeNode);
                    const extendsType = visitNode(input.extendsType, visitDeclarationSubtree, isTypeNode);
                    const oldEnclosingDecl = enclosingDeclaration;
                    enclosingDeclaration = input.trueType;
                    const trueType = visitNode(input.trueType, visitDeclarationSubtree, isTypeNode);
                    enclosingDeclaration = oldEnclosingDecl;
                    const falseType = visitNode(input.falseType, visitDeclarationSubtree, isTypeNode);
                    Debug.assert(checkType);
                    Debug.assert(extendsType);
                    Debug.assert(trueType);
                    Debug.assert(falseType);
                    return cleanup(factory.updateConditionalTypeNode(input, checkType, extendsType, trueType, falseType));
                }
                case SyntaxKind.FunctionType: {
                    return cleanup(factory.updateFunctionTypeNode(
                        input,
                        visitNodes(input.typeParameters, visitDeclarationSubtree, isTypeParameterDeclaration),
                        updateParamsList(input, input.parameters),
                        Debug.checkDefined(visitNode(input.type, visitDeclarationSubtree, isTypeNode)),
                    ));
                }
                case SyntaxKind.ConstructorType: {
                    return cleanup(factory.updateConstructorTypeNode(
                        input,
                        ensureModifiers(input),
                        visitNodes(input.typeParameters, visitDeclarationSubtree, isTypeParameterDeclaration),
                        updateParamsList(input, input.parameters),
                        Debug.checkDefined(visitNode(input.type, visitDeclarationSubtree, isTypeNode)),
                    ));
                }
                case SyntaxKind.ImportType: {
                    if (!isLiteralImportTypeNode(input)) return cleanup(input);
                    return cleanup(factory.updateImportTypeNode(
                        input,
                        factory.updateLiteralTypeNode(input.argument, rewriteModuleSpecifier(input, input.argument.literal)),
                        input.attributes,
                        input.qualifier,
                        visitNodes(input.typeArguments, visitDeclarationSubtree, isTypeNode),
                        input.isTypeOf,
                    ));
                }
                default:
                    Debug.assertNever(input, `Attempted to process unhandled node kind: ${Debug.formatSyntaxKind((input as Node).kind)}`);
            }
        }

        if (isTupleTypeNode(input) && (getLineAndCharacterOfPosition(currentSourceFile, input.pos).line === getLineAndCharacterOfPosition(currentSourceFile, input.end).line)) {
            setEmitFlags(input, EmitFlags.SingleLine);
        }

        return cleanup(visitEachChild(input, visitDeclarationSubtree, context));

        function cleanup<T extends Node>(returnValue: T | undefined): T | undefined {
            if (returnValue && canProduceDiagnostic && hasDynamicName(input as Declaration)) {
                checkName(input);
            }
            if (isEnclosingDeclaration(input)) {
                enclosingDeclaration = previousEnclosingDeclaration;
            }
            if (canProduceDiagnostic && !suppressNewDiagnosticContexts) {
                getSymbolAccessibilityDiagnostic = oldDiag;
            }
            if (shouldEnterSuppressNewDiagnosticsContextContext) {
                suppressNewDiagnosticContexts = oldWithinObjectLiteralType;
            }
            if (returnValue === input) {
                return returnValue;
            }
            return returnValue && setOriginalNode(preserveJsDoc(returnValue, input), input);
        }
    }

    function isPrivateMethodTypeParameter(node: TypeParameterDeclaration) {
        return node.parent.kind === SyntaxKind.MethodDeclaration && hasEffectiveModifier(node.parent, ModifierFlags.Private);
    }

    function visitDeclarationStatements(input: Node): VisitResult<Node | undefined> {
        if (!isPreservedDeclarationStatement(input)) {
            // return undefined for unmatched kinds to omit them from the tree
            return;
        }
        if (shouldStripInternal(input)) return;

        switch (input.kind) {
            case SyntaxKind.ExportDeclaration: {
                if (isSourceFile(input.parent)) {
                    resultHasExternalModuleIndicator = true;
                }
                resultHasScopeMarker = true;
                // Rewrite external module names if necessary
                return factory.updateExportDeclaration(
                    input,
                    input.modifiers,
                    input.isTypeOnly,
                    input.exportClause,
                    rewriteModuleSpecifier(input, input.moduleSpecifier),
                    tryGetResolutionModeOverride(input.attributes),
                );
            }
            case SyntaxKind.ExportAssignment: {
                // Always visible if the parent node isn't dropped for being not visible
                if (isSourceFile(input.parent)) {
                    resultHasExternalModuleIndicator = true;
                }
                resultHasScopeMarker = true;
                if (input.expression.kind === SyntaxKind.Identifier) {
                    return input;
                }
                else {
                    const newId = factory.createUniqueName("_default", GeneratedIdentifierFlags.Optimistic);
                    getSymbolAccessibilityDiagnostic = () => ({
                        diagnosticMessage: Diagnostics.Default_export_of_the_module_has_or_is_using_private_name_0,
                        errorNode: input,
                    });
                    errorFallbackNode = input;
                    const type = ensureType(input);
                    const varDecl = factory.createVariableDeclaration(newId, /*exclamationToken*/ undefined, type, /*initializer*/ undefined);
                    errorFallbackNode = undefined;
                    const statement = factory.createVariableStatement(needsDeclare ? [factory.createModifier(SyntaxKind.DeclareKeyword)] : [], factory.createVariableDeclarationList([varDecl], NodeFlags.Const));

                    preserveJsDoc(statement, input);
                    removeAllComments(input);
                    return [statement, factory.updateExportAssignment(input, input.modifiers, newId)];
                }
            }
        }

        const result = transformTopLevelDeclaration(input);
        // Don't actually transform yet; just leave as original node - will be elided/swapped by late pass
        lateStatementReplacementMap.set(getOriginalNodeId(input), result);
        return input;
    }

    function stripExportModifiers(statement: Statement): Statement {
        if (isImportEqualsDeclaration(statement) || hasEffectiveModifier(statement, ModifierFlags.Default) || !canHaveModifiers(statement)) {
            // `export import` statements should remain as-is, as imports are _not_ implicitly exported in an ambient namespace
            // Likewise, `export default` classes and the like and just be `default`, so we preserve their `export` modifiers, too
            return statement;
        }

        const modifiers = factory.createModifiersFromModifierFlags(getEffectiveModifierFlags(statement) & (ModifierFlags.All ^ ModifierFlags.Export));
        return factory.replaceModifiers(statement, modifiers);
    }

    function updateModuleDeclarationAndKeyword(
        node: ModuleDeclaration,
        modifiers: readonly ModifierLike[] | undefined,
        name: ModuleName,
        body: ModuleBody | undefined,
    ) {
        const updated = factory.updateModuleDeclaration(node, modifiers, name, body);

        if (isAmbientModule(updated) || updated.flags & NodeFlags.Namespace) {
            return updated;
        }

        const fixed = factory.createModuleDeclaration(
            updated.modifiers,
            updated.name,
            updated.body,
            updated.flags | NodeFlags.Namespace,
        );

        setOriginalNode(fixed, updated);
        setTextRange(fixed, updated);

        return fixed;
    }

    function transformTopLevelDeclaration(input: LateVisibilityPaintedStatement) {
        if (lateMarkedStatements) {
            while (orderedRemoveItem(lateMarkedStatements, input));
        }
        if (shouldStripInternal(input)) return;
        switch (input.kind) {
            case SyntaxKind.ImportEqualsDeclaration: {
                return transformImportEqualsDeclaration(input);
            }
            case SyntaxKind.ImportDeclaration: {
                return transformImportDeclaration(input);
            }
        }
        if (isDeclaration(input) && isDeclarationAndNotVisible(input)) return;

        if (isJSDocImportTag(input)) return;

        // Elide implementation signatures from overload sets
        if (isFunctionLike(input) && resolver.isImplementationOfOverload(input)) return;

        let previousEnclosingDeclaration: typeof enclosingDeclaration;
        if (isEnclosingDeclaration(input)) {
            previousEnclosingDeclaration = enclosingDeclaration;
            enclosingDeclaration = input as Declaration;
        }

        const canProdiceDiagnostic = canProduceDiagnostics(input);
        const oldDiag = getSymbolAccessibilityDiagnostic;
        if (canProdiceDiagnostic) {
            getSymbolAccessibilityDiagnostic = createGetSymbolAccessibilityDiagnosticForNode(input as DeclarationDiagnosticProducing);
        }

        const previousNeedsDeclare = needsDeclare;
        switch (input.kind) {
            case SyntaxKind.TypeAliasDeclaration: {
                needsDeclare = false;
                const clean = cleanup(factory.updateTypeAliasDeclaration(
                    input,
                    ensureModifiers(input),
                    input.name,
                    visitNodes(input.typeParameters, visitDeclarationSubtree, isTypeParameterDeclaration),
                    Debug.checkDefined(visitNode(input.type, visitDeclarationSubtree, isTypeNode)),
                ));
                needsDeclare = previousNeedsDeclare;
                return clean;
            }
            case SyntaxKind.InterfaceDeclaration: {
                return cleanup(factory.updateInterfaceDeclaration(
                    input,
                    ensureModifiers(input),
                    input.name,
                    ensureTypeParams(input, input.typeParameters),
                    transformHeritageClauses(input.heritageClauses),
                    visitNodes(input.members, visitDeclarationSubtree, isTypeElement),
                ));
            }
            case SyntaxKind.FunctionDeclaration: {
                // Generators lose their generator-ness, excepting their return type
                const clean = cleanup(factory.updateFunctionDeclaration(
                    input,
                    ensureModifiers(input),
                    /*asteriskToken*/ undefined,
                    input.name,
                    ensureTypeParams(input, input.typeParameters),
                    updateParamsList(input, input.parameters),
                    ensureType(input),
                    /*body*/ undefined,
                ));
                if (clean && resolver.isExpandoFunctionDeclaration(input) && shouldEmitFunctionProperties(input)) {
                    const props = resolver.getPropertiesOfContainerFunction(input);

                    if (isolatedDeclarations) {
                        reportExpandoFunctionErrors(input);
                    }
                    // Use parseNodeFactory so it is usable as an enclosing declaration
                    const fakespace = parseNodeFactory.createModuleDeclaration(/*modifiers*/ undefined, clean.name || factory.createIdentifier("_default"), factory.createModuleBlock([]), NodeFlags.Namespace);
                    setParent(fakespace, enclosingDeclaration as SourceFile | NamespaceDeclaration);
                    fakespace.locals = createSymbolTable(props);
                    fakespace.symbol = props[0].parent!;
                    const exportMappings: [Identifier, string][] = [];
                    let declarations: (VariableStatement | ExportDeclaration)[] = mapDefined(props, p => {
                        if (!isExpandoPropertyDeclaration(p.valueDeclaration)) {
                            return undefined;
                        }
                        const nameStr = unescapeLeadingUnderscores(p.escapedName);
                        if (!isIdentifierText(nameStr, ScriptTarget.ESNext)) {
                            return undefined; // unique symbol or non-identifier name - omit, since there's no syntax that can preserve it
                        }
                        getSymbolAccessibilityDiagnostic = createGetSymbolAccessibilityDiagnosticForNode(p.valueDeclaration);
                        const type = resolver.createTypeOfDeclaration(p.valueDeclaration, fakespace, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags | InternalNodeBuilderFlags.NoSyntacticPrinter, symbolTracker);
                        getSymbolAccessibilityDiagnostic = oldDiag;
                        const isNonContextualKeywordName = isStringANonContextualKeyword(nameStr);
                        const name = isNonContextualKeywordName ? factory.getGeneratedNameForNode(p.valueDeclaration) : factory.createIdentifier(nameStr);
                        if (isNonContextualKeywordName) {
                            exportMappings.push([name, nameStr]);
                        }
                        const varDecl = factory.createVariableDeclaration(name, /*exclamationToken*/ undefined, type, /*initializer*/ undefined);
                        return factory.createVariableStatement(isNonContextualKeywordName ? undefined : [factory.createToken(SyntaxKind.ExportKeyword)], factory.createVariableDeclarationList([varDecl]));
                    });
                    if (!exportMappings.length) {
                        declarations = mapDefined(declarations, declaration => factory.replaceModifiers(declaration, ModifierFlags.None));
                    }
                    else {
                        declarations.push(factory.createExportDeclaration(
                            /*modifiers*/ undefined,
                            /*isTypeOnly*/ false,
                            factory.createNamedExports(map(exportMappings, ([gen, exp]) => {
                                return factory.createExportSpecifier(/*isTypeOnly*/ false, gen, exp);
                            })),
                        ));
                    }
                    const namespaceDecl = factory.createModuleDeclaration(ensureModifiers(input), input.name!, factory.createModuleBlock(declarations), NodeFlags.Namespace);
                    if (!hasEffectiveModifier(clean, ModifierFlags.Default)) {
                        return [clean, namespaceDecl];
                    }

                    const modifiers = factory.createModifiersFromModifierFlags((getEffectiveModifierFlags(clean) & ~ModifierFlags.ExportDefault) | ModifierFlags.Ambient);
                    const cleanDeclaration = factory.updateFunctionDeclaration(
                        clean,
                        modifiers,
                        /*asteriskToken*/ undefined,
                        clean.name,
                        clean.typeParameters,
                        clean.parameters,
                        clean.type,
                        /*body*/ undefined,
                    );

                    const namespaceDeclaration = factory.updateModuleDeclaration(
                        namespaceDecl,
                        modifiers,
                        namespaceDecl.name,
                        namespaceDecl.body,
                    );

                    const exportDefaultDeclaration = factory.createExportAssignment(
                        /*modifiers*/ undefined,
                        /*isExportEquals*/ false,
                        namespaceDecl.name,
                    );

                    if (isSourceFile(input.parent)) {
                        resultHasExternalModuleIndicator = true;
                    }
                    resultHasScopeMarker = true;

                    return [cleanDeclaration, namespaceDeclaration, exportDefaultDeclaration];
                }
                else {
                    return clean;
                }
            }
            case SyntaxKind.ModuleDeclaration: {
                needsDeclare = false;
                const inner = input.body;
                if (inner && inner.kind === SyntaxKind.ModuleBlock) {
                    const oldNeedsScopeFix = needsScopeFixMarker;
                    const oldHasScopeFix = resultHasScopeMarker;
                    resultHasScopeMarker = false;
                    needsScopeFixMarker = false;
                    const statements = visitNodes(inner.statements, visitDeclarationStatements, isStatement);
                    let lateStatements = transformAndReplaceLatePaintedStatements(statements);
                    if (input.flags & NodeFlags.Ambient) {
                        needsScopeFixMarker = false; // If it was `declare`'d everything is implicitly exported already, ignore late printed "privates"
                    }
                    // With the final list of statements, there are 3 possibilities:
                    // 1. There's an export assignment or export declaration in the namespace - do nothing
                    // 2. Everything is exported and there are no export assignments or export declarations - strip all export modifiers
                    // 3. Some things are exported, some are not, and there's no marker - add an empty marker
                    if (!isGlobalScopeAugmentation(input) && !hasScopeMarker(lateStatements) && !resultHasScopeMarker) {
                        if (needsScopeFixMarker) {
                            lateStatements = factory.createNodeArray([...lateStatements, createEmptyExports(factory)]);
                        }
                        else {
                            lateStatements = visitNodes(lateStatements, stripExportModifiers, isStatement);
                        }
                    }
                    const schemaModelDeclarations = createEffectSchemaModelDeclarations(input, lateStatements);
                    if (schemaModelDeclarations) {
                        lateStatements = factory.createNodeArray(schemaModelDeclarations.namespaceStatements);
                    }
                    const body = factory.updateModuleBlock(inner, lateStatements);
                    needsDeclare = previousNeedsDeclare;
                    needsScopeFixMarker = oldNeedsScopeFix;
                    resultHasScopeMarker = oldHasScopeFix;
                    const mods = ensureModifiers(input);

                    const updated = cleanup(updateModuleDeclarationAndKeyword(
                        input,
                        mods,
                        isExternalModuleAugmentation(input) ? rewriteModuleSpecifier(input, input.name) : input.name,
                        body,
                    ));
                    return schemaModelDeclarations?.typeInterface && updated ? [schemaModelDeclarations.typeInterface, updated] : updated;
                }
                else {
                    needsDeclare = previousNeedsDeclare;
                    const mods = ensureModifiers(input);
                    needsDeclare = false;
                    visitNode(inner, visitDeclarationStatements);
                    // eagerly transform nested namespaces (the nesting doesn't need any elision or painting done)
                    const id = getOriginalNodeId(inner!); // TODO: GH#18217
                    const body = lateStatementReplacementMap.get(id);
                    lateStatementReplacementMap.delete(id);
                    return cleanup(updateModuleDeclarationAndKeyword(
                        input,
                        mods,
                        input.name,
                        body as ModuleBody,
                    ));
                }
            }
            case SyntaxKind.ClassDeclaration: {
                errorNameNode = input.name;
                errorFallbackNode = input;
                const modifiers = factory.createNodeArray(ensureModifiers(input));
                const typeParameters = ensureTypeParams(input, input.typeParameters);
                const ctor = getFirstConstructorWithBody(input);
                let parameterProperties: readonly PropertyDeclaration[] | undefined;
                if (ctor) {
                    const oldDiag = getSymbolAccessibilityDiagnostic;
                    parameterProperties = compact(flatMap(ctor.parameters, param => {
                        if (!hasSyntacticModifier(param, ModifierFlags.ParameterPropertyModifier) || shouldStripInternal(param)) return;
                        getSymbolAccessibilityDiagnostic = createGetSymbolAccessibilityDiagnosticForNode(param);
                        if (param.name.kind === SyntaxKind.Identifier) {
                            return preserveJsDoc(
                                factory.createPropertyDeclaration(
                                    ensureModifiers(param),
                                    param.name,
                                    param.questionToken,
                                    ensureType(param),
                                    ensureNoInitializer(param),
                                ),
                                param,
                            );
                        }
                        else {
                            // Pattern - this is currently an error, but we emit declarations for it somewhat correctly
                            return walkBindingPattern(param.name);
                        }

                        function walkBindingPattern(pattern: BindingPattern) {
                            let elems: PropertyDeclaration[] | undefined;
                            for (const elem of pattern.elements) {
                                if (isOmittedExpression(elem)) continue;
                                if (isBindingPattern(elem.name)) {
                                    elems = concatenate(elems, walkBindingPattern(elem.name));
                                    continue;
                                }
                                elems = elems || [];
                                elems.push(factory.createPropertyDeclaration(
                                    ensureModifiers(param),
                                    elem.name,
                                    /*questionOrExclamationToken*/ undefined,
                                    ensureType(elem),
                                    /*initializer*/ undefined,
                                ));
                            }
                            return elems;
                        }
                    }));
                    getSymbolAccessibilityDiagnostic = oldDiag;
                }

                const hasPrivateIdentifier = some(input.members, member => !!member.name && isPrivateIdentifier(member.name));
                // When the class has at least one private identifier, create a unique constant identifier to retain the nominal typing behavior
                // Prevents other classes with the same public members from being used in place of the current class
                const privateIdentifier = hasPrivateIdentifier ? [
                    factory.createPropertyDeclaration(
                        /*modifiers*/ undefined,
                        factory.createPrivateIdentifier("#private"),
                        /*questionOrExclamationToken*/ undefined,
                        /*type*/ undefined,
                        /*initializer*/ undefined,
                    ),
                ] : undefined;
                const lateIndexes = resolver.createLateBoundIndexSignatures(input, enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
                const memberNodes = concatenate(concatenate(concatenate<ClassElement>(privateIdentifier, lateIndexes), parameterProperties), visitNodes(input.members, visitDeclarationSubtree, isClassElement));
                const members = factory.createNodeArray(memberNodes);

                const extendsClause = getEffectiveBaseTypeNode(input);
                if (extendsClause && !isEntityNameExpression(extendsClause.expression) && extendsClause.expression.kind !== SyntaxKind.NullKeyword) {
                    // We must add a temporary declaration for the extends clause expression

                    const oldId = input.name ? unescapeLeadingUnderscores(input.name.escapedText) : "default";
                    const newId = factory.createUniqueName(`${oldId}_base`, GeneratedIdentifierFlags.Optimistic);
                    getSymbolAccessibilityDiagnostic = () => ({
                        diagnosticMessage: Diagnostics.extends_clause_of_exported_class_0_has_or_is_using_private_name_1,
                        errorNode: extendsClause,
                        typeName: input.name,
                    });
                    const varDecl = factory.createVariableDeclaration(newId, /*exclamationToken*/ undefined, resolver.createTypeOfExpression(extendsClause.expression, input, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker), /*initializer*/ undefined);
                    const statement = factory.createVariableStatement(needsDeclare ? [factory.createModifier(SyntaxKind.DeclareKeyword)] : [], factory.createVariableDeclarationList([varDecl], NodeFlags.Const));
                    const heritageClauses = factory.createNodeArray(map(input.heritageClauses, clause => {
                        if (clause.token === SyntaxKind.ExtendsKeyword) {
                            const oldDiag = getSymbolAccessibilityDiagnostic;
                            getSymbolAccessibilityDiagnostic = createGetSymbolAccessibilityDiagnosticForNode(clause.types[0]);
                            const newClause = factory.updateHeritageClause(clause, map(clause.types, t => factory.updateExpressionWithTypeArguments(t, newId, visitNodes(t.typeArguments, visitDeclarationSubtree, isTypeNode))));
                            getSymbolAccessibilityDiagnostic = oldDiag;
                            return newClause;
                        }
                        return factory.updateHeritageClause(clause, visitNodes(factory.createNodeArray(filter(clause.types, t => isEntityNameExpression(t.expression) || t.expression.kind === SyntaxKind.NullKeyword)), visitDeclarationSubtree, isExpressionWithTypeArguments));
                    }));
                    return [
                        statement,
                        cleanup(factory.updateClassDeclaration(
                            input,
                            modifiers,
                            input.name,
                            typeParameters,
                            heritageClauses,
                            members,
                        ))!,
                    ]; // TODO: GH#18217
                }
                else {
                    const heritageClauses = transformHeritageClauses(input.heritageClauses);
                    return cleanup(factory.updateClassDeclaration(
                        input,
                        modifiers,
                        input.name,
                        typeParameters,
                        heritageClauses,
                        members,
                    ));
                }
            }
            case SyntaxKind.VariableStatement: {
                return cleanup(transformVariableStatement(input));
            }
            case SyntaxKind.EnumDeclaration: {
                return cleanup(factory.updateEnumDeclaration(
                    input,
                    factory.createNodeArray(ensureModifiers(input)),
                    input.name,
                    factory.createNodeArray(mapDefined(input.members, m => {
                        if (shouldStripInternal(m)) return;
                        // Rewrite enum values to their constants, if available
                        const enumValue = resolver.getEnumMemberValue(m);
                        const constValue = enumValue?.value;
                        if (
                            isolatedDeclarations && m.initializer && enumValue?.hasExternalReferences &&
                            // This will be its own compiler error instead, so don't report.
                            !isComputedPropertyName(m.name)
                        ) {
                            context.addDiagnostic(createDiagnosticForNode(m, Diagnostics.Enum_member_initializers_must_be_computable_without_references_to_external_symbols_with_isolatedDeclarations));
                        }
                        const newInitializer = constValue === undefined ? undefined
                            : typeof constValue === "string" ? factory.createStringLiteral(constValue)
                            : constValue < 0 ? factory.createPrefixUnaryExpression(SyntaxKind.MinusToken, factory.createNumericLiteral(-constValue))
                            : factory.createNumericLiteral(constValue);
                        return preserveJsDoc(factory.updateEnumMember(m, m.name, newInitializer), m);
                    })),
                ));
            }
        }
        // Anything left unhandled is an error, so this should be unreachable
        return Debug.assertNever(input, `Unhandled top-level node in declaration emit: ${Debug.formatSyntaxKind((input as Node).kind)}`);

        function cleanup<T extends Node>(node: T | undefined): T | undefined {
            if (isEnclosingDeclaration(input)) {
                enclosingDeclaration = previousEnclosingDeclaration;
            }
            if (canProdiceDiagnostic) {
                getSymbolAccessibilityDiagnostic = oldDiag;
            }
            if (input.kind === SyntaxKind.ModuleDeclaration) {
                needsDeclare = previousNeedsDeclare;
            }
            if (node as Node === input) {
                return node;
            }
            errorFallbackNode = undefined;
            errorNameNode = undefined;
            return node && setOriginalNode(preserveJsDoc(node, input), input);
        }
    }

    function transformVariableStatement(input: VariableStatement) {
        if (!forEach(input.declarationList.declarations, getBindingNameVisible)) return;
        const nodes = visitNodes(input.declarationList.declarations, visitDeclarationSubtree, isVariableDeclaration);
        if (!length(nodes)) return;

        const modifiers = factory.createNodeArray(ensureModifiers(input));
        let declList: VariableDeclarationList;
        if (isVarUsing(input.declarationList) || isVarAwaitUsing(input.declarationList)) {
            declList = factory.createVariableDeclarationList(nodes, NodeFlags.Const);
            setOriginalNode(declList, input.declarationList);
            setTextRange(declList, input.declarationList);
            setCommentRange(declList, input.declarationList);
        }
        else {
            declList = factory.updateVariableDeclarationList(input.declarationList, nodes);
        }
        return factory.updateVariableStatement(input, modifiers, declList);
    }

    function recreateBindingPattern(d: BindingPattern): VariableDeclaration[] {
        return flatten<VariableDeclaration>(mapDefined(d.elements, e => recreateBindingElement(e)));
    }

    function recreateBindingElement(e: ArrayBindingElement) {
        if (e.kind === SyntaxKind.OmittedExpression) {
            return;
        }
        if (e.name) {
            if (!getBindingNameVisible(e)) return;
            if (isBindingPattern(e.name)) {
                return recreateBindingPattern(e.name);
            }
            else {
                return factory.createVariableDeclaration(e.name, /*exclamationToken*/ undefined, ensureType(e), /*initializer*/ undefined);
            }
        }
    }

    function checkName(node: DeclarationDiagnosticProducing) {
        let oldDiag: typeof getSymbolAccessibilityDiagnostic | undefined;
        if (!suppressNewDiagnosticContexts) {
            oldDiag = getSymbolAccessibilityDiagnostic;
            getSymbolAccessibilityDiagnostic = createGetSymbolAccessibilityDiagnosticForNodeName(node);
        }
        errorNameNode = (node as NamedDeclaration).name;
        Debug.assert(hasDynamicName(node as NamedDeclaration)); // Should only be called with dynamic names
        const decl = node as NamedDeclaration as LateBoundDeclaration;
        const entityName = decl.name.expression;
        checkEntityNameVisibility(entityName, enclosingDeclaration);
        if (!suppressNewDiagnosticContexts) {
            getSymbolAccessibilityDiagnostic = oldDiag!;
        }
        errorNameNode = undefined;
    }

    function shouldStripInternal(node: Node) {
        return !!stripInternal && !!node && isInternalDeclaration(node, currentSourceFile);
    }

    function isScopeMarker(node: Node) {
        return isExportAssignment(node) || isExportDeclaration(node);
    }

    function hasScopeMarker(statements: readonly Statement[]) {
        return some(statements, isScopeMarker);
    }

    function ensureModifiers<T extends HasModifiers>(node: T): readonly Modifier[] | undefined {
        const currentFlags = getEffectiveModifierFlags(node);
        const newFlags = ensureModifierFlags(node);
        if (currentFlags === newFlags) {
            return visitArray(node.modifiers, n => tryCast(n, isModifier), isModifier);
        }
        return factory.createModifiersFromModifierFlags(newFlags);
    }

    function ensureModifierFlags(node: Node): ModifierFlags {
        let mask = ModifierFlags.All ^ (ModifierFlags.Public | ModifierFlags.Async | ModifierFlags.Override); // No async and override modifiers in declaration files
        let additions = (needsDeclare && !isAlwaysType(node)) ? ModifierFlags.Ambient : ModifierFlags.None;
        const parentIsFile = node.parent.kind === SyntaxKind.SourceFile;
        if (!parentIsFile || (isBundledEmit && parentIsFile && isExternalModule(node.parent as SourceFile))) {
            mask ^= ModifierFlags.Ambient;
            additions = ModifierFlags.None;
        }
        return maskModifierFlags(node, mask, additions);
    }

    function transformHeritageClauses(nodes: NodeArray<HeritageClause> | undefined) {
        return factory.createNodeArray(filter(
            map(nodes, clause =>
                factory.updateHeritageClause(
                    clause,
                    visitNodes(
                        factory.createNodeArray(filter(clause.types, t => {
                            return isEntityNameExpression(t.expression) || (clause.token === SyntaxKind.ExtendsKeyword && t.expression.kind === SyntaxKind.NullKeyword);
                        })),
                        visitDeclarationSubtree,
                        isExpressionWithTypeArguments,
                    ),
                )),
            clause => clause.types && !!clause.types.length,
        ));
    }

    function createEffectSchemaModelDeclarations(input: ModuleDeclaration, statements: NodeArray<Statement>) {
        if (input.name.kind !== SyntaxKind.Identifier) return;
        const encoded = statements.find(isEffectSchemaStructNestedEncodedInterface);
        if (!encoded) return;

        const encodedLiteral = materializeSchemaNestedEncoded(encoded);

        let changed = false;
        const namespaceStatements: Statement[] = [...flatMap(statements, statement => {
            if (statement === encoded && encodedLiteral) {
                changed = true;
                const next: Statement[] = [factory.createInterfaceDeclaration(
                    encoded.modifiers,
                    encoded.name,
                    encoded.typeParameters,
                    /*heritageClauses*/ undefined,
                    encodedLiteral.members,
                )];
                return next;
            }
            return [statement];
        })];

        return changed ? { typeInterface: undefined, namespaceStatements } : undefined;
    }

    function isEffectSchemaStructNestedEncodedInterface(statement: Statement): statement is InterfaceDeclaration {
        if (!isInterfaceDeclaration(statement) || idText(statement.name) !== "Encoded") return false;
        const clause = statement.heritageClauses?.[0];
        const heritageType = clause?.types[0];
        if (!heritageType || clause!.types.length !== 1 || heritageType.typeArguments?.length !== 1) return false;
        const expression = heritageType.expression;
        return isPropertyAccessExpression(expression)
            && idText(expression.name) === "StructNestedEncoded"
            && heritageType.typeArguments[0].kind === SyntaxKind.TypeQuery;
    }

    function materializeSchemaNestedEncoded(encoded: InterfaceDeclaration) {
        const heritageType = encoded.heritageClauses![0].types[0];
        const typeName = expressionToEntityName(heritageType.expression);
        if (!typeName) return;
        const typeNode = factory.createTypeReferenceNode(typeName, heritageType.typeArguments);
        setParent(typeNode, encoded);
        return resolver.createTypeLiteralOfTypeNode(typeNode, enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
    }

    function createEffectSchemaSourceFileDeclarations(statements: NodeArray<Statement>): Statement[] {
        const modelNames = new Set<string>();
        const existingNamespaceNames = new Set<string>();
        const classes = new Map<string, ClassDeclaration>();
        const schemaClasses = getEffectSchemaOriginalClasses();
        for (const statement of statements) {
            const className = getEffectSchemaClassName(statement);
            if (className && isClassDeclaration(statement)) {
                classes.set(className, statement);
            }
        }
        for (const statement of statements) {
            if ((isEffectSchemaModelNamespace(statement) || isEffectSchemaMaterializedModelNamespace(statement, classes)) && schemaClasses.has(idText(statement.name))) {
                modelNames.add(idText(statement.name));
                existingNamespaceNames.add(idText(statement.name));
            }
        }
        const requestBaseInfos = new Map<string, EffectSchemaRequestBaseInfo>();
        for (const statement of statements) {
            const info = getEffectSchemaRequestBaseInfo(statement);
            if (info && classes.has(info.modelName) && !schemaClasses.has(info.modelName)) {
                requestBaseInfos.set(info.modelName, info);
            }
        }
        for (const [className, classDeclaration] of schemaClasses) {
            if (!existingNamespaceNames.has(className) && canCreateEffectSchemaGeneratedNamespace(classDeclaration)) {
                modelNames.add(className);
            }
        }
        if (!modelNames.size && !requestBaseInfos.size) return [...statements];

        let changed = false;
        const next: Statement[] = [];
        for (const statement of statements) {
            const baseModelName = getEffectSchemaBaseModelName(statement);
            if (baseModelName && modelNames.has(baseModelName)) {
                const classDeclaration = schemaClasses.get(baseModelName) || classes.get(baseModelName);
                const updated = classDeclaration && updateEffectSchemaBaseDeclaration(
                    statement,
                    baseModelName,
                    classDeclaration,
                    needsEffectSchemaIntermediateClass(classDeclaration),
                );
                if (updated) {
                    changed = true;
                    next.push(updated);
                    continue;
                }
            }
            const requestBaseInfo = baseModelName && requestBaseInfos.get(baseModelName);
            if (requestBaseInfo) {
                const updated = updateEffectSchemaRequestBaseDeclaration(statement, requestBaseInfo);
                if (updated) {
                    changed = true;
                    next.push(updated);
                    continue;
                }
            }
            if (isEffectSchemaModelNamespace(statement)) {
                const classDeclaration = schemaClasses.get(idText(statement.name)) || classes.get(idText(statement.name));
                const updated = classDeclaration && updateEffectSchemaNamespaceDeclaration(statement, classDeclaration);
                if (updated) {
                    changed = true;
                    next.push(updated);
                    continue;
                }
            }
            if (isEffectSchemaMaterializedModelNamespace(statement, classes)) {
                const classDeclaration = schemaClasses.get(idText(statement.name)) || classes.get(idText(statement.name));
                const updated = classDeclaration && updateEffectSchemaNamespaceDeclaration(statement, classDeclaration);
                if (updated) {
                    changed = true;
                    next.push(updated);
                    continue;
                }
            }
            const className = getEffectSchemaClassName(statement);
            const requestInfo = className && requestBaseInfos.get(className);
            if (requestInfo) {
                const classDeclaration = statement as ClassDeclaration;
                const typeInterface = !hasTopLevelInterface(statements, className)
                    ? createEffectSchemaTypeInterface(classDeclaration)
                    : undefined;
                const namespace = !hasTopLevelNamespace(statements, className)
                    ? createEffectSchemaGeneratedNamespaceDeclaration(className, classDeclaration)
                    : undefined;
                if (typeInterface || namespace) {
                    changed = true;
                    next.push(statement);
                    if (typeInterface) next.push(typeInterface);
                    if (namespace) next.push(namespace);
                    continue;
                }
            }
            if (className && modelNames.has(className)) {
                const classDeclaration = schemaClasses.get(className) || statement as ClassDeclaration;
                const usesIntermediateClass = needsEffectSchemaIntermediateClass(classDeclaration);
                const updatedClass = usesIntermediateClass
                    ? updateEffectSchemaClassDeclaration(statement as ClassDeclaration, className)
                    : statement;
                const typeInterface = !hasTopLevelInterface(statements, className)
                    ? createEffectSchemaTypeInterface(classDeclaration)
                    : undefined;
                const namespace = !existingNamespaceNames.has(className)
                    ? createEffectSchemaGeneratedNamespaceDeclaration(className, classDeclaration)
                    : undefined;
                if (updatedClass !== statement || typeInterface || namespace) {
                    changed = true;
                    if (usesIntermediateClass) {
                        next.push(createEffectSchemaIntermediateClass(className));
                    }
                    next.push(updatedClass);
                    if (typeInterface) next.push(typeInterface);
                    if (namespace) {
                        existingNamespaceNames.add(className);
                        next.push(namespace);
                    }
                    continue;
                }
            }
            next.push(statement);
        }
        return changed ? next : [...statements];
    }

    function getEffectSchemaOriginalClasses() {
        const classes = new Map<string, ClassDeclaration>();
        for (const statement of currentSourceFile.statements) {
            if (isClassDeclaration(statement) && statement.name && hasEffectSchemaOpaqueHeritage(statement)) {
                classes.set(idText(statement.name), statement);
            }
        }
        return classes;
    }

    function hasEffectSchemaOpaqueHeritage(classDeclaration: ClassDeclaration) {
        const heritageType = classDeclaration.heritageClauses?.[0]?.types[0];
        let expression: Node | undefined = heritageType?.expression;
        if (!expression) return false;
        if (expression.kind === SyntaxKind.CallExpression) {
            expression = (expression as unknown as { expression: Node }).expression;
        }
        if (expression.kind === SyntaxKind.CallExpression) {
            expression = (expression as unknown as { expression: Node }).expression;
        }
        return isEffectSchemaOpaqueExpression(expression);
    }

    function isEffectSchemaOpaqueExpression(expression: Node) {
        return isPropertyAccessExpression(expression)
            && (idText(expression.name) === "Opaque" || idText(expression.name) === "OpaqueFacade")
            && expression.expression.kind === SyntaxKind.Identifier
            && (idText(expression.expression as Identifier) === "S" || idText(expression.expression as Identifier) === "Schema");
    }

    function isEffectSchemaModelNamespace(statement: Statement): statement is ModuleDeclaration & { name: Identifier } {
        if (!isModuleDeclaration(statement) || statement.name.kind !== SyntaxKind.Identifier) return false;
        const body = statement.body;
        // Only transform plain `StructNestedEncoded` struct models. Skip edge cases
        // (ExtendedSchema, unions, `type Encoded = Codec.Encoded<...>` aliases) which the
        // class-base/Type-interface rewrite cannot reconstruct soundly.
        return !!body && body.kind === SyntaxKind.ModuleBlock && some(body.statements, isEffectSchemaStructNestedEncodedInterface);
    }

    function isEffectSchemaMaterializedModelNamespace(statement: Statement, classes: Map<string, ClassDeclaration>): statement is ModuleDeclaration & { name: Identifier } {
        if (!isModuleDeclaration(statement) || statement.name.kind !== SyntaxKind.Identifier || !classes.has(idText(statement.name))) return false;
        const body = statement.body;
        return !!body && body.kind === SyntaxKind.ModuleBlock && some(body.statements, isEffectSchemaEncodedInterface);
    }

    function isEffectSchemaEncodedInterface(statement: Statement): statement is InterfaceDeclaration {
        return isInterfaceDeclaration(statement) && idText(statement.name) === "Encoded";
    }

    function canCreateEffectSchemaGeneratedNamespace(classDeclaration: ClassDeclaration) {
        return !!createEffectSchemaEncodedDeclaration(classDeclaration);
    }

    function getEffectSchemaClassName(statement: Statement): string | undefined {
        return isClassDeclaration(statement) && statement.name ? idText(statement.name) : undefined;
    }

    function hasTopLevelInterface(statements: NodeArray<Statement>, name: string): boolean {
        return some(statements, statement => isInterfaceDeclaration(statement) && idText(statement.name) === name);
    }

    function hasTopLevelNamespace(statements: NodeArray<Statement>, name: string): boolean {
        return some(statements, statement => isModuleDeclaration(statement) && statement.name.kind === SyntaxKind.Identifier && idText(statement.name) === name);
    }

    function createEffectSchemaTypeInterface(classDeclaration: ClassDeclaration) {
        if (!classDeclaration.name) return;
        const literal = resolver.createTypeLiteralOfClassDeclaration(classDeclaration, enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
        return literal && factory.createInterfaceDeclaration(
            createEffectSchemaNamespaceModifiers(classDeclaration, /*includeDeclare*/ false),
            classDeclaration.name,
            /*typeParameters*/ undefined,
            /*heritageClauses*/ undefined,
            literal.members,
        );
    }

    function updateEffectSchemaNamespaceDeclaration(namespace: ModuleDeclaration & { name: Identifier }, classDeclaration: ClassDeclaration) {
        const body = namespace.body;
        if (!body || body.kind !== SyntaxKind.ModuleBlock) return;
        const existing = new Set<string>();
        const kept: Statement[] = [];
        for (const statement of body.statements) {
            if ((isInterfaceDeclaration(statement) || isTypeAliasDeclaration(statement)) && idText(statement.name) !== "Encoded") {
                existing.add(idText(statement.name));
                if (idText(statement.name) === "Make" || idText(statement.name) === "DecodingServices" || idText(statement.name) === "EncodingServices") {
                    continue;
                }
            }
            kept.push(statement);
        }
        const makeDeclaration = createEffectSchemaMakeDeclaration(classDeclaration);
        const decodingServices = createEffectSchemaServiceDeclaration(classDeclaration, "DecodingServices");
        const encodingServices = createEffectSchemaServiceDeclaration(classDeclaration, "EncodingServices");
        const additions: Statement[] = [];
        if (makeDeclaration) additions.push(makeDeclaration);
        if (decodingServices) additions.push(decodingServices);
        if (encodingServices) additions.push(encodingServices);
        if (!additions.length && existing.size === 0) return;
        return factory.updateModuleDeclaration(
            namespace,
            namespace.modifiers,
            namespace.name,
            factory.updateModuleBlock(body, factory.createNodeArray([...kept, ...additions])),
        );
    }

    function createEffectSchemaGeneratedNamespaceDeclaration(modelName: string, classDeclaration: ClassDeclaration) {
        const encodedDeclaration = createEffectSchemaEncodedDeclaration(classDeclaration);
        if (!encodedDeclaration) return;
        const makeDeclaration = createEffectSchemaMakeDeclaration(classDeclaration);
        const decodingServices = createEffectSchemaServiceDeclaration(classDeclaration, "DecodingServices");
        const encodingServices = createEffectSchemaServiceDeclaration(classDeclaration, "EncodingServices");
        return factory.createModuleDeclaration(
            createEffectSchemaNamespaceModifiers(classDeclaration, /*includeDeclare*/ true),
            factory.createIdentifier(modelName),
            factory.createModuleBlock(factory.createNodeArray([
                encodedDeclaration,
                ...(makeDeclaration ? [makeDeclaration] : []),
                ...(decodingServices ? [decodingServices] : []),
                ...(encodingServices ? [encodingServices] : []),
            ])),
            NodeFlags.Namespace,
        );
    }

    function createEffectSchemaNamespaceModifiers(classDeclaration: ClassDeclaration, includeDeclare: boolean) {
        const modifiers: Modifier[] = [];
        if (hasEffectSchemaSyntacticModifier(classDeclaration, SyntaxKind.ExportKeyword)) {
            modifiers.push(factory.createModifier(SyntaxKind.ExportKeyword));
        }
        if (includeDeclare) {
            modifiers.push(factory.createModifier(SyntaxKind.DeclareKeyword));
        }
        return modifiers.length ? modifiers : undefined;
    }

    function hasEffectSchemaSyntacticModifier(node: ClassDeclaration, kind: SyntaxKind) {
        return !!node.modifiers && some(node.modifiers, modifier => modifier.kind === kind);
    }

    function createEffectSchemaEncodedDeclaration(classDeclaration: ClassDeclaration) {
        const encodedType = resolver.createTypeOfClassStaticProperty(classDeclaration, "Encoded", enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
        if (!encodedType) return;
        if (isTypeLiteralNode(encodedType)) {
            return factory.createInterfaceDeclaration(
                /*modifiers*/ undefined,
                factory.createIdentifier("Encoded"),
                /*typeParameters*/ undefined,
                /*heritageClauses*/ undefined,
                encodedType.members,
            );
        }
        return factory.createTypeAliasDeclaration(
            /*modifiers*/ undefined,
            factory.createIdentifier("Encoded"),
            /*typeParameters*/ undefined,
            encodedType,
        );
    }

    function createEffectSchemaMakeDeclaration(classDeclaration: ClassDeclaration) {
        const makeType = resolver.createMakeTypeOfClassDeclaration(classDeclaration, enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker)
            || resolver.createTypeOfClassStaticProperty(classDeclaration, "~type.make.in", enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
        if (!makeType) return;
        if (isTypeLiteralNode(makeType)) {
            return factory.createInterfaceDeclaration(
                /*modifiers*/ undefined,
                factory.createIdentifier("Make"),
                /*typeParameters*/ undefined,
                /*heritageClauses*/ undefined,
                makeType.members,
            );
        }
        return factory.createTypeAliasDeclaration(
            /*modifiers*/ undefined,
            factory.createIdentifier("Make"),
            /*typeParameters*/ undefined,
            makeType,
        );
    }

    function createEffectSchemaServiceDeclaration(classDeclaration: ClassDeclaration, name: "DecodingServices" | "EncodingServices") {
        const resolved = resolver.createTypeOfClassStaticProperty(classDeclaration, name, enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
        const serviceType = resolved?.kind === SyntaxKind.AnyKeyword ? factory.createKeywordTypeNode(SyntaxKind.NeverKeyword) : resolved;
        return serviceType && factory.createTypeAliasDeclaration(
            /*modifiers*/ undefined,
            factory.createIdentifier(name),
            /*typeParameters*/ undefined,
            serviceType,
        );
    }

    function getEffectSchemaBaseModelName(statement: Statement): string | undefined {
        if (statement.kind !== SyntaxKind.VariableStatement) return;
        const variableStatement = statement as VariableStatement;
        if (variableStatement.declarationList.declarations.length !== 1) return;
        const declaration = variableStatement.declarationList.declarations[0];
        if (declaration.name.kind !== SyntaxKind.Identifier) return;
        const name = idText(declaration.name);
        if (!name.endsWith("_base")) return undefined;
        const baseName = name.slice(0, -"_base".length);
        return baseName.startsWith("__") ? baseName.slice(2) : baseName;
    }

    function updateEffectSchemaBaseDeclaration(statement: Statement, modelName: string, classDeclaration: ClassDeclaration, usesIntermediateClass: boolean): VariableStatement | undefined {
        if (statement.kind !== SyntaxKind.VariableStatement) return;
        const variableStatement = statement as VariableStatement;
        const declaration = variableStatement.declarationList.declarations[0];
        if (!declaration || declaration.name.kind !== SyntaxKind.Identifier) return;
        const updatedDeclaration = factory.updateVariableDeclaration(
            declaration,
            usesIntermediateClass ? factory.createIdentifier(`__${modelName}_base`) : declaration.name,
            declaration.exclamationToken,
            createEffectSchemaFacadeBaseType(modelName, classDeclaration),
            declaration.initializer,
        );
        return factory.updateVariableStatement(
            variableStatement,
            variableStatement.modifiers,
            factory.updateVariableDeclarationList(variableStatement.declarationList, [updatedDeclaration]),
        );
    }

    interface EffectSchemaRequestBaseInfo {
        readonly modelName: string;
        readonly brandType: TypeNode;
    }

    function getEffectSchemaRequestBaseInfo(statement: Statement): EffectSchemaRequestBaseInfo | undefined {
        if (statement.kind !== SyntaxKind.VariableStatement) return;
        const variableStatement = statement as VariableStatement;
        if (variableStatement.declarationList.declarations.length !== 1) return;
        const declaration = variableStatement.declarationList.declarations[0];
        if (!declaration || declaration.name.kind !== SyntaxKind.Identifier || !declaration.type) return;
        const modelName = getEffectSchemaBaseModelName(statement);
        if (!modelName) return;
        const opaqueType = getEffectSchemaRequestOpaqueType(declaration.type, modelName);
        if (!opaqueType) return;
        const typeArguments = opaqueType.typeArguments;
        return typeArguments && typeArguments.length >= 4
            ? { modelName, brandType: typeArguments[3] }
            : undefined;
    }

    function getEffectSchemaRequestOpaqueType(type: TypeNode, modelName: string): TypeReferenceNode | undefined {
        if (isEffectSchemaRequestOpaqueType(type, modelName)) return type;
        if (type.kind !== SyntaxKind.IntersectionType) return;
        for (const part of (type as IntersectionTypeNode).types) {
            if (isEffectSchemaRequestOpaqueType(part, modelName)) return part;
        }
        return undefined;
    }

    function isEffectSchemaRequestOpaqueType(type: TypeNode, modelName: string): type is TypeReferenceNode {
        if (type.kind !== SyntaxKind.TypeReference) return false;
        const typeReference = type as TypeReferenceNode;
        const typeName = typeReference.typeName;
        if (typeName.kind !== SyntaxKind.QualifiedName) return false;
        const qualifiedName = typeName as QualifiedName;
        if (idText(qualifiedName.right) !== "Opaque" || qualifiedName.left.kind !== SyntaxKind.Identifier || idText(qualifiedName.left as Identifier) !== "S") return false;
        const typeArguments = typeReference.typeArguments;
        if (!typeArguments || typeArguments.length < 4) return false;
        return isEffectSchemaNamedTypeReference(typeArguments[0], modelName)
            && isEffectSchemaExtendedSchemaNoEncodedType(typeArguments[1]);
    }

    function isEffectSchemaNamedTypeReference(type: TypeNode, name: string) {
        return type.kind === SyntaxKind.TypeReference
            && (type as TypeReferenceNode).typeName.kind === SyntaxKind.Identifier
            && idText((type as TypeReferenceNode).typeName as Identifier) === name;
    }

    function isEffectSchemaExtendedSchemaNoEncodedType(type: TypeNode) {
        if (type.kind !== SyntaxKind.TypeQuery) return false;
        const exprName = (type as TypeQueryNode).exprName;
        return exprName.kind === SyntaxKind.QualifiedName
            && idText((exprName as QualifiedName).right) === "ExtendedSchemaNoEncoded"
            && (exprName as QualifiedName).left.kind === SyntaxKind.Identifier
            && idText((exprName as QualifiedName).left as Identifier) === "S";
    }

    function updateEffectSchemaRequestBaseDeclaration(statement: Statement, info: EffectSchemaRequestBaseInfo): VariableStatement | undefined {
        if (statement.kind !== SyntaxKind.VariableStatement) return;
        const variableStatement = statement as VariableStatement;
        const declaration = variableStatement.declarationList.declarations[0];
        if (!declaration || declaration.name.kind !== SyntaxKind.Identifier || !declaration.type) return;
        const updatedType = updateEffectSchemaRequestBaseType(declaration.type, info);
        if (!updatedType) return;
        const updatedDeclaration = factory.updateVariableDeclaration(
            declaration,
            declaration.name,
            declaration.exclamationToken,
            updatedType,
            declaration.initializer,
        );
        return factory.updateVariableStatement(
            variableStatement,
            variableStatement.modifiers,
            factory.updateVariableDeclarationList(variableStatement.declarationList, [updatedDeclaration]),
        );
    }

    function updateEffectSchemaRequestBaseType(type: TypeNode, info: EffectSchemaRequestBaseInfo): TypeNode | undefined {
        if (isEffectSchemaRequestOpaqueType(type, info.modelName)) {
            return createEffectSchemaFacadeTypeReference(info.modelName, info.brandType);
        }
        if (type.kind !== SyntaxKind.IntersectionType) return;
        let changed = false;
        const types = map((type as IntersectionTypeNode).types, part => {
            if (isEffectSchemaRequestOpaqueType(part, info.modelName)) {
                changed = true;
                return createEffectSchemaFacadeTypeReference(info.modelName, info.brandType);
            }
            return part;
        });
        return changed ? factory.updateIntersectionTypeNode(type as IntersectionTypeNode, factory.createNodeArray(types)) : undefined;
    }

    function needsEffectSchemaIntermediateClass(classDeclaration: ClassDeclaration) {
        return classDeclaration.members.length > 0;
    }

    function createEffectSchemaIntermediateClass(modelName: string): ClassDeclaration {
        const internalName = factory.createIdentifier(`__${modelName}`);
        const baseName = factory.createIdentifier(`__${modelName}_base`);
        return factory.createClassDeclaration(
            [factory.createModifier(SyntaxKind.DeclareKeyword)],
            internalName,
            /*typeParameters*/ undefined,
            [factory.createHeritageClause(SyntaxKind.ExtendsKeyword, [
                factory.createExpressionWithTypeArguments(baseName, /*typeArguments*/ undefined),
            ])],
            [],
        );
    }

    function updateEffectSchemaClassDeclaration(classDeclaration: ClassDeclaration, modelName: string): ClassDeclaration {
        return factory.updateClassDeclaration(
            classDeclaration,
            classDeclaration.modifiers,
            classDeclaration.name,
            classDeclaration.typeParameters,
            [factory.createHeritageClause(SyntaxKind.ExtendsKeyword, [
                factory.createExpressionWithTypeArguments(factory.createIdentifier(`__${modelName}`), /*typeArguments*/ undefined),
            ])],
            classDeclaration.members,
        );
    }

    function createEffectSchemaFacadeBaseType(modelName: string, classDeclaration: ClassDeclaration): TypeNode {
        const schemaStaticMembers = createEffectSchemaStaticMembers(classDeclaration);
        return factory.createIntersectionTypeNode([
            createEffectSchemaFacadeTypeReference(modelName, factory.createTypeLiteralNode([])),
            factory.createTypeLiteralNode(schemaStaticMembers),
        ]);
    }

    function createEffectSchemaFacadeTypeReference(modelName: string, brandType: TypeNode): TypeReferenceNode {
        const model = factory.createIdentifier(modelName);
        const typeArguments: TypeNode[] = [
            factory.createTypeReferenceNode(model),
            factory.createTypeReferenceNode(factory.createQualifiedName(model, factory.createIdentifier("Encoded"))),
            factory.createTypeReferenceNode(factory.createQualifiedName(model, factory.createIdentifier("Make"))),
            factory.createTypeReferenceNode(factory.createQualifiedName(model, factory.createIdentifier("DecodingServices"))),
            factory.createTypeReferenceNode(factory.createQualifiedName(model, factory.createIdentifier("EncodingServices"))),
            brandType,
        ];
        const typeReference = factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier("S"), factory.createIdentifier("OpaqueFacade")), typeArguments);
        for (const typeArgument of typeArguments) {
            setParent(typeArgument, typeReference);
        }
        return setParentRecursive(typeReference, /*incremental*/ false);
    }

    function createEffectSchemaStaticMembers(classDeclaration: ClassDeclaration): TypeElement[] {
        const members: TypeElement[] = [];
        addSchemaStaticMember(members, classDeclaration, "fields", /*readonly*/ true);
        addSchemaStaticMember(members, classDeclaration, "mapFields", /*readonly*/ false);
        addSchemaStaticMember(members, classDeclaration, "to", /*readonly*/ true);
        addSchemaStaticMember(members, classDeclaration, "from", /*readonly*/ true);
        addSchemaStaticMember(members, classDeclaration, "copy", /*readonly*/ true);
        return members;
    }

    function addSchemaStaticMember(members: TypeElement[], classDeclaration: ClassDeclaration, name: string, isReadonly: boolean) {
        const type = resolver.createTypeOfClassStaticProperty(classDeclaration, name, enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
        if (!type || type.kind === SyntaxKind.AnyKeyword) return;
        members.push(factory.createPropertySignature(
            isReadonly ? [factory.createModifier(SyntaxKind.ReadonlyKeyword)] : undefined,
            name,
            /*questionToken*/ undefined,
            type,
        ));
    }

    function getEffectSchemaServiceType(classDeclaration: ClassDeclaration, name: "DecodingServices" | "EncodingServices") {
        const resolved = resolver.createTypeOfClassStaticProperty(classDeclaration, name, enclosingDeclaration, declarationEmitNodeBuilderFlags, declarationEmitInternalNodeBuilderFlags, symbolTracker);
        return resolved?.kind === SyntaxKind.AnyKeyword
            ? factory.createKeywordTypeNode(SyntaxKind.NeverKeyword)
            : resolved || factory.createKeywordTypeNode(SyntaxKind.NeverKeyword);
    }

    function expressionToEntityName(expression: Expression): EntityName | undefined {
        if (expression.kind === SyntaxKind.Identifier) {
            return expression as Identifier;
        }
        if (isPropertyAccessExpression(expression)) {
            const left = expressionToEntityName(expression.expression);
            if (!left || expression.name.kind !== SyntaxKind.Identifier) return;
            return left && factory.createQualifiedName(left, expression.name);
        }
        return undefined;
    }
}

function isAlwaysType(node: Node) {
    if (node.kind === SyntaxKind.InterfaceDeclaration) {
        return true;
    }
    return false;
}

// Elide "public" modifier, as it is the default
function maskModifiers(factory: NodeFactory, node: Node, modifierMask?: ModifierFlags, modifierAdditions?: ModifierFlags): Modifier[] | undefined {
    return factory.createModifiersFromModifierFlags(maskModifierFlags(node, modifierMask, modifierAdditions));
}

function maskModifierFlags(node: Node, modifierMask: ModifierFlags = ModifierFlags.All ^ ModifierFlags.Public, modifierAdditions: ModifierFlags = ModifierFlags.None): ModifierFlags {
    let flags = (getEffectiveModifierFlags(node) & modifierMask) | modifierAdditions;
    if (flags & ModifierFlags.Default && !(flags & ModifierFlags.Export)) {
        // A non-exported default is a nonsequitor - we usually try to remove all export modifiers
        // from statements in ambient declarations; but a default export must retain its export modifier to be syntactically valid
        flags ^= ModifierFlags.Export;
    }
    if (flags & ModifierFlags.Default && flags & ModifierFlags.Ambient) {
        flags ^= ModifierFlags.Ambient; // `declare` is never required alongside `default` (and would be an error if printed)
    }
    return flags;
}

type CanHaveLiteralInitializer = VariableDeclaration | PropertyDeclaration | PropertySignature | ParameterDeclaration;
function canHaveLiteralInitializer(node: Node): node is CanHaveLiteralInitializer {
    switch (node.kind) {
        case SyntaxKind.PropertyDeclaration:
        case SyntaxKind.PropertySignature:
            return !hasEffectiveModifier(node, ModifierFlags.Private);
        case SyntaxKind.Parameter:
        case SyntaxKind.VariableDeclaration:
            return true;
    }
    return false;
}

type ProcessedDeclarationStatement =
    | FunctionDeclaration
    | ModuleDeclaration
    | ImportEqualsDeclaration
    | InterfaceDeclaration
    | ClassDeclaration
    | TypeAliasDeclaration
    | EnumDeclaration
    | VariableStatement
    | ImportDeclaration
    | ExportDeclaration
    | ExportAssignment;

function isPreservedDeclarationStatement(node: Node): node is ProcessedDeclarationStatement {
    switch (node.kind) {
        case SyntaxKind.FunctionDeclaration:
        case SyntaxKind.ModuleDeclaration:
        case SyntaxKind.ImportEqualsDeclaration:
        case SyntaxKind.InterfaceDeclaration:
        case SyntaxKind.ClassDeclaration:
        case SyntaxKind.TypeAliasDeclaration:
        case SyntaxKind.EnumDeclaration:
        case SyntaxKind.VariableStatement:
        case SyntaxKind.ImportDeclaration:
        case SyntaxKind.ExportDeclaration:
        case SyntaxKind.ExportAssignment:
            return true;
    }
    return false;
}

type ProcessedComponent =
    | ConstructSignatureDeclaration
    | ConstructorDeclaration
    | MethodDeclaration
    | GetAccessorDeclaration
    | SetAccessorDeclaration
    | PropertyDeclaration
    | PropertySignature
    | MethodSignature
    | CallSignatureDeclaration
    | IndexSignatureDeclaration
    | VariableDeclaration
    | TypeParameterDeclaration
    | ExpressionWithTypeArguments
    | TypeReferenceNode
    | ConditionalTypeNode
    | FunctionTypeNode
    | ConstructorTypeNode
    | ImportTypeNode;

function isProcessedComponent(node: Node): node is ProcessedComponent {
    switch (node.kind) {
        case SyntaxKind.ConstructSignature:
        case SyntaxKind.Constructor:
        case SyntaxKind.MethodDeclaration:
        case SyntaxKind.GetAccessor:
        case SyntaxKind.SetAccessor:
        case SyntaxKind.PropertyDeclaration:
        case SyntaxKind.PropertySignature:
        case SyntaxKind.MethodSignature:
        case SyntaxKind.CallSignature:
        case SyntaxKind.IndexSignature:
        case SyntaxKind.VariableDeclaration:
        case SyntaxKind.TypeParameter:
        case SyntaxKind.ExpressionWithTypeArguments:
        case SyntaxKind.TypeReference:
        case SyntaxKind.ConditionalType:
        case SyntaxKind.FunctionType:
        case SyntaxKind.ConstructorType:
        case SyntaxKind.ImportType:
            return true;
    }
    return false;
}
