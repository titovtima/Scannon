class LevelFormulaGenerator {

    constructor(scene, params) {
        this.scene = scene;

        this.num_generated_formulas = 0;
        this.num_formulas = params.num_formulas
    }

    nextFormula() {
        let rawFormula = this.nextRawFormula();
        let formulaUrl = this.urlForRawFormula(rawFormula);

        this.num_generated_formulas += 1;
        return {
            'label': rawFormula,
            'url': formulaUrl,
            'scoreForHit': 30,
            'scoreForSkip': 30
        };
    }

    levelComplete() {
        return this.num_generated_formulas === this.num_formulas;
    }

    progress() {
        return this.num_generated_formulas / this.num_formulas;
    }

    nextRawFormula() {
        return 'sin0' + this.num_generated_formulas
    }

    urlForRawFormula(rawFormula) {
        let height = this.heightForRawFormula(rawFormula);
        let texFormula = rawFormula.replace("\\", "\\backslash ")
            .replace("|", "\\vee ")
            .replace("&", "\\wedge ")
            .replace("->", "\\rightarrow ")

        return 'https://chart.apis.google.com/chart?cht=tx' +  // tex parameter
            '&chs=' + height +                                 // specify the height of formula
            '&chl=' + encodeURIComponent(texFormula) +         // specify the text of formula
            '&chf=bg,s,00000000'                               // make transparent background
    }

    heightForRawFormula(rawFormula) {
        return 50;
    }

}