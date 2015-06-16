(function() {
  angular.module("myApp", []).controller("MainCtrl", function($rootScope, $scope) {
    $scope.demo = 'WOHOOO';
    $scope.sequence = [];
    $scope.sequenceAdverse = ['yellow', 'violet', 'green', 'green', 'red'];
    $scope.addSequence = function() {
      var obj;
      obj = {
        id: $scope.lines.length,
        pions: [].concat($scope.sequence)
      };
      return $scope.lines.push(obj);
    };
    $scope.addColor = function(color) {
      if ($scope.sequence > 4) {
        $scope.sequence.splice(1, 1);
      }
      return $scope.sequence.push(color);
    };
    $scope.deleteColor = function(index) {
      return $scope.sequence.splice(index, 1);
    };
    $scope.couleurs = ['yellow', 'violet', 'green', 'blue', 'red'];

    /*
    évaluer la séquence
    et donner ses stats de réponse
     */
    $scope.result = function(id) {
      return {
        pions: [
          {
            color: 'yellow'
          }, {
            color: 'violet'
          }, {
            color: 'violet'
          }, {
            color: 'violet'
          }
        ]
      };
    };
    $scope.line = [];
    return $scope.lines = [];
  });

}).call(this);
