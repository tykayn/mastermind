(function() {
  angular.module("myApp", []).controller("MainCtrl", function($rootScope, $scope) {
    $scope.demo = 'WOHOOO';
    $scope.line = [];
    return $scope.lines = [
      {
        id: 0,
        pions: [
          {
            color: 'yellow'
          }, {
            color: 'violet'
          }, {
            color: 'violet'
          }, {
            color: 'violet'
          }, {
            color: 'violet'
          }
        ]
      }, {
        id: 1,
        pions: []
      }, {
        id: 2,
        pions: []
      }, {
        id: 3,
        pions: []
      }, {
        id: 4,
        pions: []
      }, {
        id: 5,
        pions: []
      }, {
        id: 6,
        pions: []
      }, {
        id: 7,
        pions: []
      }, {
        id: 8,
        pions: []
      }, {
        id: 9,
        pions: []
      }, {
        id: 10,
        pions: []
      }
    ];
  });

}).call(this);
