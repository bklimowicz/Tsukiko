var CLIENT = require('discord.js').Client;
var TEXTCHANNEL = require('discord.js').TextChannel;
var VOICECHANNEL = require('discord.js').VoiceChannel;
var GUILD = require('discord.js').Guild;
var GUILDCHANNEL = require('discord.js').GuildChannel;
var TEXTFORVOICE = require('./textForVoice.js');
var FS = require('fs');
require('./common.js');


/**
 * @class ChannelFactory
 * @type {ChannelFactory}
 * 
 */
class ChannelFactory {
    /**
     * 
     * @param {CLIENT} client 
     * @param {GUILD} guild
     */
    constructor(client, guild) {
        /**
         * @
         * type {TEXTFORVOICE[]} 
         */  

        this.openChannels = require('./../textChannelsForVoice.json');
        this.client = client;
        this.guild = guild;
    }

    /**
     * Condition to open new textChannel for voice conversation
     * 
     */
    shouldOpenNewChannel() {
        /**
         * @type {VOICECHANNEL[]} 
         * */
        var voiceChannels = this.getChannelsByType('voice');
        voiceChannels.forEach(channel => {
            if (channel.members.size > 0) {
                if (!this.channelAlreadyExists(channel.id)) {
                    //AskForTextChannel(this.client, channel.name);     
                    this.openChannel(this.client, this.guild, channel)
                }
            }            
        });
    }

    /**
     * Ask if should create text channel
     * TODO: later implementation
     * @param {string} channelName 
     */
    askForTextChannel(channelName) {
        
    }

    /**
     * Creating channel
     * @param {CLIENT} client
     * @param {GUILD} guild
     * @param {GUILDCHANNEL} channel
     */    
    openChannel(client, guild, channel) {
        return new Promise(function() {
            return new TEXTFORVOICE(client, guild, channel);
        });
    }

    /**
     * Check if wanted text channel already exists
     * @param {string} channelName
     * @returns {boolean}
     */
    channelAlreadyExists(voiceID) {
        /**
         * @type {TEXTCHANNEL[]}
         */
        var textChannels = this.getChannelsByType('text');    
        var result = false;
        var openedChannels = require('./../textChannelsForVoice.json').channels;
        var index = openedChannels.findIndex(obj => {
            return obj.voiceID === voiceID;
        });

        if (index > -1) {            
            textChannels.forEach(textChannel => {
                if (openedChannels[index].textID === textChannel.id || openedChannels[index].name === textChannel.name) {
                    result = true;                    
                }
            });
        }
        return result;
    }

    /**
     * Return array of all channels of given type in guild.
     * Param type: "dm", "text", "voice", "group"
     * @param {string} channelType 
     * @returns {VOICECHANNEL[] | TEXTCHANNEL[]}
     */
    getChannelsByType(channelType) {
        try {
            var channels = [];
            this.guild.channels.forEach(channel => {
                if (channel.type === channelType)
                channels.push(channel);
            });
            return channels;
        } catch (error) {
            console.log(error);  
        }        
    }

}


module.exports = ChannelFactory;

