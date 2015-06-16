# main module
angular.module "myApp", []
.controller "MainCtrl", ($rootScope, $scope)->
#    console.log('MainCtrl launched')
  $scope.demo = 'WOHOOO'

  # construction d'une séquence à ajouter
  $scope.sequence = []
  $scope.sequenceAdverse = ['yellow', 'violet', 'green', 'green', 'red']

  # ajouter à la séquence
  $scope.addSequence = ()->
    obj =
      id: $scope.lines.length
      pions: [].concat($scope.sequence)
    $scope.lines.push(obj)
  # ajouter à la séquence
  $scope.addColor = (color)->
    # si y'a déjà 5 couleurs, enlever la première
    if($scope.sequence > 4)
      $scope.sequence.splice(1, 1)
    $scope.sequence.push(color)
  # enlever à la séquence
  $scope.deleteColor = (index)->
    $scope.sequence.splice(index, 1)

  $scope.couleurs = [
    'yellow', 'violet', 'green', 'blue', 'red'
  ]

  ###
  évaluer la séquence
  et donner ses stats de réponse
###
  $scope.result = (id)->
    pions: [{color: 'yellow'},
      {color: 'violet'},
      {color: 'violet'},
      {color: 'violet'}]
  $scope.line = []
  $scope.lines = [
#    {
#      id: 0, pions: [{color: 'yellow'},
#      {color: 'violet'},
#      {color: 'green'},
#      {color: 'blue'},
#      {color: 'red'}]
#    }
#    {id: 1, pions: []}
#    {id: 2, pions: []}
#    {id: 3, pions: []}
#    {id: 4, pions: []}
#    {id: 5, pions: []}
#    {id: 6, pions: []}
#    {id: 7, pions: []}
#    {id: 8, pions: []}
#    {id: 9, pions: []}
#    {id: 10, pions: []}
  ]
#    console.log('impressig!')