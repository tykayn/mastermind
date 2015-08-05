# main module
Mastermind = angular.module "myApp", []
# service pour analyser les séquences
Mastermind.service "AnalysePions", ()->
  console.log('AnalysePions')
  {
  suggestedSequence : []
  numTour : 0
# config à insérer
  config: {}
# début de partie, essais pour avoir un max d'infos sur toutes les couleurs
  beginBatch: ()->
    # au début, essayer toutes les couleurs
    nbCouleurs = @config.couleurs.length
    nbBatchs = nbCouleurs / @config.sequenceLength
    numTourActuel = @tree.length

    sequenceAdviced = @config.couleurs.slice(0 + (numTourActuel*@config.sequenceLength), @config.sequenceLength)
    @suggestedSequence = sequenceAdviced
    console.log('beginBatch',nbCouleurs,nbBatchs,sequenceAdviced)
    sequenceAdviced
# suggérer une séquence
# selon les plus hauts score de couleur parmi l'arbre des chances
  suggestSequence: ()->

    # TODO sur les premières séquences, batch
    nbBatchs = @config.couleurs.length / @config.sequenceLength
    console.info('Batchs',nbBatchs)
    if(@numTour <= nbBatchs)
      return @beginBatch()
    probas = []
    # TODO
    # comparaison avec les rangées gagnantes
    #   lister les séquences comportant au moins un bon pion
    #   comparer les tableaux avec des positions similaires.

    # trouver par proba
    # ranger par proba décroissante
    # sortir les 4 premiers par défaut
    for c in Object.keys(@tree)
      laProba = @tree[c].proba
      isBadColor = @tree[c].bad
      if(isBadColor)
        continue
      if(!probas[laProba])
        probas[laProba] = []
      probas[laProba].push(@tree[c].name)
    console.log('probas', probas, probas.sort())
    sequenceAdviced = probas.slice(0,@config.sequenceLength)
    console.log('sequenceAdviced', sequenceAdviced)
    @suggestedSequence = sequenceAdviced
    sequenceAdviced
# définir la config
  setConfig: (obj)->
    @config = obj
    console.log('@config' , @config.sequenceLength)


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
#    console.log('@tree',@tree)
    for c in Object.keys(@tree)
      dumpPhrase += ' ' + @tree[c].name + ' ' + @tree[c].proba
    #      console.log('c',c)
#    console.log(dumpPhrase)

  #    mettre du bad à toutes les couleurs de la séquence
  setBad: (sequence)->
    console.log('rien de bon, on met du bad')
    for c in sequence
      @tree[c.color].bad++
      @tree[c.color].proba = 0
  #    ajouter de la proba à toutes les couleurs de la séquence
  addProba: (points)->
#    console.info("add proba", @tree)
    for k in Object.keys(@tree)
      @tree[k].proba += points
#      console.info("add v.proba", @tree[k].proba)
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
    @numTour += 1
    console.info('numéro de tour', @numTour)
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

    @suggestSequence()

#    console.log('wondering on the result')
  upTree: ->
    @tree = ['up']
    console.info('IA: tree was updated', @tree)
    @tree
  }
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
    turns: 12 # essais du joueur
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

  if($scope.conf.randomGoal)
    $scope.sequenceAdverse = $scope.randomSequence()
    console.log('but aléatoire', $scope.sequenceAdverse)

  $scope.autoRun = ()->
    if(!$scope.conf.autoRun)
      console.log('autoRun désactivé')
      return
    console.log('autoRun')
    for i in [1..$scope.conf.turns]
      if(!$scope.won)
#        $scope.addSequence(IA.suggestedSequence);
        $scope.addRandomSequence();
  # lancer l'autorun
  if($scope.conf.autoRun)
    $scope.autoRun()
]