# AriaBot

![Ariabot](ariabot.png)

## Description

Outil discord pour la création de personnages basé sur les règles du jeu [Aria](https://game-of-roles.com/).

Les règles présentées sont disponibles dans les livres du jeu ainsi qu'en version gratuite sur le site d'[Elder Craft](https://elder-craft.com/collections/telechargements?syclid=cc3pvt839i7qmjcil96g)

Autre source: [BaSIC](https://www.sden.org/IMG/pdf/basicregles.pdf)

## Pré-requis

- Node et npm installés avec des versions récentes sur l'hôte'
- Bot configuré sur https://discord.com/developers/applications
  - Le bot doit avoir été invité sur un serveur
  - Le bot doit disposer des droits admin
  - Disposer du **token** du bot (disponible sur l'espace en ligne > Bot > TOKEN (s'il n'est pas affiché, reset le token))

## Lancement

1. Créer une copie de `config.json.example` à la racine et la renommer `config.json`
2. Dans `config.json`, modifier `"DISCORD TOKEN https://discord.com/developers/"` par le **token** du bot 
3. Se positionner dans le dossier et exécuter `npm init` et `npm install`
4. Lancer l'exécution du bot avec `node index.js`

## Commandes

- Toutes les commandes du bot s'exécutent lorsqu'on le mentionne. 
- Par défaut son nom est AriaBot. Il est possible de le renommer mais le préfixe de la commande étant la mention, certains copiés-collés pourraient ne pas fonctionner.

## Liste des commandes

### help 

Affiche la liste des commandes disponibles.

### caracInfos 

Affiche les informations sur toutes les caractéristiques

### competencesInfos 

Affiche les informations sur toutes les compétences

### calculComp 

Permet de calculer les compétences en transmettant la liste des caractéristiques dans l'ordre séparées par un espace.


Exemple: `calculComp [Force] [Dextérité] [Endurance] [Intelligence] [Charisme]`

Par exemple: `calculComp 12 11 8 6 13`

### compByCaracInfos 
Affiche la liste simplifiée des compétences et du calcul de caractéristiques lié.

## Sources dev:

- (un peu vieux, à adapter) https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js-fr
- https://discordjs.guide/whats-new.html#pages
- https://discord.com/developers/docs/topics/gateway#list-of-intents
- https://discordjs.guide/popular-topics/intents.html#enabling-intents