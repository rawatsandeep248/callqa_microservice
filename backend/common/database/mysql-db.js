const mysql = require('mysql');
const config = require('../utils/config-util');
var async = require('async');
const fs=require('fs')
const path= require('path')
class MySqlDB {
    constructor(database, type) {
        if (type === 'READ') {
            this.connection = mysql.createPool({
                // connectionLimit : 10,
                host: config.get('mysql:read:host'),
                user: config.get('mysql:user'),
                password: config.get('mysql:password'),
                database: database,
                ssl: {
                    ca: fs.readFileSync(path.join(__dirname ,'../assets/ssl/read/') +'mysqlreplica-server-ca.pem'),
                    key: fs.readFileSync(path.join(__dirname ,'../assets/ssl/read/')+ 'mysqlreplica-client-key.pem'),
                    cert: fs.readFileSync(path.join(__dirname ,'../assets/ssl/read/')+'mysqlreplica-client-cert.pem')
                },
                debug: false
            })
        } else {
            this.connection = mysql.createPool({
                // connectionLimit : 10,
                host: config.get('mysql:write:host'),
                user: config.get('mysql:user'),
                password: config.get('mysql:password'),
                database: database,
                ssl: {
                    ca: fs.readFileSync(path.join(__dirname ,'../assets/ssl/write/') +'mysql-server-ca.pem'),
                    key: fs.readFileSync(path.join(__dirname ,'../assets/ssl/write/') +'mysql-client-key.pem'),
                    cert: fs.readFileSync(path.join(__dirname ,'../assets/ssl/write/') +'mysql-client-cert.pem')
                },
                debug: false,
            })
            // console.log(this.connection);
        }
    }

    execute() {
        return new Promise((resolve, reject) => {
            this.connection.getConnection(function (err, connection) {
                if (err) {
                    // connection.destroy();
                    reject(err);
                } else {
                    connection.query('SELECT * FROM signup', function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.destroy();
                            resolve(res);

                        }
                    });
                }
            });
        });
    };

    findUser(query) {

        return new Promise((resolve, reject) => {
            this.connection.getConnection(function (err, connection) {
                if (err) {
                    // connection.destroy();
                    reject(err);
                } else {
                    connection.query(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.destroy();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    updateUser(query) {
        console.log('INSIDE UPDATE USER QUERY');
        // console.log(query);
        return new Promise((resolve, reject) => {
            this.connection.getConnection(function (err, connection) {
                if (err) {
                    // connection.destroy();
                    reject(err);
                } else {
                    connection.query(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.destroy();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    insertRow(query) {
        return new Promise((resolve, reject) => {
            this.connection.getConnection(function (err, connection) {
                if (err) {
                    // connection.destroy();
                    reject(err);
                } else {
                    connection.query(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.destroy();
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
                    // connection.destroy();
                    reject(err);
                } else {
                    connection.query(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.destroy();
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
                    // connection.destroy();
                    reject(err);
                } else {
                    connection.query(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.destroy();
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
                    // connection.destroy();
                    reject(err);
                } else {
                    connection.query(query, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.destroy();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    multiQueries(query1, query2, query3, query4, query5, query6) {
        let return_data = {};
        return new Promise((resolve, reject) => {
            this.connection.getConnection(function (err, connection) {
                if (err) {
                    // connection.destroy();
                    reject(err);
                } else {
                    async.parallel([
                        function (parallel_done) {
                            connection.query(query1, function (err, results) {
                                if (err) return parallel_done(err);
                                return_data.table1 = results;
                                parallel_done();
                            })
                        },
                        function (parallel_done) {
                            connection.query(query2, function (err, results) {
                                if (err) return parallel_done(err);
                                return_data.table2 = results;
                                parallel_done();
                            })
                        },
                        function (parallel_done) {
                            connection.query(query3, function (err, results) {
                                if (err) return parallel_done(err);
                                return_data.table3 = results;
                                parallel_done();
                            })
                        },
                        function (parallel_done) {
                            connection.query(query4, function (err, results) {
                                if (err) return parallel_done(err);
                                return_data.table4 = results;
                                parallel_done();
                            })
                        },
                        function (parallel_done) {
                            connection.query(query5, function (err, results) {
                                if (err) return parallel_done(err);
                                return_data.table5 = results;
                                parallel_done();
                            })
                        },
                        function (parallel_done) {
                            connection.query(query6, function (err, results) {
                                if (err) return parallel_done(err);
                                return_data.table6 = results;
                                parallel_done();
                            })
                        },
                    ], function (err) {
                        if (err) console.log(err);
                        connection.destroy();
                        resolve(return_data)
                        // res.send(return_data);
                    });
                    //  });
                }
            });
        });
    };
    
}
module.exports = MySqlDB;
