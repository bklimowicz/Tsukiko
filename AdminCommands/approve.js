const COMMON = require('./../Utilities/common.js');
const CLIENT = require('discord.js').Client;
const MESSAGE = require('discord.js').Message;

/**
 * 
 * @param {CLIENT} bot 
 * @param {MESSAGE} message 
 * @param {string} args 
 */
module.exports.run = (bot, message, args) => {
  
    if (!COMMON.isAdmin(message)) {
        return;
    }

    if (message.content.endsWith(" -h") || message.content.endsWith(" -help"))
    {    
        message.channel.send({embed:{
            title:"Approve command",
            description:"*Approves pending request. To list requests please see ts!request -ls*",
            color: 0x17A589 
        }});
        return; 
    }



    /**
     * So this needs to check for pending requests list stored in json in the root folder.
     * Sender needs to specify which of array elemnt he wants to approve. Then object is to be
     * sent back to proper handler and executed. 
     * Example of requests.json:
     * 
     * {"requests":
     *  [
     *      {
     *          "type": "suggest",
     *          "message": "this is example idea"
     *      }
     *  ]
     * }     
     */
}

module.exports.config = {
    command: "approve"
}