"use strict"

const Client = require('discord.js').Client;
const TextChannel = require('discord.js').TextChannel;

const __DISCORD = require('discord.js');
const FS = require('fs');
const CONFIG = require('./config.json');
//const SPAMEXCEPTION = require('./spamexception.json')
const MUTEDCOLLECTION = require('./mutedCollection.json');
const MISC = require('./misc.json');
const ADS = require('./ads.json');
const COMMON = require('./Utilities/common.js');
const PROFILEFACTORY = require('./Profiles/Code/profileFactory.js');
const CHANNELFACTORY = require('./Utilities/channelFactory.js');

class Tsukiko {
    constructor() {
        this.client = new __DISCORD.Client();

        this.channel = {};
        this.adID = 0;
        this.usersOnCmdCooldown = [];

        this.client.commands = new __DISCORD.Collection();

        this.login(this.client);
        
        // ## LOAD COMMANDS ##
        this.loadCommands(this.client);
        this.loadAdminCommands(this.client);
        this.setupEvents(this.client);
    }

    /**
     * 
     * @param {Client} client 
     */
    setupEvents(client) {
        this.setupReadyEvent(client);
        this.setupGuildBanAddEvent(client);
        this.setupGuildBanRemoveEvent(client);
        this.setupGuildMemberAddEvent(client);
        this.setupGuildMemberRemoveEvent(client);
        this.setupMessageEvent(client);
        this.setupChannelCreatedEvent(client);
    }

    /**
     * 
     * @param {Client} client 
     */
    setupReadyEvent(client) {
        client.on('ready', () => {
            client.guilds.forEach(guild => {
                //playRadio(guild);
                this.channel = guild.channels.get(CONFIG.defaultChannel);

                // ## SET GAME OF TSUKIKO ##
                client.user.setPresence({ game: { name: 'Version: ' + require('./package.json').version, type: 0 } })
                    .catch(err => {
                        console.log(err);
                    });            
        
                // ## AD LOOP ##
                setInterval(() => {
                    guild.channels.get(CONFIG.defaultChannel).setTopic(ADS.advertisement[this.adID]);
                    this.adID++;
                    if (this.adID === ADS.advertisement.length) this.adID = 0;
                }, 20000);
                console.log(`### Ready! ###`);

                var CF = new CHANNELFACTORY(client, guild);
                setInterval(() => {
                    CF.shouldOpenNewChannel(client);
                }, 5000);
            });    

        });
    }

    /**
     * Handler for a channelCreate event
     * @param {Client} client 
     */
    setupChannelCreatedEvent(client) {
        client.on('channelCreate', channel => {
            /**
             * @type {TextChannel}
             */
            var newChannel = client.guilds.get('192321775692939264').channels.get(channel.id);            
        })
    }

    /**
     * Handler for a guildBanAdd event
     * @param {Client} client 
     */
    setupGuildBanAddEvent(client) {
        client.on("guildBanAdd", (guild, member) => {
            guild.defaultChannel.send(`Uzytkownik ${member} zostal zbanowany.`);
        });
    }

    /**
     * Handler for a guildBanRemove event
     * @param {Client} client 
     */
    setupGuildBanRemoveEvent(client) {
        client.on("guildBanRemove", (guild, member) => {
            guild.defaultChannel.send(`Uzytkownik ${member.username} zostal odbanowany.`);
        });
    }

    /**
     * Handler for a guildMemberAdd event
     * @param {Client} client 
     */
    setupGuildMemberAddEvent(client) {
        client.on("guildMemberAdd", member => {
            member.guild.defaultChannel.send(`Witaj na serwerze M&A - Discord ${member}. Baw sie dobrze!`);
            var role = member.guild.roles.get(CONFIG.defaultRole);      
        
            // TODO: Change this to read/write to the TsuDB
            if (MUTEDCOLLECTION.muted.indexOf(member.user.id) !== -1) {
                role = member.guild.roles.get(CONFIG.muteRole);
            }
            member.addRole(role);      
        });
    }

    /**
     * Handler for a guildMemberRemove event
     * @param {Client} client 
     */
    setupGuildMemberRemoveEvent(client) {
        client.on("guildMemberRemove", member => {
            member.guild.defaultChannel.send(`Uzytkownik ${member.user.username} wyszedl z serwera.`);
        });
    }

    /**
     * Handler for a message (sent by user) event
     * @param {Client} client 
     */
    setupMessageEvent(client) {
        client.on('message', message => {


            // TODO: Change this to read/write to the TsuDB
            // var _profile = require('./Profiles/' + message.author.id + '.json');
            // _profile.messagesCount++;
            // try {
            //     _profile.score += Math.ceil(1 + message.content.length / 30);
            // } catch (error) {
            //     COMMON.logError(message, error);
            // }

            // FS.writeFile('./Profiles/' + message.author.id + '.json', JSON.stringify(_profile), function (err) {
            //     if (err) COMMON.logError(message, error);
            // })


            var prefix = CONFIG.prefix
            var cont = message.content.slice(prefix.length).split(" ");
            var args = cont.slice(1);        
            
            if (!message.content.startsWith(prefix)) return;
            
            if (COMMON.usersOnCmdCooldown.indexOf(message.author) > -1)
                return message.channel.send(`Nie tak szybko, bo sie zmecze ${message.author}! >..<`).
                    then(message => {
                        setTimeout(function () {
                            message.delete();
                        }, 1500);
                    })
                    .catch(error => {
                        COMMON.logError(message, error);
                    });
        
            var cmd = client.commands.get(cont[0]);
            if (cmd) cmd.run(client, message, args)
            COMMON.commandCooldown(message.author);
        });
    }

    /**
     * Logs in client
     * @param {Client} client 
     */
    login(client) {
        client.login(CONFIG.token);
    }

    /**
     * Loads commands from ./AdminCommands folder
     * @param {Client} client 
     */
    loadAdminCommands(client) {
        FS.readdir('./AdminCommands/', (err, files) => {
            if (err)
                console.error(err);
            console.log('Admin commands:');
            var commandsFiles = files.filter(f => f.split('.').pop() === 'js');
            if (commandsFiles.length <= 0) {
                return console.log('No commands found...');
            }
            else {
                console.log(commandsFiles.length + ' commands found.');
            }
            commandsFiles.forEach((f, i) => {
                var cmds = require(`./AdminCommands/${f}`);
                console.log(`Command ${f} loaded...`);
                client.commands.set(cmds.config.command, cmds);
            });
        });
    }

    /**
     * Loads commands from ./Commands folder
     * @param {Client} client 
     */
    loadCommands(client) {
        FS.readdir('./Commands/', (err, files) => {
            if (err)
                console.error(err);
                console.log('Commands:');
                var commandsFiles = files.filter(f => f.split('.').pop() === 'js');
            if (commandsFiles.length <= 0) {
                return console.log('No commands found...');
            }
            else {
                console.log(commandsFiles.length + ' commands found.');
            }
            commandsFiles.forEach((f, i) => {
                var cmds = require(`./Commands/${f}`);
                console.log(`Command ${f} loaded...`);
                client.commands.set(cmds.config.command, cmds);
            });
        });
    }
}

module.exports = Tsukiko;