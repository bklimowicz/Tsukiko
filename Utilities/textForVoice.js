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

        this.guild.createChannel(this.channelName, 'text')
            .then(textChannel => {
                this.initializeChannel(textChannel);
            })
            .catch(error => {
                console.log(error);
            });                                 
    }

    initializeChannel(textChannel) {
        this.removeReadPermissionsWatcher(textChannel);
        this.updatePermissionsWatcher(textChannel);
        this.deleteChannelWatcher(textChannel);
        var json = require('./../textChannelsForVoice.json');
        var data = {
            name: this.channelName,
            textID: textChannel.id,
            voiceID: this.channel.id,
        };
        json.channels.push(data);
        FS.writeFile('./textChannelsForVoice.json', JSON.stringify(json), function (err) {
            if (err)
                console.log(err);
        });
        this.myChannel = textChannel;
    }

    /**
     * 
     * @param {TEXTCHANNEL} textChannel 
     */
    deleteChannelWatcher(textChannel) {
        setInterval(() => {
            this.deleteChannel(textChannel);
        }, 10000);
    }



    deleteChannel(textChannel) {
        if (this.channel.members.size < 1) {
            var json = require('./../textChannelsForVoice.json');
            var index = json.channels.findIndex(obj => {
                return obj.textID === this.myChannel.id;
            });
            if (index > -1) {
                json.channels.splice(index, 1);
                FS.writeFile('./textChannelsForVoice.json', JSON.stringify(json), function (err) {
                    if (err)
                        console.log(err);
                });
                textChannel.delete();
            }
        }
    }

    /**
     * 
     * @param {TEXTCHANNEL} textChannel 
     */
    updatePermissionsWatcher(textChannel) {
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
        }, 5000);
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
    removeReadPermissionsWatcher(textChannel) {
        if (textChannel === null || textChannel === undefined) return;
        var role = this.guild.roles.get('192321775692939264');
        textChannel.overwritePermissions(role, {
            READ_MESSAGES: false
        });                
    }
}
module.exports = TextForVoice;