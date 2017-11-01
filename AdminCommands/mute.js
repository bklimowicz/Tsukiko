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
            title:"Mute command",
            description:"*description*",
            color: 0x17A589 
        }})
        return;    
    }

    if (!user) return message.channel.send('Zle uzyles komendy lub uzywasz jej na niewlasciwym uzytkowniku. Poprawne uzycie to ***ts!mute @uzytkownik.***');
    if (!channel) return message.channel.send('Tej komendy mozesz uzyc tylko na kanale domyslnym');

    user.addRole(CONFIG.muteRole)
        .then(() => {
            MUTEDCOLLECTION.muted.forEach(muted => {
                if (user.id === muted)
                {
                    throw new Error('Already exist, already muted');
                }
            });
            message.channel.send(`${user} juz nie moze pisac!`);
            MUTEDCOLLECTION.muted.push(user.id);            
            FS.writeFile('mutedCollection.json', JSON.stringify(MUTEDCOLLECTION), function (error) {
                console.log(error);
            });
        })
        .catch(error => {
            COMMON.logError(message, error);
        });        
}
    
module.exports.config = {
    command: "mute"
}