const COMMON = require('./../Utilities/common.js');

module.exports.run = (bot, message, args) => {

    if (!COMMON.isAdmin(message)) {
        return;
    }

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help"))
    {    
        message.channel.send({embed:{
            title:"Kick command",
            description:"*description*",
            color: 0x17A589 
        }});
        return; 
    }  

    var user = COMMON.getMentionedUser(message);
    if (!user) return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!kick @uzytkownik.***')
        .then(message => {
            setTimeout(function () {
                message.delete();
            }, COMMON.timeout);
        })
        .catch(error => {
            COMMON.logError(message, error);
        });

    user.kick()
        .then(() => {
            COMMON.logError(message, `${user.user.username} is kicked`);
            message.guild.defaultChannel.send(`${user} zostal wyrzucony!`);
        })
        .catch(error => {
            COMMON.logError(message, error);
        });
}
    
module.exports.config = {
    command: "kick"
}