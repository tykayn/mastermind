Mastermind.controller("MainCtrl", [
  '$rootScope', '$scope', 'AnalysePions', function($rootScope, $scope, IA) {
    var MainCtrl;
    MainCtrl = this;

    /*
      config globale
     */
    $scope.conf = {
      player: 1,
      autoRun: 0,
      randomGoal: 1,
      debug: 1,
      turns: 12,
      sequenceLength: 4,
      doubleColors: 1,
      couleurs: ['yellow', 'violet', 'green', 'blue', 'red', 'orange', 'white', 'fuschia']
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
      if ($scope.lengthLines === $scope.conf.turns) {
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
      var couleursAdverses, elem, evaluation, goods, i, j, k, len, len1, nearly, ref;
      goods = 0;
      nearly = 0;
      i = 0;
      couleursAdverses = [];
      ref = $scope.sequenceAdverse;
      for (j = 0, len = ref.length; j < len; j++) {
        elem = ref[j];
        couleursAdverses.push(elem.color);
      }
      console.log('___________ couleursAdverses', couleursAdverses);
      for (k = 0, len1 = sequence.length; k < len1; k++) {
        elem = sequence[k];
        console.log('___________ elem', elem.color, couleursAdverses.indexOf(elem.color));
        if (couleursAdverses[i] === elem.color) {
          goods++;
        } else if (couleursAdverses.indexOf(elem.color) !== -1) {
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
    $scope.init = function() {
      if ($scope.conf.randomGoal) {
        $scope.sequenceAdverse = $scope.randomSequence();
        console.log('but aléatoire', $scope.sequenceAdverse);
      }
      $scope.autoRun = function() {
        var i, j, ref, results, suggestion;
        if (!$scope.conf.autoRun) {
          console.log('autoRun désactivé');
          return;
        }
        console.log('autoRun pour ' + $scope.conf.turns + ' tours');
        results = [];
        for (i = j = 1, ref = $scope.conf.turns; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          if (!$scope.won) {
            suggestion = IA.suggestSequence();
            console.log('suggestion', suggestion);
            results.push($scope.addSequence(suggestion));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      if ($scope.conf.autoRun) {
        return $scope.autoRun();
      }
    };
    return $scope.init();
  }
]);
