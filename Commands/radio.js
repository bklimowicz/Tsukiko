const CONFIG = require('./../config.json');

module.exports.run = (bot, message, args) => {

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) {
        message.channel.send({embed:{
            title:"radioFix",
            description:"*description*",
            color: 0x17A589 
        }})
        return;
    }

    radioFix(bot, message.guild);    
}

// ## RADIO FIX COMMAND ##
function radioFix(client, guild) {
    if (client.voiceConnections.size > 0)
    {
        const voiceChannel = guild.channels.get(CONFIG.voiceChannel);
        if (!voiceChannel) return;
        voiceChannel.leave();
        voiceChannel.join()
            .then(connection => {
                connection.playArbitraryInput(CONFIG.radioURL);
            });      
    }
    else
    {
        return null;
    }
}
    
module.exports.config = {
    command: "radioFix"
}