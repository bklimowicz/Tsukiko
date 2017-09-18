'use strict'

const DISCORD = require('discord.js');
const CONFIG = require('./config.json');
const SPAMEXCEPTION = require('./spamexception.json')
const DBManager = require('./dbmanager.js');
const AdminCommands = require('./adminCommands.js');
const KillCommand = require('./killCommand.js');
const FS = require('fs');
const MUTEDCOLLECTION = require('./mutedCollection.json');
const MISC = require('./misc.json');
const ADS = require('./ads.json');

const client = new DISCORD.Client();
const conn = new DBManager();
const adminCommands = new AdminCommands();
const killCommand = new KillCommand();
const db = conn.ConnectToDB('192.168.1.156', 5432, 'TsukikoDB', 'postgres', '4632599');
var channel;
var adID = 0;



db.one('select * from bot_credentials where key like \'%token%\'')
    .then(data => {
        client.login(data.value);
    })
    .catch(error => {
        console.log(error);
    });

//client.login(CONFIG.token);

client.on("ready", () => {
    client.guilds.forEach(guild => {
        const voiceChannel = guild.channels.get(CONFIG.voiceChannel);
        channel = guild.channels.get(CONFIG.defaultChannel);
        if (!voiceChannel) return;
        voiceChannel.join()
            .then(connection => {
                connection.playArbitraryInput(CONFIG.radioURL);
            });
        guild.members.forEach(member => {
            db.one(`insert into users(ID, name) values ($1, $2)`, [member.id, member.displayName])
                .then(() => {
                    console.log(`Successfully added ${member.displayName} to db`);
                })
                .catch(error => {
                    console.log(`Already exists`);
                });
        });
    });
});

client.on("guildBanAdd", (guild, member) => {
    guild.defaultChannel.send(`Uzytkownik ${member} zostal zbanowany.`);
});
client.on("guildBanRemove", (guild, member) => {
    guild.defaultChannel.send(`Uzytkownik ${member} zostal odbanowany.`);
});
client.on("guildMemberAdd", member => {
    member.guild.defaultChannel.send(`Witaj na serwerze M&A - Discord ${member}. Baw sie dobrze!`);
    var role = member.guild.roles.get(CONFIG.defaultRole);
    if (MUTEDCOLLECTION.muted.indexOf(member.user.id) !== -1) {
        role = member.guild.roles.get(CONFIG.muteRole);
    }
    member.addRole(role);
    db.one(`insert into users(ID, name) values ($1, $2)`, [member.id, member.displayName])
        .then(() => {
            console.log(`Successfully added ${member.displayName} to db`);
        })
        .catch(error => {
            console.log(`Already exists`);
        });
});
client.on("guildMemberRemove", member => {
    member.guild.defaultChannel.send(`Uzytkownik ${member} wyszedl z serwera.`);
});

// SPAM HANDLER
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
                        console.log(error);
                    });
            }            
        })
        .catch(error => {
            message.channel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
            console.log(error);
        });
});

// COMMANDS FOR ADMINS
client.on('message', message => {
    if (message.member.roles.has(CONFIG.admin) || message.member.roles.has(CONFIG.moderator) || message.member.roles.has(CONFIG.technik)) {
        if (message.content.startsWith(CONFIG.prefix + "mute")) {            
            adminCommands.mute(message);
        }
        if (message.content.startsWith(CONFIG.prefix + "unmute")) {
            adminCommands.unmute(message);
        }
        if (message.content.startsWith(CONFIG.prefix + "kick")) {
            adminCommands.kick(message);
        }
        if (message.content.startsWith(CONFIG.prefix + "ban")) {
            adminCommands.ban(message);
        }        
        if (message.content.startsWith(CONFIG.prefix + "usun")) {
            adminCommands.deleteMessages(message);
        }
    }
});

//COMMANDS FOR EVERYONE
client.on('message', message => {
    if (usersOnCmdCooldown.indexOf(message.author) > -1)
        return message.channel.send(`Nie tak szybko, bo sie zmecze ${message.author}! >..<`).
            then(message => {
                setTimeout(function () {
                    message.delete();
                }, 1500);
            })
            .catch(error => {
                logError(message, error);
            });
    if (message.content.startsWith(CONFIG.prefix + "zabij")) {
        killCommand.kill(message);
        commandCooldown(message.author);            
    }
    if (message.content.startsWith(CONFIG.prefix + "wakaifix"))
    {
        radioFix(message.guild);
    }
    if (message.content.startsWith("!!test") && message.author.id === CONFIG.szk)
    {
        message.channel.send(`Nic do testowania :)`);
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
});

//AD LOOP
setInterval(() => {
    channel.setTopic(ADS.advertisement[adID]);
    adID++;
    if (adID === ADS.advertisement.length) adID = 0;
}, 20000);


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

function logError(message, error)
{
    message.channel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
    console.log(error);
}

const usersOnCmdCooldown = [];

function commandCooldown(user)
{
    usersOnCmdCooldown.push(user);
    setTimeout(() => {
                var index = usersOnCmdCooldown.indexOf(user);
                usersOnCmdCooldown.splice(index, 1);
            }, 5000);
}

function radioFix(guild)
{
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