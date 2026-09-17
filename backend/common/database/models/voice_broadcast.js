const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');

class VoiceBroadcast{
    constructor(operation) {
        return this.getConnection(operation) ;
    }

    async getConnection(operation) {
        if(operation === MessageUtil.info().database.operation.read) {  
            this.sequelize = require('../database-mysql-read');
        } else {
            this.sequelize = require('../database-mysql-write');
        }
        return await this.defineModel();
    }

    async defineModel() {
        const VOICEBROADCAST = this.sequelize.define('callai_voice_broadcast',{
            campaign_id : {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false
            },
            msg_type : {
                    type: DataTypes.ENUM(MessageUtil.sql().voice_broadcast.enum.msgType.text, MessageUtil.sql().voice_broadcast.enum.msgType.voice),
                    allowNull: false
            },
            tts_engine : {
                type: DataTypes.STRING,
                allowNull: true
            },
            phrase : {
                type: DataTypes.STRING,
                allowNull: true
            },
            tts_voice_name : {
                type: DataTypes.STRING,
                allowNull: true
            },
            tts_speed : {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            tts_pitch : {
                type: DataTypes.FLOAT,
                allowNull: true
            },
              tts_audio : {
                type: DataTypes.STRING,
                allowNull: true
            },
            tenant_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            created_by: {
                type: DataTypes.STRING,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
                allowNull: true
            },
            updated_by: {
                type: DataTypes.STRING,
                allowNull: true
            },
            language_code : {
                type : DataTypes.STRING,
                allowNull: true
            },
            language : {
                type : DataTypes.STRING,
                allowNull: true
            },
            gender : {
                type: DataTypes.ENUM(MessageUtil.sql().voice_broadcast.enum.gender.male, MessageUtil.sql().voice_broadcast.enum.gender.female),
                allowNull: true
            },
            tts_audio_azure : {
                type : DataTypes.STRING,
                allowNull : true
            }
        },{
            timestamps: false,
            tableName: 'callai_voice_broadcast',
            freezeTableName: true,
            
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, VOICEBROADCAST: VOICEBROADCAST };
    }
    // async syncTables() {
    //     try {
    //         await this.sequelize.sync()
    //         .then(()=>{
    //             console.log("sync completed:::")
    //         })
    //     } catch(error) {
    //         console.log("Unable to sync database: ", error);
    //     }
    // }

}


module.exports = VoiceBroadcast;