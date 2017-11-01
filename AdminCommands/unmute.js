const MUTEDCOLLECTION = require('./../mutedCollection.json');
const CONFIG = require('./../config.json');
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
            title:"Unmute command",
            description:"*description*",
            color: 0x17A589 
        }}); 
        return;
    }

    if (!user) return message.channel.send('Zle uzyles komendy lub uzywasz jej na niewlasciwym uzytkowniku. Poprawne uzycie to ***ts!unmute @uzytkownik.***')
        .then(message => {
            setTimeout(function () {
                message.delete();
            }, COMMON.timeout);
        })
        .catch(error => {
            COMMON.logError(message, error);
        });

    if (!channel) return message.channel.send('Tej komendy mozesz uzyc tylko na kanale domyslnym')
        .then(message => {
            setTimeout(function () {
                message.delete();
            }, COMMON.timeout);
        })
        .catch(error => {
            COMMON.logError(message, error);
        });

    var _mutedRole = message.channel.guild.roles.get(CONFIG.muteRole);
    user.roles.forEach(role => {
        if (role === _mutedRole)
        {
            user.removeRole(role)            
                .then(() => {
                    MUTEDCOLLECTION.muted.forEach(muted => {
                        if (user.id === muted)
                        {
                            var index = MUTEDCOLLECTION.muted.indexOf(muted);
                            MUTEDCOLLECTION.muted.splice(index, 1);
                            FS.writeFile('mutedCollection.json', JSON.stringify(MUTEDCOLLECTION), function (error) {
                                if (error === null) return;
                                COMMON.logError(message, error);                               
                            });
                            message.channel.send(`${user} znowu moze pisac!`);
                            COMMON.logError(message, `${user.user.username} is unmuted`);
                        }
                    });
                })
                .catch(error => {
                    COMMON.logError(message, error);
                })
        }
    });          
}
    
module.exports.config = {
    command: "unmute"
}