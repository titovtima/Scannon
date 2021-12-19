class Shuffler {

    constructor(generator) {
        this.generator = generator;
    }

    shuffledSubstitutions() {
        let formula = this.generator.formula;
        let substitutions = this.generator.substitutionsList;

        let group1 = substitutions;
        let group2 = [];

        if (formula.length < this.generator.minLength)  {
            group1 = substitutions.filter( item => 0 < this.generator.substitutionsMap.get(item.code).diff);
            group2 = substitutions.filter( item => this.generator.substitutionsMap.get(item.code).diff <= 0);
        }

        if (this.generator.maxLength < formula.length) {
            group1 = substitutions.filter( item => this.generator.substitutionsMap.get(item.code).diff < 0 );
            group2 = substitutions.filter( item => 0 <= this.generator.substitutionsMap.get(item.code).diff );
        }

        this.shuffle(group1);
        this.shuffle(group2);

        return group1.concat(group2);
    }

    shuffle(items) {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    }

}