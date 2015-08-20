
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
    sequenceAdviced = []
    start = ((@numTour)*@config.sequenceLength)
    end = @config.sequenceLength+ ((@numTour)*@config.sequenceLength)
    splitting = @config.couleurs.slice(start, end)
    i = 0
    for pion in splitting
      obj = {
        id: i
        color: pion
      }
      i++
      sequenceAdviced.push(obj)
    @suggestedSequence = sequenceAdviced
    console.log('========= beginBatch',nbCouleurs,nbBatchs)

    sequenceAdviced
# suggérer une séquence
# selon les plus hauts score de couleur parmi l'arbre des chances
  suggestSequence: ()->
    console.info('------------ suggestSequence')
    # TODO sur les premières séquences, batch
    nbBatchs = @config.couleurs.length / @config.sequenceLength
    console.info('------------ Batchs',nbBatchs)
    if(@numTour <= nbBatchs)
      @suggestedSequence = @beginBatch()
      return @suggestedSequence
    probas = []
    # TODO
    # comparaison avec les rangées gagnantes
    #   lister les séquences comportant au moins un bon pion
    #   comparer les tableaux avec des positions similaires.
    console.log('************* TODO sequenceAdviced')
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
    console.log('sequenceAdviced', @config.sequenceLength, sequenceAdviced)
    @suggestedSequence = sequenceAdviced
    sequenceAdviced
# définir la config
  setConfig: (obj)->
    @config = obj
    console.log('@config' , @config.sequenceLength)

#    faire un arbre des chances par couleur
  makeTree: (colors)->
    console.info('----- construction de l\'arbre' )
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
    console.log('rien de bon, on met du bad',sequence)
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
      if(result.goods >= 2)
        @addProba(0.5)
# autrement, il y a au moins un pion à sortir
    else

    for c in sequence
#      console.info(c)
      @tree[c.color].tried++
      @tree[c.color].triedPositions[c.id]++

    retour = @suggestSequence()
    retour
#    console.log('wondering on the result')
  upTree: ->
    @tree = ['up']
    console.info('IA: tree was updated', @tree)
    @tree
  }