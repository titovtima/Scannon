class LevelFormulaGenerator {

    constructor(scene, params) {
        console.log('level formula generator has been called');
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
            // 'label':        randomInitialExpression,
            // 'url':          this.urlForRawFormula(randomInitialExpression),
            'scoreForHit':  0,
            'scoreForPass': 0
        }
    }

    transformFormula() {
        let expression = this.expression;
        let shuffledSubstitutions = this.shuffler.shuffledSubstitutions();
        let timeExceeded = false;
        let timer = setTimeout(function () {
            console.log('Time exceeded');
            timeExceeded = true;
        }, 2000);
        // console.log('Expression string', this.formula.label);
        // console.log('Expression', expression);
        // console.log('Formula unicode:', this.formula.unicode);
        console.log('Expression unicode', twf_js.expressionToUnicodeString(expression));
        this.generationVariant = !this.generationVariant;

        // if (this.generationVariant) {
        if (false) {
            for (let substitution of shuffledSubstitutions) {
                let stopCounter = 7;
                // console.log(substitution)
                if (substitution.left.nodeType.name$ === "EMPTY") continue;
                let expressionSubstitution = substitution;
                // console.log('Expression unicode', twf_js.expressionToUnicodeString(expression));
                // console.log('Substitution:', substitution);
                let substitutionPlaces = this.getSubstitutionPlaces(expression, expressionSubstitution);

                if (0 < substitutionPlaces.length) {
                    // console.log('Substitution places', substitutionPlaces);
                    let shuffledPlaces = this.shuffler.shuffle(substitutionPlaces);
                    for (let place of shuffledPlaces) {
                        // let expr = twf_js.cloneExpression(expression);
                        // console.log('expr', twf_js.expressionToUnicodeString(expr));
                        let newExpression = this.applySubstitution(expression, expressionSubstitution, [place]);
                        // let rawFormula = twf_js.expressionToString(newExpression);
                        let unicodeFormula = twf_js.expressionToUnicodeString(newExpression);
                        console.log('new formula', unicodeFormula);
                        let formulalength = this.getUnicodeFormulaLength(unicodeFormula);
                        if (timeExceeded)
                            return this.transformFormula();
                        stopCounter =- 1;
                        if (stopCounter < 0) {
                            console.log('Stop counter');
                            clearTimeout(timer);
                            return this.transformFormula();
                        }
                        if (formulalength <= 100 && formulalength > 10) {
                            this.expression = newExpression;
                            console.log('Substitution', expressionSubstitution.code);
                            // console.log('Diff', this.substitutionsMap.get(expressionSubstitution.code).diff);

                            this.formula = {
                                'length': this.getUnicodeFormulaLength(unicodeFormula),
                                'unicode': unicodeFormula,
                                // 'label': rawFormula,
                                // 'url': this.urlForRawFormula(rawFormula),
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

            // console.log('All node ids:', allNodeIds);
            // console.log('Node ids subarrays:', nodeIdsSubarrays);
            for (let nodeIds of shuffledNodeIds) {
                if (nodeIds.length === 0) continue;
                // console.log('Node ids', nodeIds);
                // console.log('Substitutions', shuffledSubstitutions);
                let substitutionApplications = this.findApplicableSubstitutionsInSelectedPlace(
                    expression, nodeIds, shuffledSubstitutions
                );
                // console.log('Substitution applications', substitutionApplications);
                if (0 < substitutionApplications.length) {
                    let shuffledApplications = this.shuffler.shuffle(substitutionApplications);
                    let application = shuffledApplications[0];
                    let rawFormula = twf_js.expressionToString(
                        application.resultExpression);
                    let unicodeFormula = twf_js.expressionToUnicodeString(application.resultExpression);
                    let formulaLength = this.getUnicodeFormulaLength(unicodeFormula);
                    if (timeExceeded)
                        return this.transformFormula();
                    if (formulaLength < 100 && formulaLength > 10) {
                        this.expression = application.resultExpression;
                        // console.log('Result expression:', rawFormula);
                        console.log('Result expression unicode:', unicodeFormula);

                        this.formula = {
                            'length': this.getUnicodeFormulaLength(unicodeFormula),
                            'unicode': unicodeFormula,
                            // 'label': rawFormula,
                            // 'url': this.urlForRawFormula(rawFormula),
                            'scoreForHit': this.substitutionsMap
                                .get(application.expressionSubstitution.code).scoreForHit,
                            'scoreForSkip': this.substitutionsMap
                                .get(application.expressionSubstitution.code).scoreForSkip
                        };

                        clearTimeout(timer);
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
            // console.log(key, obj[key])
            new_obj[key] = this.copy_object(obj[key])
        }
        return new_obj
    }
}