require('./../Utilities/common.js');

module.exports.run = (bot, message, args) => {
    message.channel.send({embed:{
        title:"Kick command",
        description:"*description*",
        color: 0x17A589 
    }})    

    var user = this.getUser(message);
    if (!user) return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!kick @uzytkownik.***');

    user.kick()
        .then(() => {
            //message.guild.defaultChannel.send(`${user} zostal wyrzucony!`);
        })
        .catch(error => {
            //message.guild.defaultChannel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
            console.log(error);
        });
}
    
module.exports.config = {
    command: "kick"
}