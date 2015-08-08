Mastermind.service("AnalysePions", function() {
  console.log('AnalysePions');
  return {
    suggestedSequence: [],
    numTour: 0,
    config: {},
    beginBatch: function() {
      var end, i, j, len, nbBatchs, nbCouleurs, numTourActuel, obj, pion, sequenceAdviced, splitting, start;
      nbCouleurs = this.config.couleurs.length;
      nbBatchs = nbCouleurs / this.config.sequenceLength;
      numTourActuel = this.tree.length;
      sequenceAdviced = [];
      start = this.numTour * this.config.sequenceLength;
      end = this.config.sequenceLength + (this.numTour * this.config.sequenceLength);
      splitting = this.config.couleurs.slice(start, end);
      i = 0;
      for (j = 0, len = splitting.length; j < len; j++) {
        pion = splitting[j];
        obj = {
          id: i,
          color: pion
        };
        i++;
        sequenceAdviced.push(obj);
      }
      this.suggestedSequence = sequenceAdviced;
      console.log('========= beginBatch', nbCouleurs, nbBatchs);
      return sequenceAdviced;
    },
    suggestSequence: function() {
      var c, isBadColor, j, laProba, len, nbBatchs, probas, ref, sequenceAdviced;
      console.info('------------ suggestSequence');
      nbBatchs = this.config.couleurs.length / this.config.sequenceLength;
      console.info('------------ Batchs', nbBatchs);
      if (this.numTour <= nbBatchs) {
        this.suggestedSequence = this.beginBatch();
        return this.suggestedSequence;
      }
      probas = [];
      console.log('************* TODO sequenceAdviced');
      ref = Object.keys(this.tree);
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        laProba = this.tree[c].proba;
        isBadColor = this.tree[c].bad;
        if (isBadColor) {
          continue;
        }
        if (!probas[laProba]) {
          probas[laProba] = [];
        }
        probas[laProba].push(this.tree[c].name);
      }
      console.log('probas', probas, probas.sort());
      sequenceAdviced = probas.slice(0, this.config.sequenceLength);
      console.log('sequenceAdviced', this.config.sequenceLength, sequenceAdviced);
      this.suggestedSequence = sequenceAdviced;
      return sequenceAdviced;
    },
    setConfig: function(obj) {
      this.config = obj;
      return console.log('@config', this.config.sequenceLength);
    },
    makeTree: function(colors) {
      var c, j, len, stats;
      console.info('----- construction de l\'arbre');
      this.tree = [];
      for (j = 0, len = colors.length; j < len; j++) {
        c = colors[j];
        stats = {
          name: c,
          proba: 1 - 1 / (this.config.sequenceLength || 4),
          inGood: 0,
          inNearly: 0,
          bad: 0,
          tried: 0,
          triedPositions: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0
          }
        };
        this.tree[c] = stats;
      }
      return this.tree;
    },
    dumpTree: function() {
      var c, dumpPhrase, j, len, ref, results;
      dumpPhrase = 'Tree: ';
      ref = Object.keys(this.tree);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        results.push(dumpPhrase += ' ' + this.tree[c].name + ' ' + this.tree[c].proba);
      }
      return results;
    },
    setBad: function(sequence) {
      var c, j, len, results;
      console.log('rien de bon, on met du bad', sequence);
      results = [];
      for (j = 0, len = sequence.length; j < len; j++) {
        c = sequence[j];
        this.tree[c.color].bad++;
        results.push(this.tree[c.color].proba = 0);
      }
      return results;
    },
    addProba: function(points) {
      var j, k, len, ref, results;
      ref = Object.keys(this.tree);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        k = ref[j];
        results.push(this.tree[k].proba += points);
      }
      return results;
    },
    colorDiff: function(sequence) {
      var c, colors, diff, j, len, simpleSequence;
      colors = angular.copy(this.config.couleurs);
      simpleSequence = [];
      for (j = 0, len = sequence.length; j < len; j++) {
        c = sequence[j];
        simpleSequence.push(c.color);
      }
      diff = $(colors).not(simpleSequence);
      return diff;
    },

    /*
     * attribuer des chances par couleur selon le résultat
     */
    wonder: function(result, sequence) {
      var c, diff, j, l, len, len1, retour;
      this.numTour += 1;
      console.info('numéro de tour', this.numTour);
      if (result.goods === 0) {
        if (result.nearly === 0) {
          this.setBad(sequence);
          return;
        } else if (result.nearly <= this.config.sequenceLength / 2) {
          this.addProba(0.5);
        }
        return;
      } else if (result.goods + result.nearly === this.config.sequenceLength) {
        console.info('tous les pions sont bons, mais mal placés');
        diff = this.colorDiff(sequence);
        for (j = 0, len = diff.length; j < len; j++) {
          c = diff[j];
          this.tree[c].bad++;
          this.tree[c].proba = 0;
        }
        this.addProba(1);
        if (result.goods >= 2) {
          this.addProba(0.5);
        }
      } else {

      }
      for (l = 0, len1 = sequence.length; l < len1; l++) {
        c = sequence[l];
        this.tree[c.color].tried++;
        this.tree[c.color].triedPositions[c.id]++;
      }
      retour = this.suggestSequence();
      return retour;
    },
    upTree: function() {
      this.tree = ['up'];
      console.info('IA: tree was updated', this.tree);
      return this.tree;
    }
  };
});
