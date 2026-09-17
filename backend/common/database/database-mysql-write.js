const Sequelize = require('sequelize');
const CONFIG = require('../utils/config-util');
const FS = require('fs')
const PATH = require('path')
const sequelizeWrite = new Sequelize(
    CONFIG.get('mysql:database'),
    CONFIG.get('mysql:user'),
    CONFIG.get('mysql:password'),
    {
        dialect: 'mysql',
        timezone: '+00:00',
        // dialectOptions: {
        //     useUTC: false //for reading from database
        // }
        logging: false,
        host: CONFIG.get('mysql:write:host'),
        // dialectOptions: {
        //     ssl: {
        //         cert: FS.readFileSync(PATH.join(__dirname, '../assets/ssl/write/') + 'dev-mysql-main-server.crt.pem')
        //     }
        // },
        pool: {
            // max: 20,
            // min: 0,
            acquire: 60000,
            // idle: 10000
        },
        define: {
            timestamps: false
        },
        // timezone: 'utc', // for writng
    }
);
module.exports = sequelizeWrite