module.exports.run = (bot, message, args) => {
    message.channel.send({embed:{
        title:"About author",
        description:"*description*",
        color: 0x17A589 
    }})    
}
    
module.exports.config = {
    command: "author"
}