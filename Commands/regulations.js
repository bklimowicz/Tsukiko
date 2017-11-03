const regulations = require('./../regulations.json');

module.exports.run = (bot, message, args) => {

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) {
        message.channel.send({embed:{
            title:"Regulations",
            description:"*description*",
            color: 0x17A589 
        }})
        return;
    }

    var reg = '';
    regulations.regulations.forEach(line => {
        reg += line + '\n';
    });
    message.channel.send(reg);
}
   
module.exports.config = {
    command: "regulations"
}