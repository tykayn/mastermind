# main module
Mastermind = angular.module "myApp", []
# service pour analyser les séquences
Mastermind.service "AnalysePions", ()->
  console.log('AnalysePions')
  {
# config à insérer
  config: {}
# suggérer une séquence
# selon les plus hauts score de couleur parmi l'arbre des chances
  suggestSequence: ()->
  setConfig: (obj)->
    @config = obj
    console.log('@config' , @config.sequenceLength)
# ranger par proba décroissante
# sortir les 4 premiers par défaut

#    faire un arbre des chances par couleur
  makeTree: (colors)->
    @tree = []
    # attribuer 1 - 1/nombre de pions max par séquence à toutes les couleurs,
    # elles sont toutes éligibles à gagner mais il y a plus de couleurs possibles
    # que de pions par séquence (4 par défaut).
    for c in colors
      stats = {
        name: c
        proba: 1 - 1 / (@config.sequenceLength || 4)
        inGood: 0
        inNearly: 0
        bad: 0
        tried: 0
        triedPositions: {
          0:0
          1:0
          2:0
          3:0
          4:0
        }
      }
      @tree[c] = stats
    #    console.info('IA: tree was made',@tree)
    @tree




  #    faire un rendu lisible de l'arbre en ne donnant que la proba
  dumpTree: ()->
    dumpPhrase = 'Tree: '
    console.log('@tree',@tree)
    for c in Object.keys(@tree)
      dumpPhrase += ' ' + @tree[c].name + ' ' + @tree[c].proba
    #      console.log('c',c)
    console.log(dumpPhrase)

  #    mettre du bad à toutes les couleurs de la séquence
  setBad: (sequence)->
    console.log('rien de bon, on met du bad')
    for c in sequence
      @tree[c.color].bad++
      @tree[c.color].proba = 0
  #    ajouter de la proba à toutes les couleurs de la séquence
  addProba: (points)->
    console.info("add proba", @tree)
    for k in Object.keys(@tree)
      @tree[k].proba += points
      console.info("add v.proba", @tree[k].proba)
  # trouver les couleurs qui ne sont pas dans la séquence donnée
  colorDiff : (sequence)->
    colors = angular.copy(@config.couleurs)
    simpleSequence = []
    for c in sequence
      simpleSequence.push(c.color)
    # diff de couleurs
    diff = $(colors).not(simpleSequence)
    diff

  ###
  # attribuer des chances par couleur selon le résultat
  ###
  wonder: (result, sequence)->
    # si le score de pions mal placés et bon est faible,
    # on augmente les chances des couleurs pas encore entrées d'être bonnes.
    if( result.goods is 0 )
      if(result.nearly is 0)
        # aucun pion de bon,
        # mettre du bad aux couleurs mises
        @setBad(sequence)
        # ajouter des chances aux autres couleurs

        return
      # si ya la moitié des pions de mal placés,
      # c'est que la moitié est bien placée
      else if(result.nearly <= @config.sequenceLength / 2)
        @addProba(0.5)

      # baisser les probas aux couleurs mises


      return
    # tous les pions sont bons, mais mal placés
    else if(result.goods + result.nearly is @config.sequenceLength)
      console.info('tous les pions sont bons, mais mal placés')
      # exclure les couleurs en dehors de la séquence
      diff = @colorDiff(sequence)
      # mettre à aucune proba sur les couleurs restantes
      for c in diff
        @tree[c].bad++
        @tree[c].proba = 0
      @addProba(1)
    else if(result.goods >= 2)
      @addProba(0.5)

    for c in sequence
#      console.info(c)
      @tree[c.color].tried++
      @tree[c.color].triedPositions[c.id]++

#    console.log('wondering on the result')
  upTree: ->
    @tree = ['up']
    console.info('IA: tree was updated', @tree)
    @tree
  }
Mastermind.controller "MainCtrl", ['$rootScope', '$scope', 'AnalysePions', ($rootScope, $scope, IA)->

  ###
    config globale
    ###
  $scope.conf = {
    player: 0 # joueurs
    autoRun: 1 # lancer automatiquement les séquences
    debug: 1
    turns: 10
    sequenceLength: 4
    doubleColors: 1
    couleurs: ['yellow', 'violet', 'green', 'blue', 'red']
  }
  $scope.couleurs = $scope.conf.couleurs
  IA.setConfig($scope.conf)
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
    i = 0
    for elem in sequence
      if($scope.sequenceAdverse[i] is elem.color)
        goods++
      else if($scope.sequenceAdverse.indexOf(elem.color) != -1 )
        nearly++
      i++
    evaluation = {
      goods: goods,
      nearly: nearly
    }
    # teste si on a gagné
    if(evaluation.goods is $scope.conf.sequenceLength)
      $scope.won = 1
      return evaluation
# teste si on a perdu
    else if($scope.lines.length is $scope.conf.turns - 1)
      $scope.loose = 1
      return evaluation
    # autrement le jeu continue

    IA.wonder(evaluation, sequence)
    IA.dumpTree()
    evaluation

  # construction d'une séquence à ajouter
  $scope.sequence = []
  $scope.won = 0 # a t on gagné?
  $scope.loose = 0 # a t on perdu?
  $scope.sequenceAdverse = ["blue", "yellow", "red", "green"]

  # vider toutes les séquences
  $scope.gagner = ()->
    i=0
    for c in $scope.sequenceAdverse
      obj = {
        id : i++
        color: c
      }
      $scope.sequence.push(obj)
    $scope.sequence
  # vider toutes les séquences
  $scope.emptyTable = ()->
    console.log('emptyTable')
    $scope.lines=[]
  # ajouter à la séquence
  $scope.addSequence = (sequence)->
    $scope.lengthLines = $scope.lines.length
    if($scope.lengthLines >= $scope.conf.turns)
      console.log('tour max atteint')
      return false
    #    console.log('add sequence')
    lespions = angular.copy(sequence)
    goods = $scope.evaluate(lespions)


    $scope.result[$scope.lengthLines] = goods
    obj =
      id: $scope.lengthLines
      pions: lespions
    #    console.log('lines', $scope.lines)
    $scope.lines.push(obj)
    #    console.log('lines après', $scope.lines)
    goods = $scope.evaluate(lespions)

  # ajouter une séquence au hasard
  $scope.addRandomSequence = ()->
    seq = $scope.randomSequence()
    $scope.addSequence(seq)
    seq

  # faire une séquence au hasard
  $scope.randomSequence = ()->
    tab = []
    # si utiliser des pions de même couleur plusieurs fois est autorisé
    if $scope.conf.doubleColors
      colorList = angular.copy($scope.couleurs)
      for i in [1..4]
        randomNb = Math.floor(Math.random() * colorList.length)
        #        console.log('randomNb' , randomNb, 'colorList', colorList)
        randomColor = colorList[randomNb]
        # enlever cette couleur de la liste pour éviter de l'avoir en double
        colorList.splice(randomNb, 1)
        obj = {id: i, color: randomColor}
        tab.push(obj)
    else
      for i in [1..4]
        randomNb = Math.floor(Math.random() * $scope.couleurs.length)
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
    $scope.lengthLines = 0
    $scope.sequence = []
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

  # config pour joueur sans automatisation
  $scope.goPlayer = ()->
    $scope.config.player = 1
    $scope.emptySequence()

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