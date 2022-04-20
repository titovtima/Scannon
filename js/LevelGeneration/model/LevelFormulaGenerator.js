class LevelFormulaGenerator {

    constructor(scene, params) {
        console.log('Level formula generator has been called');
        this.scene = scene;

        this.numberOfFormulas = params.numberOfFormulas;
        this.initialExpressions = params.initialExpressions;
        this.substitutions = params.substitutions;
        this.rulesFromPacks = params.rulesFromPacks;
        this.substitutionsList = [];
        this.substitutionsMap = new Map();

        for (let rule of this.rulesFromPacks) {
            let exprSubst = twf_js.expressionSubstitutionFromStructureStrings(
                rule.leftStructureString,
                rule.rightStructureString,
                rule.basedOnTaskContext,
                rule.matchJumbledAndNested,
                rule.simpleAdditional,
                rule.isExtending,
                rule.priority,
                rule.code,
                rule.nameEn,
                rule.nameRu
            )
            let diff = this.getUnicodeFormulaLength(
                twf_js.expressionToUnicodeString(twf_js.structureStringToExpression(rule.rightStructureString))
            ) - this.getUnicodeFormulaLength(
                twf_js.expressionToUnicodeString(twf_js.structureStringToExpression(rule.leftStructureString))
            )
            this.substitutionsMap.set(exprSubst.code, {
                "diff": diff,
                "scoreForHit": rule.scoreForHit,
                "scoreForSkip": rule.scoreForSkip
            })
            this.substitutionsList.push(exprSubst);
        }

        this.numberOfGeneratedFormulas = 0;
        this.shuffler = new Shuffler(this);
        this.generationVariant = true;
    }

    nextFormula() {
        if (this.formula === undefined) {
            console.log('formula is undefined');
            this.initializeFormula(); }
        else {
            console.log('formula: ', this.formula);
            this.transformFormula(); }

        this.numberOfGeneratedFormulas += 1;

        return this.formula;
    }

    levelComplete() {
        return this.numberOfGeneratedFormulas === this.numberOfFormulas;
    }

    progress() {
        return this.numberOfGeneratedFormulas / this.numberOfFormulas;
    }

    urlForRawFormula(rawFormula) {
        let height = this.heightForRawFormula(rawFormula);
        let texFormula = rawFormula.split("\\").join("\\backslash ")
            .split("|").join("\\vee ")
            .split("&").join("\\wedge ")
            .split("->").join("\\rightarrow ");

        return 'https://chart.apis.google.com/chart?cht=tx' +  // tex parameter
            '&chs=' + height +                                 // specify the height of formula
            '&chl=' + encodeURIComponent(texFormula) +         // specify the text of formula
            '&chf=bg,s,00000000'                               // make transparent background
    }

    heightForRawFormula(rawFormula) {
        return 50;
    }

    initializeFormula() {
        let randomInitialExpression
            = this.initialExpressions[Math.floor(Math.random() * this.initialExpressions.length)];
        this.expression = twf_js.stringToExpression(randomInitialExpression, "setTheory");
        let unicodeFormula = twf_js.expressionToUnicodeString(this.expression);
        this.formula = {
            'length':       this.getUnicodeFormulaLength(unicodeFormula),
            'unicode':      unicodeFormula,
            'expression':   this.expression,
            'scoreForHit':  0,
            'scoreForPass': 0
        }
    }

    transformFormula() {
        let expression = this.expression;
        let shuffledSubstitutions = this.shuffler.shuffledSubstitutions();
        this.generationVariant = !this.generationVariant;

        if (this.generationVariant) {
            for (let substitution of shuffledSubstitutions) {
                if (substitution.left.nodeType.name$ === "EMPTY") continue;
                let expressionSubstitution = substitution;
                expression = twf_js.cloneExpression(this.expression);
                let substitutionPlaces = this.getSubstitutionPlaces(expression, expressionSubstitution);

                if (0 < substitutionPlaces.length) {
                    let shuffledPlaces = this.shuffler.shuffle(substitutionPlaces);
                    for (let place of shuffledPlaces) {
                        let newExpression = this.applySubstitution(expression, expressionSubstitution, [place]);
                        let unicodeFormula = twf_js.expressionToUnicodeString(newExpression);
                        let formulaLength = this.getUnicodeFormulaLength(unicodeFormula);
                        if (formulaLength <= 100 && formulaLength > 10) {
                            this.expression = newExpression;
                            console.log('New formula:', unicodeFormula);
                            console.log('Substitution place:', place);

                            this.formula = {
                                'length': this.getUnicodeFormulaLength(unicodeFormula),
                                'unicode': unicodeFormula,
                                'expression': this.expression,
                                'scoreForHit': this.substitutionsMap.get(expressionSubstitution.code).scoreForHit,
                                'scoreForSkip': this.substitutionsMap.get(expressionSubstitution.code).scoreForSkip
                            };

                            return;
                        }
                    }
                }
            }
        } else {
            let allNodeIds = this.getAllNodeIdsInExpression(expression);
            let nodeIdsSubarrays = this.getAllSubarrays(allNodeIds);
            let shuffledNodeIds = this.shuffler.shuffle(nodeIdsSubarrays);

            for (let nodeIds of shuffledNodeIds) {
                if (nodeIds.length === 0) continue;
                let substitutionApplications = this.findApplicableSubstitutionsInSelectedPlace(
                    expression, nodeIds, shuffledSubstitutions
                );
                if (0 < substitutionApplications.length) {
                    let shuffledApplications = this.shuffler.shuffle(substitutionApplications);
                    let application = shuffledApplications[0];
                    let unicodeFormula = twf_js.expressionToUnicodeString(application.resultExpression);
                    let formulaLength = this.getUnicodeFormulaLength(unicodeFormula);
                    if (formulaLength < 100 && formulaLength > 10) {
                        this.expression = application.resultExpression;

                        this.formula = {
                            'length': this.getUnicodeFormulaLength(unicodeFormula),
                            'unicode': unicodeFormula,
                            'expression': this.expression,
                            'scoreForHit': this.substitutionsMap
                                .get(application.expressionSubstitution.code).scoreForHit,
                            'scoreForSkip': this.substitutionsMap
                                .get(application.expressionSubstitution.code).scoreForSkip
                        };

                        return;
                    }
                }
            }
        }
    }

    findApplicableSubstitutionsInSelectedPlace(expression, nodeIds, substitutions) {
        return twf_js.findApplicableSubstitutionsInSelectedPlace(
            expression,
            nodeIds,
            twf_js.createCompiledConfigurationFromExpressionSubstitutionsAndParams(substitutions)
        )
    }

    getAllNodeIdsInExpression(expression) {
        let nodeIds = [];
        if (expression.nodeId !== 0 && twf_js.listToArray(expression.children).length > 0)
            nodeIds = [expression.nodeId];
        for (let child of twf_js.listToArray(expression.children))
            nodeIds = nodeIds.concat(this.getAllNodeIdsInExpression(child))
        return nodeIds
    }

    getSubstitutionPlaces(expression, substitution) {
        return twf_js.findSubstitutionPlacesInExpression(expression, substitution);
    }

    applySubstitution(expression, substitution, places) {
        return twf_js.applySubstitution(expression,
            substitution, [this.pickRandomElement(places)], "setTheory")
    }

    pickRandomElement(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    getUnicodeFormulaLength(unicodeFormula) {
        let result = 0;
        for (let symb of unicodeFormula) {
            switch (symb) {
                case '(' | ')' | '1':
                    result += 2;
                    break;
                case '¬' | '∧' | '∨' | '≡' | '0':
                    result += 3;
                    break;
                case '→' | '∖':
                    result += 5;
                    break;
                case symb >= 'a' && symb <= 'z':
                    result += 2;
                    break;
                default:
                    result += 4;
                    break;
            }
        }
        return result;
    }

    getAllSubarrays(array) {
        if (array.length === 0)
            return [[]];
        let tailSubarray = this.getAllSubarrays(array.slice(1));
        return tailSubarray.concat(tailSubarray.map(function (item, index, a) {
            return [array[0]].concat(item);
        }));
    }

    copy_object(obj) {
        if (typeof obj != "object")
            return obj
        if (Array.isArray(obj)) {
            let new_arr = []
            for (let item of obj)
                new_arr.push(this.copy_object(item))
            return new_arr
        }
        let new_obj = {}
        for (let key in obj) {
            new_obj[key] = this.copy_object(obj[key])
        }
        return new_obj
    }
}