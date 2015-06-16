# main module
angular.module "myApp", []
.controller "MainCtrl", ($rootScope, $scope)->
#    console.log('MainCtrl launched')
  $scope.demo = 'WOHOOO'

  # construction d'une séquence à ajouter
  $scope.sequence = []
  $scope.addColor = (color)->
    $scope.sequence.push(color)
  $scope.deleteColor = (index)->
    $scope.sequence.splice(index,1)

  $scope.couleurs = ['yellow', 'violet','green','blue','red']
  $scope.result = (id)->
    pions: [
      {color: 'yellow'},
      {color: 'violet'},
      {color: 'violet'},
      {color: 'violet'}
    ]
  $scope.line = []
  $scope.lines = [
    {
      id: 0, pions: [
      {color: 'yellow'},
      {color: 'violet'},
      {color: 'violet'},
      {color: 'violet'},
      {color: 'violet'}
    ]
    }
    {id: 1, pions: []}
    {id: 2, pions: []}
    {id: 3, pions: []}
    {id: 4, pions: []}
    {id: 5, pions: []}
    {id: 6, pions: []}
    {id: 7, pions: []}
    {id: 8, pions: []}
    {id: 9, pions: []}
    {id: 10, pions: []}
  ]
#    console.log('impressig!')