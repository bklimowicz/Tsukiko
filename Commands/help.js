module.exports.run = (bot, message, args) => {

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help")) {
        message.channel.send({embed:{
            title:"Help",
            description:"*Pomagam.*",
            color: 0x17A589 
        }})
        return;
    }

    var list = '```';   
    var index = 0; 
    bot.commands.forEach(command => {
        index++;
        list += "*   " + command.config.command + '\n';
    });
    list += '```';
    message.channel.send({embed:{
        title: "Help",
        description: list,
        color: 0x17A589
    }});
}
    
module.exports.config = {
    command: "help"
}