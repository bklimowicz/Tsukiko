const CLIENT = require('discord.js').Client;
const MESSAGE = require('discord.js').Message;
const FS = require('fs');

/**
 * 
 * @param {CLIENT} bot 
 * @param {MESSAGE} message 
 * @param {string} args 
 */
module.exports.run = (bot, message, args) => {

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) {
        message.channel.send({embed:{
            title:"Suggest",
            description:"*description*",
            color: 0x17A589 
        }})
        return;
    }   

    var suggest = "";
    suggest = args.toString(' ');

    if (suggest.length <= 0) {
        message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!suggest <pomysl>.***');
        return;
    }

    var json = require('./../requests.json');
    var data = {
        type: "suggest",
        message: args.toString()
    };

    json.requests.push(data);
    FS.writeFile('./requests.json', JSON.stringify(json), function (err) {
        if (err)
            console.log(err);
    });    
}

module.exports.config = {
    command: "suggest"
}