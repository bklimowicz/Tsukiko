const MUTEDCOLLECTION = require('d:\\Git repositories\\Tsukiko.js\\mutedCollection.json');
const CONFIG = require('d:\\Git repositories\\Tsukiko.js\\config.json');
const FS = require('fs');
const COMMON = require('./../Utilities/common.js');

module.exports.run = (bot, message, args) => {
    var user = COMMON.getUser(message);
    var channel = COMMON.getChannel(message);

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) 
    {
        message.channel.send({embed:{
            title:"Unmute command",
            description:"*description*",
            color: 0x17A589 
        }})    
        return;
    }

    if (!user) return message.channel.send('Zle uzyles komendy lub uzywasz jej na niewlasciwym uzytkowniku. Poprawne uzycie to ***ts!unmute @uzytkownik.***');
    if (!channel) return message.channel.send('Tej komendy mozesz uzyc tylko na kanale domyslnym');    

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
                                COMMON.logError(message, error);                               
                            });
                            message.channel.send(`${user} znowu moze pisac!`);
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