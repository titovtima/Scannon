class LevelFormulaGenerator {

    constructor(scene, params) {
        console.log('level formula generator has been called');
        this.scene = scene;

        this.numberOfFormulas = params.numberOfFormulas;
        this.initialExpressions = params.initialExpressions;
        this.substitutions = params.substitutions;
        console.log('Substitutions in levelGenerator:', this.substitutions);

        for (let substitution of this.substitutions) {
            substitution.diff = substitution.target.length - substitution.origin.length;
        }
        console.log('Substitutions added diff:', this.substitutions);
        for (let sub of this.substitutions) {
            console.log('Substitution:', sub);
        }

        for (let substitution of this.substitutions) {
            substitution.origin = TWF.api.stringToStructureString(substitution.origin, "setTheory");
            substitution.target = TWF.api.stringToStructureString(substitution.target, "setTheory");
        }
        console.log('Substitutions after modifying:', this.substitutions);
        for (let sub of this.substitutions) {
            console.log('Substitution:', sub);
        }

        this.numberOfGeneratedFormulas = 0;
        this.shuffler = new Shuffler(this);
    }

    nextFormula() {
        if (this.formula === undefined) {
            console.log('formula is undefined');
            this.initializeFormula(); }
        else {
            console.log('formula: ' + this.formula.label);
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
        let expression = this.formula.label;
        let shuffledSubstitutions = this.shuffler.shuffledSubstitutions();
        // console.log('Shuffled substitutions:', shuffledSubstitutions);

        for (let substitution of shuffledSubstitutions) {
            let substitutionPlaces = this.getSubstitutionPlaces(expression, substitution);

            if (0 < substitutionPlaces.length) {
                let rawFormula = this.applySubstitution(expression, substitution, substitutionPlaces);

                this.formula = {
                    'label':        rawFormula,
                    'url':          this.urlForRawFormula(rawFormula),
                    'scoreForHit':  substitution.scoreForHit,
                    'scoreForSkip': substitution.scoreForSkip
                };
                // console.log('Formula transformed to:', this.formula);

                break;
            }
        }
    }

    getSubstitutionPlaces(expression, substitution) {
        let substitutionPlacesJSON = TWF.api.findSubstitutionPlacesJSON(
            expression,
            substitution.origin, substitution.target,
            "setTheory"
        );
        return JSON.parse(substitutionPlacesJSON).substitutionPlaces;
    }

    applySubstitution(expression, substitution, place) {
        console.log('Apply substitution:', {'expression': expression, 'substitution': substitution, 'place': place})
        if (place.constructor === Array) {
            place = this.pickRandomElement(place);
        }

        return TWF.api.applySubstitution(expression,
            substitution.origin, substitution.target,
            parseInt(place.parentStartPosition), parseInt(place.parentEndPosition),
            parseInt(place.startPosition), parseInt(place.endPosition),
            "setTheory")
    }

    pickRandomElement(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

}