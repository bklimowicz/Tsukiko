const COMMON = require('./../Utilities/common.js');

module.exports.run = (bot, message, args) => {
  
    if (!COMMON.isAdmin(message)) {
        return;
    }

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help"))
    {    
        message.channel.send({embed:{
            title:"Ban command",
            description:"*description*",
            color: 0x17A589 
        }});
        return; 
    }

    var user = COMMON.getMentionedUser(message);
    if (!user) return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!ban @uzytkownik.***')
        .then(message => {
            setTimeout(function () {
                message.delete();
            }, COMMON.timeout);
        })
        .catch(error => {
            COMMON.logError(message, error);
        });

    user.ban()
        .then(() => {
            COMMON.logError(message, `${user.user.username} is banned`);
        })
        .catch(error => {
            COMMON.logError(message, error);
        });   
}

module.exports.config = {
    command: "ban"
}