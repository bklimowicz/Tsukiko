const COMMON = require('./../Utilities/common.js');
const CLIENT = require('discord.js').Client;
const MESSAGE = require('discord.js').Message;
const CONFIG = require('./../config.json');
const TEXTCHANNEL = require('discord.js').TextChannel;
const FS = require('fs');
/**
 * 
 * @param {CLIENT} bot 
 * @param {MESSAGE} message 
 * @param {number} args 
 */
module.exports.run = (bot, message, args) => {
  
    if (!COMMON.isAdmin(message)) {
        return;
    }

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help"))
    {    
        message.channel.send({embed:{
            title:"Approve",
            description:"*Zatwierdza oczekujące żądanie. Do wylistowania żądań użyj ts!requests -ls*",
            color: 0x17A589 
        }});
        return; 
    }

    args = +args;
    if (args === null | args === undefined | isNaN(args)) {
        message.reply("Błędne użycie komendy")
        return;
    }        

    if (args > 0 && args < 999) {
        var json = require('./../requests.json');
        var suggest = json.requests[args-1];
        if (suggest === null | suggest === undefined) {
            message.reply("Nie ma sugestii na tej pozycji");
            return;
        }

        if (suggest.type.toString() === "suggest") {
            /** 
             * @type {TEXTCHANNEL}
            */
            var suggestsChannel = message.guild.channels.get(CONFIG.suggestsChannel);
            if (suggestsChannel !== null || suggestsChannel !== undefined) {
                suggestsChannel.send(`${suggest.message}\n-${suggest.author}`)
                .then(msg => {
                    msg.react("👍");                 
                    msg.react("👎");  
                }).catch(err => {
                   console.log(err);                    
                });

                var user = message.guild.members.get(suggest.authorID);
                if (user === null || user === undefined) {
                    return;
                }
                user.createDM().then(channel => {
                    channel.send("Twoja sugestia została zaakceptowana! Obserwuj głosowanie.");
                }).catch(err => {
                    console.log(err);
                });
                var index = json.requests.findIndex(obj => {
                    return obj.message === suggest.message;
                });
                if (index > -1) {
                    json.requests.splice(index, 1);
                    FS.writeFile('./requests.json', JSON.stringify(json), function (err) {
                        if (err)
                            console.log(err);
                    });
                }    
                return;
            }
        }
    }
    /**
     * So this needs to check for pending requests list stored in json in the root folder.
     * Sender needs to specify which of array elemnt he wants to approve. Then object is to be
     * sent back to proper handler and executed. 
     * Example of requests.json:
     * 
     * {"requests":
     *  [
     *      {
     *          "type": "suggest",
     *          "message": "this is example idea"
     *      }
     *  ]
     * }     
     */
}

module.exports.config = {
    command: "approve"
}