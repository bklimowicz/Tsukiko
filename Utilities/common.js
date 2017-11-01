const CONFIG = require('./../config.json');

module.exports = {
    getUser(message) {        
        var user = message.mentions.members.first();
        if (user === undefined || user == null) return false;
        if (user.roles.has(CONFIG.admin) || user.roles.has(CONFIG.technik)) return false;
        return user;
    },

    getChannel(message) {
        var channel = message.channel;
        if (channel === CONFIG.defaultChannel) return false;
        return channel;
    },

    logError(message, error) {
        message.channel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
        console.log(error);
    }
};