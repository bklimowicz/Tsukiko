const Client = require('discord.js').Client;

const __DISCORD = require('discord.js');
const FS = require('fs');
const CONFIG = require('./config.json');
//const SPAMEXCEPTION = require('./spamexception.json')
const MUTEDCOLLECTION = require('./mutedCollection.json');
const MISC = require('./misc.json');
const ADS = require('./ads.json');
const COMMON = require('./Utilities/common.js');
const PROFILEFACTORY = require('./Profiles/Code/profileFactory.js');

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


                client.user.setPresence({ game: { name: 'Version: ' + require('./package.json').version, type: 0 } })
                    .catch(err => {
                        console.log(err);
                    });
                
                /**
                 * Call it only once to set up accounts of users that already are on a server
                 */
                // guild.members.forEach(member => {
                //     try { 
                //         var PF = new PROFILEFACTORY();
                //         PF.createProfile(member);                                
                //     } catch (error) {
                //         COMMON.logError(error);
                //     }
                // });
        
                // ## AD LOOP ##
                setInterval(() => {
                    guild.channels.get(CONFIG.defaultChannel).setTopic(ADS.advertisement[this.adID]);
                    this.adID++;
                    if (this.adID === ADS.advertisement.length) this.adID = 0;
                }, 20000);
                console.log(`### Ready! ###`);
            });    
        });
    }

    /**
     * 
     * @param {Client} client 
     */
    setupGuildBanAddEvent(client) {
        client.on("guildBanAdd", (guild, member) => {
            guild.defaultChannel.send(`Uzytkownik ${member} zostal zbanowany.`);
        });
    }

    /**
     * 
     * @param {Client} client 
     */
    setupGuildBanRemoveEvent(client) {
        client.on("guildBanRemove", (guild, member) => {
            guild.defaultChannel.send(`Uzytkownik ${member.username} zostal odbanowany.`);
        });
    }

    /**
     * 
     * @param {Client} client 
     */
    setupGuildMemberAddEvent(client) {
        client.on("guildMemberAdd", member => {
            member.guild.defaultChannel.send(`Witaj na serwerze M&A - Discord ${member}. Baw sie dobrze!`);
            var role = member.guild.roles.get(CONFIG.defaultRole);

            try { 
                var PF = new PROFILEFACTORY();
                PF.createProfile(member);                                
            } catch (error) {
                //COMMON.logError(_message, error);
                console.log('Profile creation failed!');
            }            
        
            if (MUTEDCOLLECTION.muted.indexOf(member.user.id) !== -1) {
                role = member.guild.roles.get(CONFIG.muteRole);
            }
            member.addRole(role);      
        });
    }

    /**
     * 
     * @param {Client} client 
     */
    setupGuildMemberRemoveEvent(client) {
        client.on("guildMemberRemove", member => {
            member.guild.defaultChannel.send(`Uzytkownik ${member.user.username} wyszedl z serwera.`);
        });
    }

    /**
     * 
     * @param {Client} client 
     */
    setupMessageEvent(client) {
        client.on('message', message => {

            var _profile = require('./Profiles/' + message.author.id + '.json');
            _profile.messagesCount++;
            try {
                _profile.score += Math.ceil(1 + message.content.length / 30);
            } catch (error) {
                COMMON.logError(message, error);
            }

            FS.writeFile('./Profiles/' + message.author.id + '.json', JSON.stringify(_profile), function (err) {
                if (err) COMMON.logError(message, error);
            })


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
     * 
     * @param {Client} client 
     */
    login(client) {
        client.login(CONFIG.token);
    }

    /**
     * 
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
     * 
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