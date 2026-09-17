const mysql = require('mysql2');
const FS = require('fs')
const PATH = require('path')
class MySqlDB {
    constructor(database) {
        if (database.hasOwnProperty('haveSSl')) {
            console.log("in the with ssl::::::::")
            this.createPoolWithSSl(database);
        }
        else {
            console.log("in the without ssl::::::::")
            this.createPoolWithoutSSl(database);
        }
    }

    async createPoolWithSSl(database) {
        try {
            if (database.key_filename == "" && database.ca_filename == "") {
                // console.log("PATH.join(__dirname, '../assets/ssl-files/') + database.cert_filename", PATH.join(__dirname, '../assets/ssl-files/') + database.cert_filename);
                console.log("only using cert files::::::::::::::::::")
                this.connection = mysql.createPool({
                    connectionLimit: 10,
                    host: "callai-mysql-replica-dev.mysql.database.azure.com",
                    user: "callai",
                    password: "Xingmpeg$123",
                    database: database.database,
                    debug: false,
                    ssl: {
                        cert: FS.readFileSync(PATH.join(__dirname, '../assets/ssl-files/') + database.cert_filename),
                        rejectUnauthorized: true
                    }
                })
            }
            else if (database.key_filename == "") {
                console.log("only using cert and ca files::::::::::::::::::")
                this.connection = mysql.createPool({
                    connectionLimit: 10,
                    host: database.host,
                    user: database.user,
                    password: database.password,
                    database: database.database,
                    debug: false,
                    ssl: {
                        cert: FS.readFileSync(PATH.join(__dirname, '../assets/ssl-files/') + database.cert_filename),
                        ca: FS.readFileSync(PATH.join(__dirname, '../assets/ssl-files/') + database.ca_filename)
                    }
                })
            }
            else if (database.ca_filename == "") {
                console.log("only using cert and key files::::::::::::::::::")
                this.connection = mysql.createPool({
                    connectionLimit: 10,
                    host: database.host,
                    user: database.user,
                    password: database.password,
                    database: database.database,
                    debug: false,
                    ssl: {
                        cert: FS.readFileSync(PATH.join(__dirname, '../assets/ssl-files/') + database.cert_filename),
                        key: FS.readFileSync(PATH.join(__dirname, '../assets/ssl-files/') + database.key_filename)
                    }
                })
            }
            else {
                console.log("only using every files::::::::::::::::::")
                this.connection = mysql.createPool({
                    connectionLimit: 10,
                    host: database.host,
                    user: database.user,
                    password: database.password,
                    database: database.database,
                    debug: false,
                    ssl: {
                        cert: FS.readFileSync(PATH.join(__dirname, '../assets/ssl-files/') + database.cert_filename),
                        ca: FS.readFileSync(PATH.join(__dirname, '../assets/ssl-files/') + database.ca_filename),
                        key: FS.readFileSync(PATH.join(__dirname, '../assets/ssl-files/') + database.key_filename)
                    }
                })
            }
        }
        catch (err) {
            console.log("errr:::::", err);
            throw err;
        }
    }
    createPoolWithoutSSl(database) {
        try {
            this.connection = mysql.createPool({
                connectionLimit: 10,
                host: database.host,
                user: database.user,
                password: database.password,
                database: database.database,
                debug: false,
            })
        } catch (e) {
            console.log("errrrrrrrrrrrrrrrrrrrrr", e)
            throw ("SSL REQUIREDDDDDDdddd")
        }
    }



    insertRow(query) {
        return new Promise((resolve, reject) => {
            this.connection.getConnection(function (err, connection) {
                if (err) {
                    connection.release();
                    reject(err);
                } else {
                    connection.query(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.release();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    deleteRow(query) {
        return new Promise((resolve, reject) => {
            this.connection.getConnection(function (err, connection) {
                if (err) {
                    connection.release();
                    reject(err);
                } else {
                    connection.query(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.release();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    updateRow(query) {
        return new Promise((resolve, reject) => {
            this.connection.getConnection(function (err, connection) {
                if (err) {
                    connection.release();
                    reject(err);
                } else {
                    connection.query(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.release();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    fetchRow(query) {
        return new Promise((resolve, reject) => {
            this.connection.getConnection(function (err, connection) {
                if (err) {
                    connection.release();
                    reject(err);
                } else {
                    connection.query(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.release();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    async testMysqlConnection() {
        try {
            return new Promise((resolve, reject) => {
                this.connection.getConnection((err, connect) => {
                    if (err) {
                        reject({ msg: "error while creating connection", err });
                    }
                    else {
                            connect.query('SELECT 1 + 1 AS `test`;', function (err, res) {
                                if (err) {
                                    connect.release();
                                    reject({ msg: "error while creating connection", err });
                                }
                                else {
                                    connect.release();
                                    resolve({ msg: "connection tested successfully", res });
                                }
                            })
                     
                    }
                });

            })
        }
        catch (err) {
            console.log("eorr:::", err)
            throw err;
        }
    }

}
module.exports = MySqlDB;