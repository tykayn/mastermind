(function() {
  angular.module("myApp", []).controller("MainCtrl", function($rootScope, $scope) {
    $scope.demo = 'WOHOOO';
    $scope.sequence = [];
    $scope.sequenceAdverse = ['yellow', 'violet', 'green', 'green', 'red'];
    $scope.addSequence = function() {
      var i, j, len, lengthLines, lespions, o, obj, ref;
      console.log('add sequence');
      lespions = [];
      i = 0;
      lengthLines = $scope.lines.length;
      ref = $scope.sequence;
      for (j = 0, len = ref.length; j < len; j++) {
        o = ref[j];
        lespions[i] = o;
        i++;
      }
      obj = {
        id: lengthLines,
        pions: lespions
      };
      console.log('obj', obj);
      return $scope.lines.push(obj);
    };
    $scope.populateSequence = function() {
      return $scope.sequence = ['yellow', 'violet', 'green', 'violet', 'red'];
    };
    $scope.addColor = function(color) {
      if ($scope.sequence.length > 4) {
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
        pions: ['white', 'white', 'black', 'black']
      };
    };
    $scope.line = [];
    return $scope.lines = [];
  });

}).call(this);
