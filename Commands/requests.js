const CLIENT = require('discord.js').Client;
const MESSAGE = require('discord.js').Message;

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

    if (args.toString() === "-ls") {
        var msg = "";
        var iterator = 1;
        var json = require('./../requests.json');
        json.requests.forEach(object => {
            if (object.type === "suggest") {
                msg += `${iterator}. ${object.message}\n`;
                msg += `------------------------------\n`;
                iterator++;
            }
        });
        message.channel.send(msg);
    }
}

module.exports.config = {
    command: "requests"
}