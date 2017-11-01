require('./../Utilities/common.js');

module.exports.run = (bot, message, args) => {
    message.channel.send({embed:{
        title:"Delete messages",
        description:"*description*",
        color: 0x17A589 
    }})    

    var messagesToDelete = parseInt(message.content.substr(message.content.indexOf(' ') + 1));
        if (messagesToDelete === null || messagesToDelete === undefined || isNaN(messagesToDelete)) return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!usun [liczba wiadomosci].***');
        message.channel.bulkDelete(messagesToDelete)
            .then(() => {
                message.channel.send(`Skasowalam ${messagesToDelete.toString()} wiadomosci!`);
            })
            .catch(error => {
                message.channel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
                COMMON.logError(message, error);
            });
}
    
module.exports.config = {
    command: "prune"
}