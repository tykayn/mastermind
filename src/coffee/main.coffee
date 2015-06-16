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
    console.log('add sequence')
    lespions = []
    i = 0
    lengthLines = $scope.lines.length
    for o in $scope.sequence
      lespions[i] = o
      i++
    obj =
      id: lengthLines
      pions: lespions
    console.log('obj', obj)
    $scope.lines.push(obj)
  # ajouter à la séquence
  $scope.populateSequence = ()->
    $scope.sequence = ['yellow', 'violet', 'green', 'violet', 'red']

  $scope.addColor = (color)->
    # si y'a déjà 5 couleurs, enlever la première
    if($scope.sequence.length > 4)
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
    pions: ['white', 'white', 'black', 'black']
  $scope.line = []
  $scope.lines = []
#    console.log('impressig!')