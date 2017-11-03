const MISC = require('./../misc.json');

module.exports.run = (bot, message, args) => {

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) {
        message.channel.send({embed:{
            title:"About author",
            description:"*description*",
            color: 0x17A589 
        }})
        return;
    }

    message.channel.send(MISC.author);
}
    
module.exports.config = {
    command: "author"
}