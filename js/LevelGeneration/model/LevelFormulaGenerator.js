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

        for (let substitution of this.substitutions) {
            let exprSubst = twf_js.expressionSubstitutionFromStructureStrings(
                twf_js.stringToStructureString(substitution.origin, "setTheory"),
                twf_js.stringToStructureString(substitution.target, "setTheory")
            );
            this.substitutionsMap.set(exprSubst.code,
                {
                    "scoreForHit": substitution.scoreForHit,
                    "scoreForSkip": substitution.scoreForSkip
                });
            this.substitutionsList.push(exprSubst);
        }

        console.log('Substitutions', this.substitutions);

        for (let rule of this.rulesFromPacks) {
            // if (rule.leftStructureString === "") continue;
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
            this.substitutionsMap.set(exprSubst.code, {
                "scoreForHit": rule.scoreForHit,
                "scoreForSkip": rule.scoreForSkip
            })
            this.substitutionsList.push(exprSubst);
        }

        this.numberOfGeneratedFormulas = 0;
        this.shuffler = new Shuffler(this);
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
        this.formula = {
            'label':        randomInitialExpression,
            'url':          this.urlForRawFormula(randomInitialExpression),
            'scoreForHit':  0,
            'scoreForPass': 0
        }
        this.expression = twf_js.stringToExpression(this.formula.label, "setTheory");
    }

    transformFormula() {
        let expression = this.expression;
        let shuffledSubstitutions = this.shuffler.shuffledSubstitutions();
        console.log('Expression string', this.formula.label);
        console.log('Expression', expression);

        if (false) {
            for (let substitution of shuffledSubstitutions) {
                let expressionSubstitution = substitution;
                console.log('Substitution:', substitution);
                let substitutionPlaces = this.getSubstitutionPlaces(expression, expressionSubstitution);

                if (0 < substitutionPlaces.length) {
                    this.expression = this.applySubstitution(expression, expressionSubstitution, substitutionPlaces);
                    let rawFormula = twf_js.expressionToString(this.expression);

                    this.formula = {
                        'label': rawFormula,
                        'url': this.urlForRawFormula(rawFormula),
                        'scoreForHit': this.substitutionsMap.get(expressionSubstitution.code).scoreForHit,
                        'scoreForSkip': this.substitutionsMap.get(expressionSubstitution.code).scoreForSkip
                    };

                    break;
                }
            }
        } else {
            let nodeIds = this.getAllNodeIdsInExpression(expression);
            console.log('Node ids', nodeIds);
            console.log('Substitutions', shuffledSubstitutions);
            let substitutionApplications = this.findApplicableSubstitutionsInSelectedPlace(
                expression, nodeIds, shuffledSubstitutions
            );
            console.log('Substitution applications', substitutionApplications);
            if (0 < substitutionApplications.length) {
                let application = this.pickRandomElement(substitutionApplications)
                this.expression = application.resultExpression;
                let rawFormula = twf_js.expressionToString(
                    application.resultExpression);
                console.log('Result expression:', rawFormula);

                this.formula = {
                    'label': rawFormula,
                    'url': this.urlForRawFormula(rawFormula),
                    'scoreForHit': this.substitutionsMap
                        .get(application.expressionSubstitution.code).scoreForHit,
                    'scoreForSkip': this.substitutionsMap
                        .get(application.expressionSubstitution.code).scoreForSkip
                };
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
        return twf_js.applySubstitution(expression, substitution, [this.pickRandomElement(places)], "setTheory")
    }

    pickRandomElement(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

}