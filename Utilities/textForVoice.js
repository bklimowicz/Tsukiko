"use strict"
var CLIENT = require('discord.js').Client;
var GUILD = require('discord.js').Guild;
var VOICECHANNEL = require('discord.js').VoiceChannel;
var TEXTCHANNEL = require('discord.js').TextChannel;
var GUILDMEMBER = require('discord.js').GuildMember;
var FS = require('fs');

class TextForVoice {
    /**
     * Standard constructor for instantiating new 
     * textForVoice channel.
     * @param {CLIENT} client 
     * @param {GUILD} guild 
     * @param {VOICECHANNEL} channel
     */
    constructor(client, guild, channel) {
        this.namePrefix = 'tsu';
        this.nameConst = 'kanal';
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

    // /**
    //  * In case bot crashed and we want to restore 
    //  * object of existing textForVoice channel.
    //  * @param {CLIENT} client 
    //  * @param {GUILD} guild 
    //  * @param {VOICECHANNEL} channel 
    //  * @param {boolean} restoring 
    //  */
    // constructor(client, guild, channel, restoring)
    // {
    //     // TODO: Later
    // }

    /**
     * Initializing watchers, assigning class property 
     * of created TextChannel.
     * Extracted for readability and debugging reasons.
     * @param {TEXTCHANNEL} textChannel 
     */
    initializeChannel(textChannel) {
        // this.initialRemoveReadPermissions(textChannel);
        // this.updatePermissionsWatcher(textChannel);
        this.deleteChannelWatcher(textChannel);
        var json = require('./../textChannelsForVoice.json');
        var data = {
            name: this.channelName,
            textID: textChannel.id,
            voiceID: this.channel.id,
            storedMembersIds: []
        };
        json.channels.push(data);
        FS.writeFile('./textChannelsForVoice.json', JSON.stringify(json), function (err) {
            if (err)
                console.log(err);
        });
        this.myChannel = textChannel;
    }

    /**
     * Every fixed miliseconds invoke method to check and
     * eventually delete this instance.
     * @param {TEXTCHANNEL} textChannel 
     */
    deleteChannelWatcher(textChannel) {
        setInterval(() => {
            this.deleteChannel(textChannel);
        }, 10000);
    }


    /**
     * Directly deletes channel and instance.
     * @param {TEXTCHANNEL} textChannel 
     */
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
     * Every fixed miliseconds checks and invokes particular 
     * method to add or remove READ_MESSAGES permission.
     * @param {TEXTCHANNEL} textChannel 
     */
    updatePermissionsWatcher(textChannel) {
        if (textChannel === null || textChannel === undefined) return;
        setInterval(() => {
            if (this.channel === null || this.channel === undefined) return;
            if (this.voiceMembers > this.channel.members) {
                this.removeFromChannel(textChannel, this.channel.members);
                this.voiceMembers = this.channel.members.array();
            }
            else if (this.voiceMembers < this.channel.members) {
                this.addtoChannel(textChannel, this.channel.members);
                this.voiceMembers = this.channel.members.array();
            }
            

            var json = require('./../textChannelsForVoice.json');
            var index = json.channels.findIndex(obj => {
                return obj.voiceID === this.channel.id;
            });

            if (index < 0) {
                console.log('Index less than 0');
                return;
            }

            var _obj = json.channels[index];

            json.channels.splice(index, 1);

            var tempArray = [];
            this.channel.members.forEach(member => {
                tempArray.push(member.id);
            });

            _obj.storedMembersIds = tempArray;
            json.channels.push(_obj);

            FS.writeFile('./textChannelsForVoice.json', JSON.stringify(json), (err) => {
                if (err)
                    console.log(err);
            });
            
        }, 5000);
    }

    /**
     * Directly adds READ_MESSAGES permission.
     * *** DOESN'T WORK ***
     * @param {TEXTCHANNEL} textChannel 
     * @param {GUILDMEMBER[]} members 
     */
    addtoChannel(textChannel, members) {        
        members.forEach(myMember => {
            // var index = this.voiceMembers.find(obj => {
            //     return obj.id === myMember.id;
            // });
            // if (index < 0) {
                textChannel.overwritePermissions(myMember, {
                    READ_MESSAGES: true
                })                    
            // }        
        });        
    }

    /**
     * Directly removes READ_MESSAGES permission.
     * *** DOESN'T WORK ***
     * @param {TEXTCHANNEL} textChannel 
     * @param {GUILDMEMBER[]} members 
     */
    removeFromChannel(textChannel, members) {
        this.voiceMembers.forEach(myMember => {
            var index = members.findIndex(obj => {
                return obj.id === myMember.id;
            });
            if (index < 0) {
                textChannel.overwritePermissions(myMember, {
                    READ_MESSAGES: false
                });                

            }            
        });        
    }

    /**
     * Removes READ_MESSAGES permission for @everyone role
     * at initialization
     * @param {TEXTCHANNEL} textChannel 
     */
    initialRemoveReadPermissions(textChannel) {
        if (textChannel === null || textChannel === undefined) return;
        var role = this.guild.roles.get('192321775692939264');
        textChannel.overwritePermissions(role, {
            READ_MESSAGES: false
        });                
    }
}
module.exports = TextForVoice;