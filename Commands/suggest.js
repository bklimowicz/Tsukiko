const CLIENT = require('discord.js').Client;
const MESSAGE = require('discord.js').Message;
const USER = require('discord.js').User;
const FS = require('fs');
const CONFIG = require('./../config.json');

/**
 * 
 * @param {CLIENT} bot 
 * @param {MESSAGE} message 
 * @param {array} args 
 */
module.exports.run = (bot, message, args) => {

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) {
        message.channel.send({embed:{
            title:"Suggest",
            description:"*Wysyła do administracji żądanie*",
            color: 0x17A589 
        }})
        return;
    }   

    var suggest = "";
    suggest = args.join(' ');

    if (suggest.length <= 0) {
        message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!suggest <pomysl>.***');
        return;
    }

    var json = require('./../requests.json');
    var data = {        
        type: "suggest",
        authorID: message.author.id,
        author: message.author.username,
        message: suggest
    };

    json.requests.push(data);
    FS.writeFile('./requests.json', JSON.stringify(json), function (err) {
        if (err)
            console.log(err);
            return;
    });
        
    message.guild.members.forEach(user => {
        if (user.roles.has(CONFIG.admin) ||
            user.roles.has(CONFIG.moderator) ||
            user.roles.has(CONFIG.technik)) {
                user.createDM().then(channel => {
                    channel.send("Nowa sugestia do sprawdzenia!");
                }).catch(err => {
                    console.log(err);
                })
            }
    });


}

module.exports.config = {
    command: "suggest"
}