var CLIENT = require('discord.js').Client;
var GUILD = require('discord.js').Guild;
var VOICECHANNEL = require('discord.js').VoiceChannel;
var TEXTCHANNEL = require('discord.js').TextChannel;
var GUILDMEMBER = require('discord.js').GuildMember;
var FS = require('fs');

class TextForVoice {
    /**
     * 
     * @param {CLIENT} client 
     * @param {GUILD} guild 
     * @param {VOICECHANNEL} channel
     */
    constructor(client, guild, channel) {
        this.namePrefix = 'tsu_';
        this.nameConst = 'kanal_';
        this.client = client;
        this.guild = guild;
        this.channel = channel;
        /**
         * @type {GUILDMEMBER[]}
         */
        this.voiceMembers = [];

        

        this.voiceChannelName = channel.name.split(' ');
        this.channelName = this.namePrefix + this.nameConst + this.voiceChannelName[1 | 0].toString();

        this.myChannel = this.guild.createChannel(this.channelName, 'text')
            .then(textChannel => {
                this.removeReadPermission(textChannel);
                this.updatePermissions(textChannel);    
                this.deleteChannel();

                var json = require('./../textChannelsForVoice.json');
                var data = 
                    {
                        name: this.channelName,
                        textID: textChannel.id,
                        voiceID: this.channel.id
                    }                    ;
                json.channels.push(data);                
                FS.writeFile('./textChannelsForVoice.json', JSON.stringify(json), function (err) {
                    if (err) COMMON.logError(message, error);
                });      
                
                return textChannel;
            })
            .catch(error => {
                console.log(error);
            });         
            
        
    }

    /**
     * 
     * @param {TEXTCHANNEL} textChannel 
     */
    deleteChannel(textChannel) {
        setInterval(() => {
            if (this.channel.members < 1) textChannel.delete();
        }, 10000);
    }

    /**
     * 
     * @param {TEXTCHANNEL} textChannel 
     */
    updatePermissions(textChannel) {
        if (textChannel === null || textChannel === undefined) return;
        setInterval(() => {
            if (this.voiceMembers !== this.channel.members.array) {
                if (this.voiceMembers.length > this.channel.members.size) {
                    this.removeFromChannel(textChannel, this.channel.members);
                }
                else if (this.voiceMembers < this.channel.members) {
                    this.addtoChannel(textChannel, this.channel.members);
                }
            }
            this.voiceMembers = this.channel.members;
        }, 1000);
    }

    /**
     * 
     * @param {TEXTCHANNEL} textChannel 
     * @param {GUILDMEMBER[]} members 
     */
    addtoChannel(textChannel, members) {
        members.forEach(member => {
            this.voiceMembers.forEach(myMember => {
                if (myMember.id !== member.id) {
                    textChannel.overwritePermissions(member, {
                        READ_MESSAGES: true
                    });
                }
            });
        });
    }

    /**
     * 
     * @param {TEXTCHANNEL} textChannel 
     * @param {GUILDMEMBER[]} members 
     */
    removeFromChannel(textChannel, members) {
        this.voiceMembers.forEach(myMember => {
            members.forEach(member => {
                if (myMember.id !== member.id) {
                    textChannel.overwritePermissions(member, {
                        READ_MESSAGES: false
                    });
                }
            });
        });
    }

    /**
     * 
     * @param {TEXTCHANNEL} textChannel 
     */
    removeReadPermission(textChannel) {
        if (textChannel === null || textChannel === undefined) return;
        var role = this.guild.roles.get('192321775692939264');
        textChannel.overwritePermissions(role, {
            READ_MESSAGES: false
        });                
    }
}
module.exports = TextForVoice;