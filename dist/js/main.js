var Mastermind;

Mastermind = angular.module("myApp", []);

Mastermind.service("AnalysePions", function() {
  console.log('AnalysePions');
  return {
    makeTree: function() {
      this.tree = [];
      console.info('IA: tree was made', this.tree);
      return this.tree;
    },
    wonder: function(result, sequence) {
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
    IA.makeTree();
    $scope.conf = {
      autoRun: 1,
      debug: 1,
      turns: 10,
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
      var elem, goods, i, j, len, nearly;
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
      return {
        goods: goods,
        nearly: nearly
      };
    };
    $scope.sequence = [];
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
    $scope.addColor = function(color) {
      var j, len, newId, pion, ref;
      if ($scope.sequence.length > 3) {
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
      return $scope.sequence.splice(index, 1);
    };
    $scope.couleurs = ['yellow', 'violet', 'green', 'blue', 'red'];
    $scope.line = [];
    $scope.lines = [];
    if ($scope.conf.autoRun) {
      console.log('autoRun');
      results = [];
      for (i = j = 0; j <= 10; i = ++j) {
        results.push($scope.addRandomSequence());
      }
      return results;
    }
  }
]);
