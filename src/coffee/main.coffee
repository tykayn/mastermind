# main module
angular.module "myApp", []
.controller "MainCtrl", ($rootScope, $scope)->
#    console.log('MainCtrl launched')
  $scope.demo = 'WOHOOO';
#    console.log('impressig!')