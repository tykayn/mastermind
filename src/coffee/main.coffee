# main module
angular.module "myApp", []
.controller "MainCtrl", ($rootScope, $scope)->
#    console.log('MainCtrl launched')
  $scope.demo = 'WOHOOO'

  # construction d'une séquence à ajouter
  $scope.sequence = []
  $scope.sequenceAdverse = [{id: 0, color: 'blue'},
    {id: 1, color: 'yellow'},
    {id: 2, color: 'red'},
    {id: 3, color: 'green'}]
  #  $scope.sequenceAdverse = []

  # ajouter à la séquence
  # TODO débug de cycle de digest
  $scope.addSequence = ()->
    console.log('add sequence')
    #    lespions = []
    lespions = angular.copy($scope.sequence)
    goods = $scope.evaluate(lespions)
    lengthLines = $scope.lines.length

    $scope.result[lengthLines] = goods
    obj =
      id: lengthLines
      pions: lespions
    console.log('lines', $scope.lines)
    $scope.lines.push(obj)
    console.log('lines après', $scope.lines)

  # ajouter à la séquence
  $scope.populateSequence = ()->
    $scope.sequence = [{id: 0, color: 'blue'}, {id: 1, color: 'yellow'}, {id: 2, color: 'red'}, {id: 3, color: 'green'}]
  #    $scope.sequence = []


  $scope.addColor = (color)->
    # si y'a déjà 5 couleurs, enlever la première
    if($scope.sequence.length > 3)
      $scope.sequence.splice(1, 1)
    #changer les id précédents
    newId = 0
    for pion in $scope.sequence
      pion.id = newId
      newId++
    newId++
    $scope.sequence.push({id: newId, color: color})
  # enlever à la séquence
  $scope.deleteColor = (index)->
    $scope.sequence.splice(index, 1)

  $scope.couleurs = [
    'yellow', 'violet', 'green', 'blue', 'red'
  ]

  ###
  évaluer la séquence
  et donner ses stats de réponse
  TODO
  ###
  $scope.evaluate = (sequence)->
    goods = 0
    for(elem in sequence)
      if($scope.toFind.indexOf(sequence[elem]) )
        goods++
    console.log('goods' , goods)
    goods
#    if(goods)
#      for()
#    pions: ['white', 'white', 'black', 'black']
  $scope.line = []
  $scope.lines = []
#    console.log('impressing!')