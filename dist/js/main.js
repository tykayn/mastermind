(function() {
  angular.module("myApp", []).controller("MainCtrl", function($rootScope, $scope) {
    $scope.demo = 'WOHOOO';
    $scope.sequence = [];
    $scope.sequenceAdverse = [
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
    $scope.addSequence = function() {
      var lengthLines, lespions, obj;
      console.log('add sequence');
      lespions = angular.copy($scope.sequence);
      lengthLines = $scope.lines.length;
      obj = {
        id: lengthLines,
        pions: lespions
      };
      console.log('lines', $scope.lines);
      $scope.lines.push(obj);
      return console.log('lines après', $scope.lines);
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
      var i, len, newId, pion, ref;
      if ($scope.sequence.length > 3) {
        $scope.sequence.splice(1, 1);
      }
      newId = 0;
      ref = $scope.sequence;
      for (i = 0, len = ref.length; i < len; i++) {
        pion = ref[i];
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

    /*
    évaluer la séquence
    et donner ses stats de réponse
    TODO
     */
    $scope.result = function(id) {
      return {
        pions: ['white', 'white', 'black', 'black']
      };
    };
    $scope.line = [];
    return $scope.lines = [];
  });

}).call(this);
