module.exports.run = (bot, message, args) => {

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) {
        message.channel.send({embed:{
            title:"Suggest",
            description:"*description*",
            color: 0x17A589 
        }})
        return;
    }   
module.exports.config = {
    command: "suggest"
}