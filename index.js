// Récupération des fichiers nécessaires
const { token } = require("./config.json");
const { Client, GatewayIntentBits } = require('discord.js');
const commands = require("./commands.json"); 

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
        
		GatewayIntentBits.MessageContent,
	],
});

// Connexion via le Token => Le token doit correspondre au token créé sur https://discord.com/developers
client.login(token);

// Message log pour vérifier si le bot est bien chargé => c'est le moment où il se connecte à un serveur
client.on('ready', () => {
    console.log(`AriaBot est connecté au serveur en tant que ${client.user.tag}!`);
});

// Sur lecture d'un message
client.on('messageCreate', msg => {
  // Si le message a été écrit par le bot lui même on arrête la lecture
  if (msg.author.bot) return;

  // Si le bot est mentionné dans le message il attend une commande
  if (msg.mentions.has(client.user.id)) {
    // Récupération du message complet (comportant l'identifiant user relatif à la mention)
    let message = msg.content;
    // Découpage du message pour supprimer la mention
    message = message.replace(/.*> /, '');

    // Découpage du message en tableau en séparant chaque espace
    const commandArray = message.split(" ");

    // Si la commande existe dans la liste des commandes json, exécuter le code associé
    if(commands.hasOwnProperty(commandArray[0])) {
      switch(commandArray[0]) {
        // La commande help affiche les informations sur toutes les commandes
        case "help": 
          let strHelp = '';

          for (const property in commands) {
            strHelp += `\n**${property}** \n${commands[property].description}\n`;
          }
          msg.reply(`**:keyboard: Liste des commandes :keyboard:** \n${strHelp}`);
        break;

        // La commande caracInfos retourne la liste des caractéristiques et leurs informations
        case "caracInfos":
          let strCaracInfos = '';

          for (const property in commands.caracInfos.infos) {
            strCaracInfos += `\n**${property}:** \n${commands.caracInfos.infos[property]}\n`;
          }
          msg.reply(`**Liste des caractéristiques** \n${strCaracInfos}`);
        break;
        
        // La commande competencesInfos retourne la liste des compétences et leurs informations
        case "competencesInfos":
          // Gestion de la liste via un tableau => à cause de la taille max des msg discord de 2000 caractères
          let arrayCompetencesInfos = [];
          let strComp = `**Liste des compétences** \n`;

          for (const property in commands.competencesInfos.infos) {
            let newString = `\n**${property} (${commands.competencesInfos.infos[property].carac1} + ${commands.competencesInfos.infos[property].carac2}):**\n${commands.competencesInfos.infos[property].description}\n`;

            if(strComp.length + newString.length > 2000) {
              arrayCompetencesInfos.push(strComp);
              strComp = '';
            } else {
              strComp += newString;
            }
          }
          arrayCompetencesInfos.push(strComp);

          arrayCompetencesInfos.forEach(str => msg.reply(`${str}`));
        
        break;
        
        // La commande calculComp attend en paramètres de commande les caractéristiques dans l'ordre suivant:
        // Force Dextérité Endurance Intelligence Charisme
        case "calculComp":
          console.log(commandArray.length);
          if(commandArray.length === 6) {
            let [cmd, forc, dext, end, intel, cha] = commandArray;

            forc = parseInt(forc);
            dext = parseInt(dext);
            end = parseInt(end);
            intel = parseInt(intel);
            cha = parseInt(cha);
            
            if(Number.isInteger(forc), Number.isInteger(dext), Number.isInteger(end), Number.isInteger(intel), Number.isInteger(cha)) {
              let calculComp = "**Compétences**\n\n";
              for (const property in commands.competencesInfos.infos) {
                calculComp += `\n**${property}:** ${getCompByCarac(commandArray, commands.competencesInfos.infos[property].carac1, commands.competencesInfos.infos[property].carac2)}`;
              }
              
              msg.reply(calculComp);
            } else {
              msg.reply(`Valeurs fournies NOK:\n
              Force: ${forc}\n
              Dextérité: ${dext}\n
              Endurance: ${end}\n
              Intelligence: ${intel}\n
              Charisme: ${cha}\n`);
            }
          } else {
            // Si on a pas les paramètres transmis, on renvoie la description de la commande qui fait office de doc
            msg.reply(commands.calculComp.description);
          }

        break;

        // La commande compByCaracInfos retourne une liste simplifiée des compétences et des caractéristiques servant à leur calcul
        case "compByCaracInfos":
          let strInfos = '';

          for (const property in commands.competencesInfos.infos) {
            strInfos += `\n**${property}:** \n${commands.competencesInfos.infos[property].carac1} + ${commands.competencesInfos.infos[property].carac2}\n`;
          }
          msg.reply(`**Infos calcul de caractéristiques** \n${strInfos}`);
          break;

        case "Roll3d6x7":
          let result = '';
          for(i = 1; i <= 7; i ++) {
            result += `\n**Total ${i}:** ${(rollDice(6) + rollDice(6) + rollDice(6))}`;
          }
      
          msg.reply(`${result}`);
        break;
      }
    } else {
      // Decommenter en debug, sinon risque de répondre en cas de tag du bot
      // msg.reply(`La commande ${commandArray[0]} n'est pas reconnue`);
      return;
    }
  }
  });

  /**
   * 
   * @param {Array} splittedCommand Le tableau du split de la commande
   * @param {String} carac1 La première carac de calcul
   * @param {String} carac2 La seconde carac de calcul
   * @returns le pourcentage de la compétence arrondie à l'entier inférieur
   */
  function getCompByCarac(splittedCommand, carac1, carac2) {
    let c1 = getValueByCarac(splittedCommand, carac1);
    let c2 = getValueByCarac(splittedCommand, carac2);

    return Math.floor(((c1 + c2) / 2) * 5);
  }

  /**
   * 
   * @param {Array} splittedCommand Le tableau du split de la commande
   * @param {String} carac La caractéristique à récupérer (Dextérité, Force etc...)
   * @returns 
   */
  function getValueByCarac(splittedCommand, carac) {
    const [cmd, forc, dext, end, intel, cha] = splittedCommand;

    switch(carac) {
      case "Force": 
        return parseInt(forc);
      case "Dextérité": 
        return parseInt(dext);
      case "Endurance": 
       return parseInt(end);
      case "Intelligence": 
       return parseInt(intel);
      case "Charisme": 
       return parseInt(cha);
    }
  }

  function rollDice(max) {
    return 1 + Math.floor(Math.random() * max);
  }