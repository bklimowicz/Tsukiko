const CONFIG = require('./../config.json');

module.exports = {
    _timeout: 3000,
    usersOnCmdCooldown: [],

    getMentionedUser(message) {        
        var user = message.mentions.members.first();
        if (user === undefined || user == null) return false;
        if (user.roles.has(CONFIG.admin) || user.roles.has(CONFIG.technik || user.roles.has(CONFIG.moderator))) return false;
        return user;
    },

    getChannel(message) {
        var channel = message.channel;
        if (channel === CONFIG.defaultChannel) return false;
        return channel;
    },

    logError(message, error) {
        var chan = message.guild.channels.get(CONFIG.logChannel);
        if (chan !== null) chan.send(`${new Date().toTimeString()}: ${message.guild.member(CONFIG.szk)}, ${error}.`);            
        console.log(error);        
    },

    isAdmin(message) {
        if (message.member.roles.has(CONFIG.admin) || message.member.roles.has(CONFIG.moderator) || message.member.roles.has(CONFIG.technik)) {
            return true;
        }
        else {
            message.channel.send(`Nie masz wystarczajacych uprawnien do wykonania tej komendy!`).
            then(message => {
                setTimeout(function () {
                    message.delete();
                }, this._timeout);
            })
            .catch(error => {
                this.logError(message, error);
            });
            return false;
        }
    },

    // isHigherRole(message) {
        
    // },    
    
    commandCooldown(user)
    {
        this.usersOnCmdCooldown.push(user);
        setTimeout(() => {
                    var index = this.usersOnCmdCooldown.indexOf(user);
                    this.usersOnCmdCooldown.splice(index, 1);
                }, 5000);
    }
};