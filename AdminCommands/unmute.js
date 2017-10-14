const MUTEDCOLLECTION = require('d:\\Git repositories\\Tsukiko.js\\mutedCollection.json');
const CONFIG = require('d:\\Git repositories\\Tsukiko.js\\config.json');
const FS = require('fs');

module.exports.run = (bot, message, args) => {
    var user = getUser(message);
    var channel = getChannel(message);

    if (message.content.endsWith("-h") || message.content.endsWith("-help")) 
    {
        message.channel.send({embed:{
            title:"Unmute command",
            description:"*description*",
            color: 0x17A589 
        }})    
        return;
    }

    if (!user) return message.channel.send('Zle uzyles komendy lub uzywasz jej na niewlasciwym uzytkowniku. Poprawne uzycie to ***ts!unmute @uzytkownik.***');
    if (!channel) return message.channel.send('Tej komendy mozesz uzyc tylko na kanale domyslnym');    

    var _mutedRole = message.channel.guild.roles.get(CONFIG.muteRole);
    user.roles.forEach(role => {
        if (role === _mutedRole)
        {
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
                            message.channel.send(`${user} znowu moze pisac!`);
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                })
        }
    });
    
    function getUser(message) {        
        var user = message.mentions.members.first();
        if (user === undefined || user == null) return false;
        if (user.roles.has(CONFIG.admin) || user.roles.has(CONFIG.technik || user.roles.has(CONFIG.moderator))) return false;
        return user;
    }
    
    function getChannel(message) {
        var channel = message.channel;
        if (channel === CONFIG.defaultChannel) return false;
        return channel;
    }

    function logError(message, error) {
        var chan = message.guild.channels.get(CONFIG.logChannel);
        if (chan !== null) chan.send(`${message.guild.member(CONFIG.szk)}, ${error}.`);            
        console.log(error);
    }        
}
    
module.exports.config = {
    command: "unmute"
}