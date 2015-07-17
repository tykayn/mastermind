# main module
Mastermind = angular.module "myApp", []
# service pour analyser les séquences
Mastermind.service "AnalysePions", ()->
  console.log('AnalysePions')
  {
  # suggérer une séquence
  # selon les plus hauts score de couleur parmi l'arbre des chances
  suggestSequence : ()->
    # ranger par proba décroissante
    # sortir les 4 premiers par défaut

  #    faire un arbre des chances par couleur
  makeTree : (colors)->
    @tree = []
    # attribuer 1 - 1/nombre de pions max par séquence à toutes les couleurs,
    # elles sont toutes éligibles à gagner mais il y a plus de couleurs possibles
    # que de pions par séquence (4 par défaut).
    for c in colors
      stats = {
        name: c
        proba : 1 - 1/4
        inGood : 0
        inNearly : 0
        bad : 0
        tried : 0
        triedPositions : 0
      }
      @tree[c] = stats
#    console.info('IA: tree was made',@tree)
    @tree




  #    faire un rendu lisible de l'arbre en ne donnant que la proba
  dumpTree : ()->
    dumpPhrase = 'Tree: '
#    console.log('@tree',@tree)
    for c in Object.keys(@tree)
      dumpPhrase +=  ' '+@tree[c].name+ ' ' + @tree[c].proba
#      console.log('c',c)
    console.log(dumpPhrase)

#    mettre du bad à toutes les couleurs de la séquence
  setBad : (sequence)->
    console.log('rien de bon, on met du bad')
    for c in sequence
      @tree[c.color].bad++
      @tree[c.color].proba=0
#    ajouter de la proba à toutes les couleurs de la séquence
  addProba : (points)->
    console.info(@tree)
    for c in @tree

      @tree[c].proba+=points
#    attribuer des chances par couleur selon le résultat
  wonder : (result,sequence)->
    # si le score de pions mal placés et bon est faible,
    # on augmente les chances des couleurs pas encore entrées d'être bonnes.
    if( result.goods is 0 )
      if(result.nearly is 0)
      # aucun pion de bon,
      # mettre du bad aux couleurs mises
        @setBad(sequence)
        return
      else if(result.nearly is 0)
        @addProba(-0.25)
      # mettre du bad aux couleurs mises

      # baisser les probas aux couleurs mises
      # ajouter des chances aux autres couleurs

      return
    else if(result.goods <=2)
      @addProba(0.5)

    for c in sequence
#      console.info(c)
      @tree[c.color].tried++
      @tree[c.color].triedPositions[c.id]++

    console.log('wondering on the result')
  upTree : ->
    @tree = ['up']
    console.info('IA: tree was updated',@tree)
    @tree
  }
Mastermind.controller "MainCtrl" , [ '$rootScope', '$scope', 'AnalysePions', ($rootScope, $scope, IA)->
  ###
    config globale
    ###



  $scope.conf = {
    autoRun : 1
    debug : 1
    turns : 3
    sequenceLength : 4
    doubleColors : 1
  }
  console.log('MainCtrl launched with ', IA)
  $scope.demo = 'WOHOOO'
  ###
  tableau des évaluations pour chaque séquence
  ###
  $scope.result = []
  ###
    évaluer la séquence
    et donner ses stats de réponse
    ###
  $scope.evaluate = (sequence)->
    goods = 0
    nearly = 0
    i=0
    for elem in sequence
      if($scope.sequenceAdverse[i] is elem.color)
        goods++
      else if($scope.sequenceAdverse.indexOf(elem.color) != -1 )
        nearly++
      i++
    evaluation = {goods:goods,
    nearly:nearly}
    # teste si on a gagné
    if(evaluation.goods is $scope.conf.sequenceLength)
      $scope.won = 1
      return
    # teste si on a perdu
    else if($scope.lines.length is $scope.conf.turns-1)
      $scope.loose = 1
      return
    # autrement le jeu continue

    IA.wonder(evaluation, sequence)
    IA.dumpTree()
    evaluation

  # construction d'une séquence à ajouter
  $scope.sequence = []
  $scope.won = 0 # a t on gagné?
  $scope.loose = 0 # a t on perdu?
  $scope.sequenceAdverse = ["blue","yellow","red","green"]

  # ajouter à la séquence
  $scope.addSequence = (sequence)->
    lengthLines = $scope.lines.length
    if(lengthLines>= $scope.conf.turns)
      console.log('tour max atteint')
      return false
#    console.log('add sequence')
    lespions = angular.copy(sequence)
    goods = $scope.evaluate(lespions)


    $scope.result[lengthLines] = goods
    obj =
      id: lengthLines
      pions: lespions
#    console.log('lines', $scope.lines)
    $scope.lines.push(obj)
#    console.log('lines après', $scope.lines)
    goods = $scope.evaluate(lespions)

  # ajouter une séquence au hasard
  $scope.addRandomSequence = ()->
    seq = $scope.randomSequence()
    $scope.addSequence( seq )
    seq

  # faire une séquence au hasard
  $scope.randomSequence = ()->
    tab = []
    # si utiliser des pions de même couleur plusieurs fois est autorisé
    if $scope.conf.doubleColors
      colorList = angular.copy($scope.couleurs)
      for i in [1..4]
        randomNb = Math.floor( Math.random()*colorList.length )
#        console.log('randomNb' , randomNb, 'colorList', colorList)
        randomColor = colorList[randomNb]
        # enlever cette couleur de la liste pour éviter de l'avoir en double
        colorList.splice(randomNb,1)
        obj = {id: i, color: randomColor}
        tab.push(obj)
    else
      for i in [1..4]
        randomNb = Math.floor( Math.random()*$scope.couleurs.length )
#        console.log('randomNb' , randomNb)
        randomColor = angular.copy($scope.couleurs[randomNb])
        obj = {id: i, color: randomColor}
        tab.push(obj)
    tab

  # ajouter à la séquence
  $scope.populateSequence = ()->
    $scope.sequence = [{id: 0, color: 'blue'}, {id: 1, color: 'yellow'}, {id: 2, color: 'red'}, {id: 3, color: 'green'}]
  #    $scope.sequence = []


  # vider la séquence
  $scope.emptySequence = ()->
    sequence=[]
  # ajouter a la séquence
  $scope.addColor = (color)->
    # si y'a déjà le max de couleurs, enlever la première
    if($scope.sequence.length is $scope.conf.sequenceLength)
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
    console.log('enlever', index, $scope.sequence[index])
    $scope.sequence.splice(index, 1)

  $scope.couleurs = [
    'yellow', 'violet', 'green', 'blue', 'red'
  ]
  IA.makeTree($scope.couleurs)

  $scope.line = []
  $scope.lines = []
  # lancer l'autorun
  if($scope.conf.autoRun)
    console.log('autoRun')
    for i in [0..10]
      if(!$scope.won)
        $scope.addRandomSequence();
]