const MISC = require('./../misc.json');
const CONFIG = require('./../config.json');

module.exports.run = (bot, message, args) => {

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) {
        message.channel.send({embed:{
            title:"Love command",
            description:"*description*",
            color: 0x17A589 
        }})
        return;
    }

    if (message.author.id === CONFIG.szk) message.channel.send(MISC.loveSZK);
    else message.channel.send(MISC.loveEveryone);
}
    
module.exports.config = {
    command: "love"
    //command: "kochasz mnie?"
}