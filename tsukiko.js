'use strict'

const DISCORD = require('discord.js');
const CONFIG = require('./config.json');
const SPAMEXCEPTION = require('./spamexception.json')
const KillCommand = require('./killCommand.js');
const FS = require('fs');
const MUTEDCOLLECTION = require('./mutedCollection.json');
const MISC = require('./misc.json');
const ADS = require('./ads.json');
const COMMON = require('./Utilities/common.js');

const client = new DISCORD.Client();
const killCommand = new KillCommand();

var channel;
var adID = 0;
const usersOnCmdCooldown = [];

client.commands = new DISCORD.Collection();

// ## LOAD COMMANDS ##
FS.readdir('./Commands/', (err, files) => {
    if (err) console.error(err);

    console.log('Commands:');
    var commandsFiles = files.filter(f => f.split('.').pop() === 'js');
    if (commandsFiles.length <= 0) { return console.log('No commands found...'); }
    else { console.log(commandsFiles.length + ' commands found.'); }

    commandsFiles.forEach((f, i) => {
        var cmds = require(`./Commands/${f}`);
        console.log(`Command ${f} loaded...`);
        client.commands.set(cmds.config.command, cmds);
    });
});

// ## LOAD ADMIN COMMANDS ##
FS.readdir('./AdminCommands/', (err, files) => {
    if (err) console.error(err);

    console.log('Admin commands:');
    var commandsFiles = files.filter(f => f.split('.').pop() === 'js');
    if (commandsFiles.length <= 0) { return console.log('No commands found...'); }
    else { console.log(commandsFiles.length + ' commands found.'); }

    commandsFiles.forEach((f, i) => {
        var cmds = require(`./AdminCommands/${f}`);
        console.log(`Command ${f} loaded...`);
        client.commands.set(cmds.config.command, cmds);
    });
});

// ## LOGIN USING TOKEN FROM CONFIG ##
client.login(CONFIG.token);

// ## PLAY RADIO ON READY ##
client.on("ready", () => {
    client.guilds.forEach(guild => {
        playRadio(guild);
        channel = guild.channels.get(CONFIG.defaultChannel);

        // ## AD LOOP ##
        setInterval(() => {
            guild.channels.get(CONFIG.defaultChannel).setTopic(ADS.advertisement[adID]);
            adID++;
            if (adID === ADS.advertisement.length) adID = 0;
        }, 20000);
        console.log(`### Ready! ###`);
    });    
});

// ## COMMON GUILD EVENTS ##
client.on("guildBanAdd", (guild, member) => {
    guild.defaultChannel.send(`Uzytkownik ${member} zostal zbanowany.`);
});
client.on("guildBanRemove", (guild, member) => {
    guild.defaultChannel.send(`Uzytkownik ${member.username} zostal odbanowany.`);
});
client.on("guildMemberAdd", member => {
    member.guild.defaultChannel.send(`Witaj na serwerze M&A - Discord ${member}. Baw sie dobrze!`);
    var role = member.guild.roles.get(CONFIG.defaultRole);

    if (MUTEDCOLLECTION.muted.indexOf(member.user.id) !== -1) {
        role = member.guild.roles.get(CONFIG.muteRole);
    }
    member.addRole(role);      
});
client.on("guildMemberRemove", member => {
    member.guild.defaultChannel.send(`Uzytkownik ${member.user.username} wyszedl z serwera.`);
});

// ## SPAM HANDLER ##
client.on('message', message => {
    if (message.author.username === "Tsukiko" || message.author.username === "Tsukiko-dev") return;
    if (SPAMEXCEPTION.usersByIDs.indexOf(message.author.id) > -1) return;
    if (message.channel.id !== CONFIG.defaultChannel) return;

    message.channel.fetchMessages({ limit: 3 })
        .then(messages => {
            var usersArray = [];
            var contentArray = [];

            messages.forEach(value => {
                usersArray.push(value.author);
                contentArray.push(value.content);
            });            

            if (spamCondition(usersArray) & spamCondition(contentArray))
            {
                messages.forEach(message => {
                    message.delete();
                });
                message.channel.send(`Nie spamuj ${message.author}, prosze!`)
                    .then(message => {
                        setTimeout(function () {
                            message.delete();
                        }, 1500);
                    })
                    .catch(error => {
                        COMMON.logError(message, error);
                    });
            }            
        })
        .catch(error => {            
            COMMON.logError(message, error);
        });
});

// ## COMMANDS ##
client.on('message', message => {
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

    // if (message.content.startsWith("!!test") && message.author.id === CONFIG.szk)
    // {
    //     //message.channel.send(`Nic do testowania :)`);        
    // }
    
    var prefix = CONFIG.prefix
    var cont = message.content.slice(prefix.length).split(" ");
    var args = cont.slice(1);

    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(CONFIG.prefix + "zabij")) {
        killCommand.kill(message);
        COMMON.commandCooldown(message.author);       
    }
    if (message.content.startsWith(CONFIG.prefix + "wakaifix"))
    {
        radioFix(message.guild);
    }
    
    if (message.content.startsWith(CONFIG.prefix + "regulamin"))
    {
        var regulation = require("./regulations.json");
        var reg = `\`\`\``;
        regulation.regulations.forEach(line => {
            reg += line + '\n';
        });
        reg += `\`\`\``;
        message.channel.send(reg);
    }
    if (message.content.startsWith(CONFIG.prefix + "kochasz mnie?"))
    {
        if (message.author.id === CONFIG.szk) message.channel.send(MISC.loveSZK);
        else message.channel.send(MISC.loveEveryone);
    }
    if (message.content.startsWith(CONFIG.prefix + "autor"))
    {
        message.channel.send(MISC.author);
    }

    var cmd = client.commands.get(cont[0]);
    if (cmd) cmd.run(client, message, args)
    COMMON.commandCooldown(message.author);
});

// ## SPAM HANDLER UTILITIES ##
Array.prototype.allValuesSame = function () {
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== this[0])
            return false;
    }

    return true;
}
function spamCondition(array) {
    if (array.allValuesSame()) return true;
    return false;
}

// ## RADIO FIX COMMAND ##
function radioFix(guild) {
    if (client.voiceConnections.size > 0)
    {
        const voiceChannel = guild.channels.get(CONFIG.voiceChannel);
        if (!voiceChannel) return;
        voiceChannel.leave();
        voiceChannel.join()
            .then(connection => {
                connection.playArbitraryInput(CONFIG.radioURL);
            });      
    }
    else
    {
        return null;
    }
}

function playRadio(guild) {    
    const voiceChannel = guild.channels.get(CONFIG.voiceChannel);
    voiceChannel.leave();
    if (!voiceChannel) return;
    voiceChannel.join()
        .then(connection => {
            connection.playArbitraryInput(CONFIG.radioURL);
        })
        .catch(error => {
            COMMON.logError(message, error);
            playRadio(guild);                  
        });
}