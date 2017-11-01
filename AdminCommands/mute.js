const MUTEDCOLLECTION = require('d:\\Git repositories\\Tsukiko.js\\mutedCollection.json');
const CONFIG = require('d:\\Git repositories\\Tsukiko.js\\config.json');
const FS = require('fs');
const COMMON = require('./../Utilities/common.js');

module.exports.run = (bot, message, args) => {
    var user = COMMON.getMentionedUser(message);
    var channel = COMMON.getChannel(message);
    
    if (!COMMON.isAdmin(message)) {
        return;
    }

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help"))
    {        
        message.channel.send({embed:{
            title:"Mute command",
            description:"*description*",
            color: 0x17A589 
        }});
        return;    
    }

    if (!user) return message.channel.send('Zle uzyles komendy lub uzywasz jej na niewlasciwym uzytkowniku. Poprawne uzycie to ***ts!mute @uzytkownik.***')
        .then(message => {
            setTimeout(function () {
                message.delete();
            }, COMMON.timeout);
        })
        .catch(error => {
            logError(message, error);
        });

    if (!channel) return message.channel.send('Tej komendy mozesz uzyc tylko na kanale domyslnym')
        .then(message => {
            setTimeout(function () {
                message.delete();
            }, COMMON.timeout);
        })
        .catch(error => {
            logError(message, error);
        });

    user.addRole(CONFIG.muteRole)
        .then(() => {
            MUTEDCOLLECTION.muted.forEach(muted => {
                if (user.id === muted)
                {
                    throw new Error('Already muted');
                }
            });
            message.channel.send(`${user} juz nie moze pisac!`);
            MUTEDCOLLECTION.muted.push(user.id);            
            FS.writeFile('mutedCollection.json', JSON.stringify(MUTEDCOLLECTION), function (error) {
                if (error === null) return;
                COMMON.logError(message, error);
            });
            COMMON.logError(message, `${user.user.username} is muted`);
        })
        .catch(error => {
            COMMON.logError(message, error);
        });        
}
    
module.exports.config = {
    command: "mute"
}