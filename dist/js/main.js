(function() {
  angular.module("myApp", []).controller("MainCtrl", function($rootScope, $scope) {
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
      console.log('goods', goods);
      for (j = 0, len = sequence.length; j < len; j++) {
        elem = sequence[j];
        console.log('elem', elem);
        if ($scope.sequenceAdverse[i] === elem.color) {
          goods++;
        }
        if ($scope.sequenceAdverse.indexOf(elem.color)) {
          nearly++;
        }
        console.log('goods', goods);
        i++;
      }
      return {
        goods: goods,
        nearly: nearly
      };
    };
    $scope.sequence = [];
    $scope.sequenceAdverse = ["blue", "yellow", "red", "green"];
    $scope.addSequence = function() {
      var goods, lengthLines, lespions, obj;
      console.log('add sequence');
      lespions = angular.copy($scope.sequence);
      goods = $scope.evaluate(lespions);
      lengthLines = $scope.lines.length;
      $scope.result[lengthLines] = goods;
      obj = {
        id: lengthLines,
        pions: lespions
      };
      console.log('lines', $scope.lines);
      $scope.lines.push(obj);
      console.log('lines après', $scope.lines);
      return goods = $scope.evaluate(lespions);
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
    return $scope.lines = [];
  });

}).call(this);
