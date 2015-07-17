var Mastermind;

Mastermind = angular.module("myApp", []);

Mastermind.service("AnalysePions", function() {
  console.log('AnalysePions');
  return {
    suggestSequence: function() {},
    makeTree: function(colors) {
      var c, j, len, stats;
      this.tree = [];
      for (j = 0, len = colors.length; j < len; j++) {
        c = colors[j];
        stats = {
          name: c,
          proba: 1 - 1 / 4,
          inGood: 0,
          inNearly: 0,
          bad: 0,
          tried: 0,
          triedPositions: 0
        };
        this.tree[c] = stats;
      }
      return this.tree;
    },
    dumpTree: function() {
      var c, dumpPhrase, j, len, ref;
      dumpPhrase = 'Tree: ';
      ref = Object.keys(this.tree);
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        dumpPhrase += ' ' + this.tree[c].name + ' ' + this.tree[c].proba;
      }
      return console.log(dumpPhrase);
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
      var c, j, len, ref, results;
      console.info(this.tree);
      ref = this.tree;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        results.push(this.tree[c].proba += points);
      }
      return results;
    },
    wonder: function(result, sequence) {
      var c, j, len;
      if (result.goods === 0) {
        if (result.nearly === 0) {
          this.setBad(sequence);
          return;
        } else if (result.nearly === 0) {
          this.addProba(-0.25);
        }
        return;
      } else if (result.goods <= 2) {
        this.addProba(0.5);
      }
      for (j = 0, len = sequence.length; j < len; j++) {
        c = sequence[j];
        this.tree[c.color].tried++;
        this.tree[c.color].triedPositions[c.id]++;
      }
      return console.log('wondering on the result');
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

    /*
      config globale
     */
    var i, j, results;
    $scope.conf = {
      autoRun: 1,
      debug: 1,
      turns: 3,
      sequenceLength: 4,
      doubleColors: 1
    };
    console.log('MainCtrl launched with ', IA);
    $scope.demo = 'WOHOOO';

    /*
    tableau des évaluations pour chaque séquence
     */
    $scope.result = [];

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
        if ($scope.sequenceAdverse[i] === elem.color) {
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
        $scope.won = 1;
        return;
      } else if ($scope.lines.length === $scope.conf.turns - 1) {
        $scope.loose = 1;
        return;
      }
      IA.wonder(evaluation, sequence);
      IA.dumpTree();
      return evaluation;
    };
    $scope.sequence = [];
    $scope.won = 0;
    $scope.loose = 0;
    $scope.sequenceAdverse = ["blue", "yellow", "red", "green"];
    $scope.addSequence = function(sequence) {
      var goods, lengthLines, lespions, obj;
      lengthLines = $scope.lines.length;
      if (lengthLines >= $scope.conf.turns) {
        console.log('tour max atteint');
        return false;
      }
      lespions = angular.copy(sequence);
      goods = $scope.evaluate(lespions);
      $scope.result[lengthLines] = goods;
      obj = {
        id: lengthLines,
        pions: lespions
      };
      $scope.lines.push(obj);
      return goods = $scope.evaluate(lespions);
    };
    $scope.addRandomSequence = function() {
      var seq;
      seq = $scope.randomSequence();
      $scope.addSequence(seq);
      return seq;
    };
    $scope.randomSequence = function() {
      var colorList, i, j, k, obj, randomColor, randomNb, tab;
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
        for (i = k = 1; k <= 4; i = ++k) {
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
      var sequence;
      return sequence = [];
    };
    $scope.addColor = function(color) {
      var j, len, newId, pion, ref;
      if ($scope.sequence.length === $scope.conf.sequenceLength) {
        $scope.sequence.splice(1, 1);
      }
      newId = 0;
      ref = $scope.sequence;
      for (j = 0, len = ref.length; j < len; j++) {
        pion = ref[j];
        pion.id = newId;
        newId++;
      }
      newId++;
      return $scope.sequence.push({
        id: newId,
        color: color
      });
    };
    $scope.deleteColor = function(index) {
      console.log('enlever', index, $scope.sequence[index]);
      return $scope.sequence.splice(index, 1);
    };
    $scope.couleurs = ['yellow', 'violet', 'green', 'blue', 'red'];
    IA.makeTree($scope.couleurs);
    $scope.line = [];
    $scope.lines = [];
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
