module.exports.run = (bot, message, args) => {
    message.channel.send({embed:{
        title:"Love command",
        description:"*description*",
        color: 0x17A589 
    }})    
}
    
module.exports.config = {
    command: "love"
}