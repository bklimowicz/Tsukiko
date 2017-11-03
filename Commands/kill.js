const COMMON = require('./../Utilities/common.js');

module.exports.run = (bot, message, args) => {

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) {
        message.channel.send({embed:{
            title:"Kill command",
            description:"*description*",
            color: 0x17A589 
        }})    
        return;
    }

    var user = message.mentions.members.first();
    if (!user) return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!kill @uzytkownik.***');
    //if (user.id === message.author.id) return message.channel.send(`D-dlaczego? Prosze, nie rob tego!`);

    if (user.id === "225521387480154112") {
        message.channel.send(`Nie mozesz zabic taty!`)
            .catch(error => {
                COMMON.logError(message, error);
            });
    }
    else if (user.id === "186886029502971904") {
        message.channel.send(`Nie mozesz zabic wujka!`)
            .catch(error => {
                COMMON.logError(message, error);
            });
    }
    if (user.id === "205024027851489280") {
        if (message.author.id === "205024027851489280")
            return message.channel.send(`https://media.giphy.com/media/12KiGLydHEdak8/giphy.gif`)
                .catch(error => {
                    COMMON.logError(message, error);
                });
        var chance = Math.floor(Math.random() * 10000);
        if (chance < 9999)
            return message.channel.send(`Ups! Kula odbila sie od szyi strusia i trafila cię w czolo! \`${chance}\``)
                .catch(error => {
                    COMMON.logError(message, error);
                });
        else message.channel.send(`${message.author} zabil ${user}!`)
            .catch(error => {
                COMMON.logError(message, error);
            });
    }
    else {
        message.channel.send(`${message.author} zabil ${user}!`)
            .catch(error => {
                COMMON.logError(message, error);
            });
    }
}
    
module.exports.config = {
    command: "kill"
}