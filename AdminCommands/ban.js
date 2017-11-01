require('./../Utilities/common.js');

module.exports.run = (bot, message, args) => {
  
    message.channel.send({embed:{
        title:"Ban command",
        description:"*description*",
        color: 0x17A589 
    }})

    var user = this.getUser(message);
    if (!user) return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!ban @uzytkownik.***');

    user.ban()
        .catch(error => {
            //message.guild.defaultChannel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
            COMMON.logError(message, error);
        });

    
}

module.exports.config = {
    command: "ban"
}