const COMMON = require('./../../Utilities/common.js');
const GuildMember = require("discord.js").GuildMember;
const FS = require('fs');
const PROFILE = require('./profile.js');

class ProfileFactory {    
    constructor() {
        /**
         * Relative path to profiles directory
         * Where to put new ones and where
         * to load them from
         * @type {string}
         */
        this.dir = "./Profiles/";   
    }    

    /**     
     * @param {GuildMember} _guildMember 
     */
    createProfile(_guildMember) {
        /**
         *          
         */
        var _profile = new PROFILE(_guildMember);

        var pattern = {};
        pattern.name = _profile.name;
        pattern.guildName = _profile.guildname;
        pattern.ID = _profile.id;
        pattern.avatar = _profile.avatar;
        pattern.avatarURL = _profile.avatarUrl;
        pattern.description = _profile.description;
        pattern.roles = _profile.roles;
        pattern.joinDate = _profile.joinDate;
        // TSUKIKO INFO
        pattern.birthday = _profile.birthday;
        pattern.messagesCount = _profile.messagesCount;
        pattern.score = _profile.score;
        pattern.level = _profile.level;
        pattern.equipment = _profile.equipment;                     
        
        FS.writeFile(this.dir + pattern.ID + '.json', JSON.stringify(pattern));
        
    }

    updateProfile(_guildMember) {

    }
}
module.exports = ProfileFactory;