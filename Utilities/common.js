const CONFIG = require('./../config.json');
const MESSAGE = require('discord.js').Message;
const CHANNEL = require('discord.js').Channel;
const USER = require('discord.js').User;

module.exports = {
    timeout: 3000,
    usersOnCmdCooldown: [],

    /**
     * Returns user object from message mention
     * @param {MESSAGE} message 
     */
    getMentionedUser(message) {        
        var user = message.mentions.members.first();
        if (user === undefined || user == null) return false;
        if (user.roles.has(CONFIG.admin) || user.roles.has(CONFIG.technik) || user.roles.has(CONFIG.moderator)) return false;
        return user;
    },

    /**
     * Returns channel object from message
     * @param {CHANNEL} message 
     */
    getChannel(message) {
        var channel = message.channel;
        if (channel === CONFIG.defaultChannel) return false;
        return channel;
    },

    /**
     * Logs error to tsukiko-log channel
     * @param {MESSAGE} message 
     * @param {string} error 
     */
    logError(message, error) {
        var chan = message.guild.channels.get(CONFIG.logChannel);
        if (chan !== null) chan.send(`${new Date().toTimeString()}: ${message.guild.member(CONFIG.szk)}, ${error}.`);            
        console.log(error);        
    },

    /**
     * Checks if author of the message has admin privlieges
     * @param {MESSAGE} message 
     */
    isAdmin(message) {
        if (message.member.roles.has(CONFIG.admin) || message.member.roles.has(CONFIG.moderator) || message.member.roles.has(CONFIG.technik)) {
            return true;
        }
        else {
            message.channel.send(`Nie masz wystarczajacych uprawnien do wykonania tej komendy!`).
            then(message => {
                setTimeout(function () {
                    message.delete();
                }, this.timeout);
            })
            .catch(error => {
                this.logError(message, error);
            });
            return false;
        }
    },
    
    /**
     * Sets user on Tsukiko commands timeout (spam avoiding)
     * @param {USER} user 
     */
    commandCooldown(user)
    {
        this.usersOnCmdCooldown.push(user);
        setTimeout(() => {
                    var index = this.usersOnCmdCooldown.indexOf(user);
                    this.usersOnCmdCooldown.splice(index, 1);
                }, 5000);
    }
};