//var DISCORD = require('discord.js');
//var client = new DISCORD();

module.exports.run = (bot, message, args) => {
  
    message.channel.send({embed:{
        title:"Ban command",
        description:"*description*",
        color: 0x17A589 
    }})
}

module.exports.config = {
    command: "ban"
}