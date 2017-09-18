const CONFIG = require('./config.json');
const FS = require('fs');
const MUTEDCOLLECTION = require('./mutedCollection.json');

class AdminCommandsHandler {
    getUser(message) {
        var user = message.mentions.members.first();
        if (user === undefined || user == null) return false;
        if (user.roles.has(CONFIG.admin) || user.roles.has(CONFIG.technik)) return false;
        return user;
    }

    getChannel(message) {
        var channel = message.channel;
        if (channel === CONFIG.defaultChannel) return false;
        return channel;
    }

    logError(message, error) {
        message.channel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
        console.log(error);
    }

    mute(message) {
        var user = this.getUser(message);
        var channel = this.getChannel(message);
        if (!user) return message.channel.send('Zle uzyles komendy lub uzywasz jej na niewlasciwym uzytkowniku. Poprawne uzycie to ***ts!mute @uzytkownik.***');
        if (!channel) return message.channel.send('Tej komendy mozesz uzyc tylko na kanale domyslnym');

        user.roles.forEach(role => {
            user.removeRole(role)
                .catch(error => {
                    console.log(error);
                });
        });
        user.addRole(CONFIG.muteRole)
            .then(() => {
                message.guild.defaultChannel.send(`${user} juz nie moze pisac!`);
                MUTEDCOLLECTION.muted.push(user.id);
                FS.writeFile('mutedCollection.json', JSON.stringify(MUTEDCOLLECTION), function (error) {
                    //console.log('Cos poszlo nie tak');
                });
            })
            .catch(error => {
                message.guild.defaultChannel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
                console.log(error);
            });
    }

    unmute(message) {
        var user = this.getUser(message);
        var channel = this.getChannel(message);
        if (!user) return message.channel.send('Zle uzyles komendy lub uzywasz jej na niewlasciwym uzytkowniku. Poprawne uzycie to ***ts!unmute @uzytkownik.***');
        if (!channel) return message.channel.send('Tej komendy mozesz uzyc tylko na kanale domyslnym');
        

        user.roles.forEach(role => {
            user.removeRole(role)
                .then(() => {
                    MUTEDCOLLECTION.muted.forEach(muted => {
                        if (user.id === muted)
                        {
                            var index = MUTEDCOLLECTION.muted.indexOf(muted);
                            MUTEDCOLLECTION.muted.splice(index, 1);
                            FS.writeFile('mutedCollection.json', JSON.stringify(MUTEDCOLLECTION), function (error) {
                                console.log('Cos poszlo nie tak');
                            });
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                })
        });
        user.addRole(CONFIG.defaultRole)
            .then(() => {
                message.guild.defaultChannel.send(`${user} znowu moze pisac!`);
            })
            .catch(error => {
                message.guild.defaultChannel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
                console.log(error);
            });
    }

    kick(message) {
        var user = this.getUser(message);
        if (!user) return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!kick @uzytkownik.***');

        user.kick()
            .then(() => {
                message.guild.defaultChannel.send(`${user} zostal wyrzucony!`);
            })
            .catch(error => {
                message.guild.defaultChannel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
                console.log(error);
            });
    }

    ban(message) {
        var user = this.getUser(message);
        if (!user) return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!ban @uzytkownik.***');

        user.ban()
            .catch(error => {
                message.guild.defaultChannel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
                console.log(error);
            });
    }

    deleteMessages(message) {
        var messagesToDelete = parseInt(message.content.substr(message.content.indexOf(' ') + 1));
        if (messagesToDelete === null || messagesToDelete === undefined || isNaN(messagesToDelete)) return message.channel.send('Zle uzyles komendy. Poprawne uzycie to ***ts!usun [liczba wiadomosci].***');
        message.channel.bulkDelete(messagesToDelete)
            .then(() => {
                message.channel.send(`Skasowalam ${messagesToDelete.toString()} wiadomosci!`);
            })
            .catch(error => {
                message.channel.send(`${message.guild.member(CONFIG.szk)} prosze napraw mnie!`);
                console.log(error);
            });
    }
}

module.exports = AdminCommandsHandler;