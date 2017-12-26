const MISC = require('./../misc.json');
const CONFIG = require('./../config.json');
const Client = require('discord.js').Client;
const Message = require('discord.js').Message;
const COMMON = require('./../Utilities/common.js');
const RichEmbed = require('discord.js').RichEmbed;
const FS = require('fs');

/**
 * 
 * @param {Client} bot 
 * @param {Message} message 
 * @param {*} args 
 */
module.exports.run = (bot, message, args) => {

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) {
        message.channel.send({embed:{
            title:"Shows your profile",
            description:"*description*",
            color: 0x17A589 
        }})
        return;
    }

    if (message.channel.id !== CONFIG.botChannel) return;

    const profileDir = './../Profiles/';
    try {
        var _profile = require(profileDir + message.author.id + '.json');
        var embed = new RichEmbed();
        
        embed.setThumbnail(_profile.avatarURL); // Thumbnail sets link from url in top right corner
        embed.setAuthor(_profile.name);
        embed.setDescription(_profile.description);
        embed.setColor(message.member.displayColor);
        
        embed.addField("Guild Name", _profile.guildName);
        embed.addField("Join Date", _profile.joinDate);
        embed.addField("Birthday", _profile.birthday);
        embed.addField("Messages Sent", _profile.messagesCount, true);
        embed.addField("Score", _profile.score, true);
        embed.addField("Level", _profile.level, true);
        
        embed.setFooter("Powered by Tsukiko.");

        message.channel.send({embed})
            .catch(error => {
                COMMON.logError(message, error);
            });
            
    } catch (error) {
        COMMON.logError(message, error);
    }
}
    
module.exports.config = {
    command: "profile"
}