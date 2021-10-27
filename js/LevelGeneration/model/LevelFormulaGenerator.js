class LevelFormulaGenerator {

    constructor(scene, params) {
        console.log('level formula generator has been called');
        this.scene = scene;

        this.numberOfFormulas = params.numberOfFormulas;
        this.initialExpressions = params.initialExpressions;
        this.substitutions = params.substitutions;

        for (let substitution of this.substitutions) {
            substitution.diff = substitution.target.length - substitution.origin.length;
        }

        for (let substitution of this.substitutions) {
            substitution.origin = twf_js.stringToStructureString(substitution.origin, "setTheory");
            substitution.target = twf_js.stringToStructureString(substitution.target, "setTheory");
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
    }

    transformFormula() {
        let stringExpression = this.formula.label;
        let expression = twf_js.stringToExpression(stringExpression, "setTheory");
        let shuffledSubstitutions = this.shuffler.shuffledSubstitutions();

        for (let substitution of shuffledSubstitutions) {
            let expressionSubstitution = twf_js.expressionSubstitutionFromStructureStrings(
                substitution.origin, substitution.target, "setTheory");
            let substitutionPlaces = this.getSubstitutionPlaces(expression, expressionSubstitution);

            if (0 < substitutionPlaces.length) {
                let rawFormula = twf_js.expressionToString(
                    this.applySubstitution(expression, expressionSubstitution, substitutionPlaces));

                this.formula = {
                    'label':        rawFormula,
                    'url':          this.urlForRawFormula(rawFormula),
                    'scoreForHit':  substitution.scoreForHit,
                    'scoreForSkip': substitution.scoreForSkip
                };

                break;
            }
        }
    }

    getSubstitutionPlaces(expression, substitution) {
        return twf_js.findSubstitutionPlacesInExpression(expression, substitution);
    }

    applySubstitution(expression, substitution, places) {
        return twf_js.applySubstitution(expression, substitution, places, "setTheory")
    }

    pickRandomElement(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

}