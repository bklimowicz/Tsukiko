const COMMON = require('./../Utilities/common.js');

module.exports.run = (bot, message, args) => {

    if (!COMMON.isAdmin(message)) {
        return;
    }

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help"))
    {    
        message.channel.send({embed:{
            title:"Delete messages",
            description:"*description*",
            color: 0x17A589 
        }});    
        return; 
    }

    var messagesToDelete = parseInt(message.content.substr(message.content.indexOf(' ') + 1));
    if (messagesToDelete === null || messagesToDelete === undefined || isNaN(messagesToDelete))
        return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!prune [liczba wiadomosci].***')
            .then(message => {
                setTimeout(function () {
                    message.delete();
                }, COMMON.timeout);
            })
            .catch(error => {
                COMMON.logError(message, error);
            });
    message.channel.bulkDelete(messagesToDelete)
        .then(() => {
            message.channel.send(`Deleted ${messagesToDelete.toString()} messages!`)
                .then(() => {
                    setTimeout(function () {
                        message.delete();
                    }, COMMON.timeout);
                })
                .catch(error => {
                    COMMON.logError(message, error);
                })
        })
        .catch(error => {
            COMMON.logError(message, error);
        });
}
    
module.exports.config = {
    command: "prune"
}