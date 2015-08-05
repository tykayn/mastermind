var Mastermind;

Mastermind = angular.module("myApp", []);

Mastermind.service("AnalysePions", function() {
  console.log('AnalysePions');
  return {
    suggestedSequence: [],
    config: {},
    suggestSequence: function() {
      var c, isBadColor, j, laProba, len, probas, ref, sequenceAdviced;
      probas = [];
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
      console.log('sequenceAdviced', sequenceAdviced);
      this.suggestedSequence = sequenceAdviced;
      return sequenceAdviced;
    },
    setConfig: function(obj) {
      this.config = obj;
      return console.log('@config', this.config.sequenceLength);
    },
    makeTree: function(colors) {
      var c, j, len, stats;
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
      console.log('rien de bon, on met du bad');
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
      var c, diff, j, l, len, len1;
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
      } else if (result.goods >= 2) {
        this.addProba(0.5);
      }
      for (l = 0, len1 = sequence.length; l < len1; l++) {
        c = sequence[l];
        this.tree[c.color].tried++;
        this.tree[c.color].triedPositions[c.id]++;
      }
      return this.suggestSequence();
    },
    upTree: function() {
      this.tree = ['up'];
      console.info('IA: tree was updated', this.tree);
      return this.tree;
    }
  };
});

Mastermind.controller("MainCtrl", [
  '$rootScope', '$scope', 'AnalysePions', function($rootScope, $scope, IA) {
    var MainCtrl, i, j, results;
    MainCtrl = this;

    /*
      config globale
     */
    $scope.conf = {
      player: 1,
      autoRun: 0,
      randomGoal: 1,
      debug: 1,
      turns: 10,
      sequenceLength: 4,
      doubleColors: 1,
      couleurs: ['yellow', 'violet', 'green', 'blue', 'red']
    };
    $scope.couleurs = $scope.conf.couleurs;
    IA.setConfig($scope.conf);
    console.log('MainCtrl launched with ', IA);
    $scope.demo = 'WOHOOO';

    /*
    tableau des évaluations pour chaque séquence
     */
    $scope.result = [];
    $scope.sequence = [];
    $scope.altColors = 0;
    MainCtrl.lines = [];
    MainCtrl.won = 0;
    MainCtrl.loose = 0;
    $scope.sequenceAdverse = ["blue", "yellow", "red", "green"];
    $scope.MainCtrl = MainCtrl;
    $scope.gagner = function() {
      var c, i, j, len, obj, ref;
      i = 0;
      ref = $scope.sequenceAdverse;
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        obj = {
          id: i++,
          color: c
        };
        $scope.sequence.push(obj);
      }
      return $scope.sequence;
    };
    $scope.emptyTable = function() {
      console.log('emptyTable');
      MainCtrl.won = 0;
      return MainCtrl.lines = [];
    };
    $scope.addSequence = function(sequence) {
      var evaluation, newSeq, obj;
      newSeq = angular.copy(sequence);
      if ($scope.lengthLines >= $scope.conf.turns) {
        console.log('tour max atteint');
        return false;
      }
      if (MainCtrl.won) {
        console.log('vous avez déjà gagné');
        return false;
      }
      console.log('addSequence', newSeq);
      $scope.lengthLines = MainCtrl.lines.length;
      evaluation = $scope.evaluate(newSeq);
      $scope.result[$scope.lengthLines] = evaluation;
      obj = {
        id: $scope.lengthLines,
        pions: newSeq
      };
      MainCtrl.lines.push(obj);
      return evaluation;
    };

    /*
    évaluer la séquence
    et donner ses stats de réponse
     */
    $scope.evaluate = function(sequence) {
      var elem, evaluation, goods, i, j, len, nearly;
      goods = 0;
      nearly = 0;
      i = 0;
      for (j = 0, len = sequence.length; j < len; j++) {
        elem = sequence[j];
        if ($scope.sequenceAdverse[i].color === elem.color) {
          goods++;
        } else if ($scope.sequenceAdverse.indexOf(elem.color) !== -1) {
          nearly++;
        }
        i++;
      }
      evaluation = {
        goods: goods,
        nearly: nearly
      };
      if (evaluation.goods === $scope.conf.sequenceLength) {
        MainCtrl.won = 1;
        console.log('gagné');
        return evaluation;
      } else if (MainCtrl.lines.length === $scope.conf.turns - 1) {
        MainCtrl.loose = 1;
        return evaluation;
      }
      if ($scope.conf.autoRun) {
        $scope.sequence = angular.copy(IA.wonder(evaluation, sequence));
        IA.dumpTree();
      }
      return evaluation;
    };
    $scope.addRandomSequence = function() {
      var seq;
      seq = $scope.randomSequence();
      $scope.addSequence(seq);
      return seq;
    };
    $scope.randomSequence = function() {
      var colorList, i, j, l, obj, randomColor, randomNb, tab;
      tab = [];
      if ($scope.conf.doubleColors) {
        colorList = angular.copy($scope.couleurs);
        for (i = j = 1; j <= 4; i = ++j) {
          randomNb = Math.floor(Math.random() * colorList.length);
          randomColor = colorList[randomNb];
          colorList.splice(randomNb, 1);
          obj = {
            id: i,
            color: randomColor
          };
          tab.push(obj);
        }
      } else {
        for (i = l = 1; l <= 4; i = ++l) {
          randomNb = Math.floor(Math.random() * $scope.couleurs.length);
          randomColor = angular.copy($scope.couleurs[randomNb]);
          obj = {
            id: i,
            color: randomColor
          };
          tab.push(obj);
        }
      }
      return tab;
    };
    $scope.populateSequence = function() {
      return $scope.sequence = [
        {
          id: 0,
          color: 'blue'
        }, {
          id: 1,
          color: 'yellow'
        }, {
          id: 2,
          color: 'red'
        }, {
          id: 3,
          color: 'green'
        }
      ];
    };
    $scope.emptySequence = function() {
      $scope.lengthLines = 0;
      return $scope.sequence = [];
    };
    $scope.setSequence = function(id) {
      var seq;
      seq = angular.copy(MainCtrl.lines[id].pions);
      console.log('setSequence', seq);
      return $scope.sequence = seq;
    };
    $scope.colorUnique = function(color) {
      var j, len, pion, ref;
      ref = $scope.sequence;
      for (j = 0, len = ref.length; j < len; j++) {
        pion = ref[j];
        if (pion.color === color) {
          console.log('couleur non unique', color);
          return false;
        }
      }
      return true;
    };
    $scope.addColor = function(color) {
      var j, len, newId, pion, ref;
      if (!$scope.colorUnique(color)) {
        return false;
      }
      if ($scope.sequence.length === $scope.conf.sequenceLength) {
        $scope.sequence.splice(0, 1);
      }
      newId = 0;
      ref = $scope.sequence;
      for (j = 0, len = ref.length; j < len; j++) {
        pion = ref[j];
        pion.id = newId;
        newId++;
      }
      return $scope.sequence.push({
        id: newId,
        color: color
      });
    };
    $scope.deleteColor = function(color) {
      var counter, index, j, len, lepion, pion, ref;
      counter = 0;
      ref = $scope.sequence;
      for (j = 0, len = ref.length; j < len; j++) {
        pion = ref[j];
        if (pion.color === color) {
          index = counter;
          lepion = pion;
        }
        counter++;
      }
      console.log('enlever', color, index, $scope.sequence[index]);
      return $scope.sequence.splice(index, 1);
    };
    $scope.goPlayer = function() {
      $scope.config.player = 1;
      return $scope.emptySequence();
    };
    IA.makeTree($scope.couleurs);
    if ($scope.conf.randomGoal) {
      $scope.sequenceAdverse = $scope.randomSequence();
      console.log('but aléatoire', $scope.sequenceAdverse);
    }
    if ($scope.conf.autoRun) {
      console.log('autoRun');
      results = [];
      for (i = j = 0; j <= 10; i = ++j) {
        if (!$scope.won) {
          results.push($scope.addRandomSequence());
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  }
]);
