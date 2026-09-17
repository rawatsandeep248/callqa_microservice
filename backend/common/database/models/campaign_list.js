const { DataTypes } = require('sequelize');
const MessageUtil = require('../../utils/message-util');

// TODO: Implement Indexing, Add error handling

class CampaignList {
    constructor(operation) {
        return this.getConnection(operation)
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
        const CAMPAIGNLIST = this.sequelize.define('campaign_list', {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false
            },
            campaign_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM(MessageUtil.sql().campaign_list.enum.type.email, MessageUtil.sql().campaign_list.enum.type.sms, MessageUtil.sql().campaign_list.enum.type.voice, MessageUtil.sql().campaign_list.enum.type.email_sms),
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM(MessageUtil.sql().campaign_list.enum.status.active, MessageUtil.sql().campaign_list.enum.status.pending, MessageUtil.sql().campaign_list.enum.status.complete, MessageUtil.sql().campaign_list.enum.status.stop),
                defaultValue: MessageUtil.sql().campaign_list.enum.status.pending,
                allowNull: false
            },
            tenant_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
                allowNull: false
            },
            created_by: {
                type: DataTypes.STRING,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE            
            },
            modified_by: {
                type: DataTypes.STRING
            },
        }, {
            tableName: 'callai_campaign_list',
            timestamps: false,
        })

        // DIALER TABLE
        const DIALER = this.sequelize.define('dialer', {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false
            },
            campaign_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            ivr_type: {
                type: DataTypes.ENUM(MessageUtil.sql().dialer.enum.ivr_type.interactive, MessageUtil.sql().dialer.enum.ivr_type.broadcast),
                allowNull: false
            },
            max_retry: {
                type: DataTypes.ENUM(MessageUtil.sql().dialer.enum.max_retry.no_retry,MessageUtil.sql().dialer.enum.max_retry.one_retry ,MessageUtil.sql().dialer.enum.max_retry.two_retry),
                defaultValue: MessageUtil.sql().dialer.enum.max_retry.no_retry,
                allowNull: false
            },
            time_out_dialing: {
                type: DataTypes.ENUM(MessageUtil.sql().dialer.enum.time_out_dialing.thirty_sec_time_out ,MessageUtil.sql().dialer.enum.time_out_dialing.sixty_sec_time_out, MessageUtil.sql().dialer.enum.time_out_dialing.ninety_sec_time_out),
                defaultValue: MessageUtil.sql().dialer.enum.time_out_dialing.sixty_sec_time_out,
                allowNull: false
            },
            frequency: {
                type: DataTypes.ENUM(MessageUtil.sql().dialer.enum.frequency.five ,MessageUtil.sql().dialer.enum.frequency.ten,MessageUtil.sql().dialer.enum.frequency.fiftheen,MessageUtil.sql().dialer.enum.frequency.twenty,MessageUtil.sql().dialer.enum.frequency.twenty_five),
                defaultValue: MessageUtil.sql().dialer.enum.frequency.twenty,
                allowNull: false
            },
            time_btw_retries: {
                type: DataTypes.ENUM(MessageUtil.sql().dialer.enum.time_btw_retries.ten_min ,MessageUtil.sql().dialer.enum.time_btw_retries.twenty_min,MessageUtil.sql().dialer.enum.time_btw_retries.thirty_min,MessageUtil.sql().dialer.enum.time_btw_retries.fourty_min,MessageUtil.sql().dialer.enum.time_btw_retries.fifty_min),
                defaultValue: MessageUtil.sql().dialer.enum.time_btw_retries.sixty_min,
                allowNull: false
            },
            bot_key: {
                type: DataTypes.STRING,
                allowNull: true
            },
            caller_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            tenant_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
                allowNull: false
            },
            created_by: {
                type: DataTypes.STRING,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE
            },
            modified_by: {
                type: DataTypes.STRING
            },
            msisdn_domain: {
                type: DataTypes.STRING
            },
        }, {
          tableName: 'callai_dialer',
          timestamps: false,
          indexes:[
            {
            //   unique: false,
              fields:['campaign_id']
            }
           ]
        })

        // Scheduler TABLE
        const SCHEDULER = this.sequelize.define('scheduler', {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false
            },
            campaign_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            start_time: {
                type: 'TIMESTAMP',
                allowNull: false
            },
            end_time: {
                type: 'TIMESTAMP',
                allowNull: false
            },
            timezone_country: {
                type: DataTypes.STRING,
                allowNull: false
            },
            timezone_city: {
                type: DataTypes.STRING,
                allowNull: false
            },
            weekdays: {
                type: DataTypes.STRING,
                allowNull: false
            },
            tenant_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW(),
                allowNull: false
            },
            created_by: {
                type: DataTypes.STRING,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE,
            },
            modified_by: {
                type: DataTypes.STRING,
            },
        }, {
            tableName: 'callai_scheduler',
            timestamps: false,
            indexes:[
                {
                //   unique: false,
                  fields:['campaign_id']
                }
            ]
        })

        const [R1, R2, R3] = [...await Promise.allSettled([CAMPAIGNLIST, DIALER, SCHEDULER]).then((results) => {
            results.forEach((result) => {
                if(result.status === 'rejected') {
                    throw result.reason;
                }
            })
            return results;
        })]


        R1.value.hasOne(R2.value, {
            foreignKey: 'campaign_id',
            foreignKeyConstraint: true
        });

        R1.value.hasOne(R3.value, {
            foreignKey: 'campaign_id',
            foreignKeyConstraint: true
        });

        R2.value.belongsTo(R1.value, {
           foreignKey: 'campaign_id',
           foreignKeyConstraint: true
        })

        R3.value.belongsTo(R1.value, {
           foreignKey: 'campaign_id',
           foreignKeyConstraint: true
        })
        // await this.syncTables();
        return { SEQUELIZE: this.sequelize, CAMPAIGNLIST: R1.value, DIALERLIST: R2.value, SCHEDULERLIST: R3.value };
    }

    // async syncTables() {
    //     try {
    //         // await this.sequelize.sync({force : true});
    //         // await this.sequelize.sync({alter : true});
    //         await this.sequelize.sync();
    //     } catch(error) {
    //         console.log("Unable to sync database: ", error);
    //     }
    // }
};

module.exports = CampaignList;