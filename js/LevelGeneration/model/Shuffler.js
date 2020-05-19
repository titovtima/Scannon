class Shuffler {

    constructor(generator) {
        this.generator = generator;
    }

    shuffledSubstitutions() {
        let formula = this.generator.formula;
        let substitutions = this.generator.substitutions;

        let group1 = substitutions;
        let group2 = [];

        if (formula.length < 8)  {
            group1 = substitutions.filter( item => 0 < item.diff  );
            group2 = substitutions.filter( item => item.diff <= 0 );
        }

        if (12 < formula.length) {
            group1 = substitutions.filter( item => item.diff < 0 );
            group2 = substitutions.filter( item => 0 <= item.diff );
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