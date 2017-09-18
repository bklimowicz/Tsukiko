

const AdminCommands = require('./adminCommands.js');
const adminCommands = new AdminCommands();

class KillCommandHandler {

    getUser(message)
    {
        var user = message.mentions.members.first();
        if (user === undefined || user == null) return false;

        return user;
    }

    logError(message, error)
    {
        message.channel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
        console.log(error);
    }

    kill(message)
    {
        var user = this.getUser(message);
        if (!user) return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!zabij @uzytkownik.***');
        if (user.id === message.author.id) return message.channel.send(`D-dlaczego? Prosze, nie rob tego!`);

        if (user.id === "225521387480154112") {
            message.channel.send(`Nie mozesz zabic taty!`)
                .catch(error => {
                    logError(message, error);
                });
        }
        else if (user.id === "186886029502971904") {
            message.channel.send(`Nie mozesz zabic wujka!`)
                .catch(error => {
                    logError(message, error);
                });
        }
        if (user.id === "205024027851489280") {
            if (message.author.id === "205024027851489280")
                return message.channel.send(`https://media.giphy.com/media/12KiGLydHEdak8/giphy.gif`)
                    .catch(error => {
                        logError(message, error);
                    });
            var chance = Math.floor(Math.random() * 10000);
            if (chance < 9999)
                return message.channel.send(`Ups! Kula odbila sie od szyi strusia i trafila cię w czolo! \`${chance}\``)
                    .catch(error => {
                        logError(message, error);
                    });
            else message.channel.send(`${message.author} zabil ${user}!`)
                .catch(error => {
                    logError(message, error);
                });
        }
        else {
            message.channel.send(`${message.author} zabil ${user}!`)
                .catch(error => {
                    logError(message, error);
                });
        }
    }    
}

module.exports = KillCommandHandler;