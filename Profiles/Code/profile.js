"use strict"
const User = require("discord.js").User;
const GuildMember = require("discord.js").GuildMember;
const Role = require("discord.js").Role;

class Profile{
    /**    
     * @param {GuildMember} _guildMember
     */
    constructor(_guildMember) {
        /**
         * DATA RETRIEVED FROM DISCORD.JS MEMBERUSER OBJECT
         */

        /**
         * Set Discord name to custom user object
         * @type {string}
         * @returns {string}
         */
        this.name = _guildMember.user.username;
        
        /**
         * Set displayed name to custom user object
         * @type {string}
         */
        this.guildname = _guildMember.nickname;
        
        /**
         * Set discord id to custom user object
         * @type {string}
         */
        this.id = _guildMember.user.id;
        
        /**
         * Set avatar id to custom user object
         * @type {?string}
         */
        this.avatar = _guildMember.user.avatar;
        
        /**
         * Set avatarURL if exists to custom user object 
         * @type {?string}
         */
        this.avatarUrl = _guildMember.user.avatarURL;

        /**
         * CUSTOM TSUKIKO USER PROPERTIES
         */

        /**
         * Set default description 
         * @type {string}
         */
        this.description = "*Not yet defined.*";
        
        /**
         * Set roles to custome user object
         * @type {Role[]} TODO: Check how to define snowflake or if this array is useable
         */
        this.roles = _guildMember.roles.array;
    
        /**
         * Set join date to custom user object
         * @type {Date}
         */
        this.joinDate = _guildMember.joinedAt;

        /**
         * TSUKIKO INFO
         */ 

        /**
         * Declare user's birthday property
         * @type {Date}
         */
        this.birthday = new Date(); 

        /**
         * Declare user's message count
         * @type {number}
         */
        this.messagesCount = 0;

        /**
         * Declare user's score count
         * @type {number}
         */
        this.score = 0;
        
        /**
         * Declare user's level
         * @type {number}
         */
        this.level = 1;

        /**
         * Declare user's equipment
         * @type {Object}
         * TODO: For further implementation
         */
        this.equipment = {};    
    }
}

module.exports = Profile;