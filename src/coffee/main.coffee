
Mastermind.controller "MainCtrl", ['$rootScope', '$scope', 'AnalysePions', ($rootScope, $scope, IA)->

  MainCtrl = this
  ###
    config globale
  ###
  $scope.conf = {
    player: 1 # joueurs
    autoRun: 1 # lancer automatiquement les séquences
    randomGoal: 1 # choisir une séquence adverse aléatoire
    debug: 1 # montrer infos de débug
    turns: 4 # essais du joueur
    sequenceLength: 4 # pions par séquence
    doubleColors: 1 # autoriser les couleurs doubles
    couleurs: ['yellow', 'violet', 'green', 'blue', 'red','orange','white','fuschia']
  }
  $scope.couleurs = $scope.conf.couleurs
  IA.setConfig($scope.conf)
  console.log('MainCtrl launched with ', IA)
  $scope.demo = 'WOHOOO'
  ###
  tableau des évaluations pour chaque séquence
  ###
  $scope.result = []


  # construction d'une séquence à ajouter
  $scope.sequence = []
  $scope.altColors = 0
  MainCtrl.lines=[]
  MainCtrl.won = 0 # a t on gagné?
  MainCtrl.loose = 0 # a t on perdu?
  $scope.sequenceAdverse = ["blue", "yellow", "red", "green"]
  $scope.MainCtrl = MainCtrl

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
    MainCtrl.won=0
    MainCtrl.lines=[]

  # ajouter à la séquence
  $scope.addSequence = (sequence)->
    newSeq = angular.copy(sequence)
    if($scope.lengthLines is $scope.conf.turns)
      console.log('tour max atteint')
      return false
    if(MainCtrl.won)
      console.log('vous avez déjà gagné')
      return false
#    sequence = angular.copy($scope.sequence)
    console.log('addSequence', newSeq)
    $scope.lengthLines = MainCtrl.lines.length

    evaluation = $scope.evaluate(newSeq)
    $scope.result[$scope.lengthLines] = evaluation
    obj =
      id: $scope.lengthLines
      pions: newSeq
#    console.log('lines', MainCtrl.lines)
    MainCtrl.lines.push(obj)
#    console.log('lines après', MainCtrl.lines)
    evaluation

  ###
  évaluer la séquence
  et donner ses stats de réponse
  ###
  $scope.evaluate = (sequence)->
    goods = 0
    nearly = 0
    i = 0
    for elem in sequence
      if($scope.sequenceAdverse[i].color is elem.color)
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
      MainCtrl.won = 1
      console.log('gagné')
      return evaluation
    # teste si on a perdu
    else if(MainCtrl.lines.length is $scope.conf.turns - 1)
      MainCtrl.loose = 1
      return evaluation
    # autrement le jeu continue
    if($scope.conf.autoRun)
      $scope.sequence = angular.copy(IA.wonder(evaluation, sequence))
      IA.dumpTree()
    evaluation
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

  # copier une séquence du tableau d'historique
  # id : id de ligne dans l'historique
  $scope.setSequence = (id)->
    seq = angular.copy(MainCtrl.lines[id].pions)
    console.log('setSequence', seq)
    $scope.sequence = seq

  # vérif que la couleur n'est pas déjà présente dans la séquence
  $scope.colorUnique =(color)->
    for pion in $scope.sequence
      if(pion.color is color)
        console.log('couleur non unique', color)
        return false
    true

  # ajouter a la séquence
  $scope.addColor = (color)->
    if(!$scope.colorUnique(color))
#      $scope.deleteColor(color)
      return false
    # si y'a déjà le max de couleurs, enlever la première
    if($scope.sequence.length is $scope.conf.sequenceLength)
      $scope.sequence.splice(0, 1)
    #changer les id précédents
    newId = 0
    for pion in $scope.sequence
      pion.id = newId
      newId++
#    newId++
    $scope.sequence.push({id: newId, color: color})
  # enlever à la séquence
  $scope.deleteColor = (color)->
    counter = 0
    for pion in $scope.sequence
      if(pion.color is color)
        index = counter
        lepion = pion
      counter++
    console.log('enlever', color, index,$scope.sequence[index])
    $scope.sequence.splice(index, 1)

  # config pour joueur sans automatisation
  $scope.goPlayer = ()->
    $scope.config.player = 1
    $scope.emptySequence()

  IA.makeTree($scope.couleurs)

  $scope.init = ->
    if($scope.conf.randomGoal)
      $scope.sequenceAdverse = $scope.randomSequence()
      console.log('but aléatoire', $scope.sequenceAdverse)

    # gestion de l'autorun
    # avec méthodes pour suggérer une séquence
    # TODO mettre en place la combinaison suggérée
    $scope.autoRun = ()->
      if(!$scope.conf.autoRun)
        console.log('autoRun désactivé')
        return
      console.log('autoRun pour '+$scope.conf.turns+' tours')
      #        $scope.addRandomSequence();
      for i in [1..$scope.conf.turns]
        if(!$scope.won)
          suggestion = IA.suggestSequence()
          console.log('suggestion',suggestion)
          $scope.addSequence(suggestion);

    # lancer l'autorun
    if($scope.conf.autoRun)
      $scope.autoRun()
  # démarrer tout
  $scope.init()

]