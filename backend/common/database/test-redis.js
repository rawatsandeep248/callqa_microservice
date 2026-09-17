// const redis = require("redis");
const util = require("util");
const Redis = require("ioredis");
const { createCluster, createClient } = require("redis");

class RedisDB {
    constructor(config) {
        this.config = config;
        console.log("this.client", this.redisClient, "status:", this.redisClient?.isOpen)
    }
    async testRedisConnection() {
        let redisClient;
        try {
            let connectionString = `redis://${this.config.get("bot_redis:host")}:${this.config.get("bot_redis:port")}`;

            console.log("redis host", this.config.get('bot_redis:host'))
            console.log("redis port", this.config.get('bot_redis:port'), "master name: ", this.config.get('bot_redis:name'));
            console.log("SENTINEL REDIS connnection : ", this.config.get('bot_redis:host').includes("sentinel"), "kirat bawaaaaaaaaa")
            if (this.config.get('bot_redis:host').includes("sentinel")) {
                console.log("sentinel redis is initializing");
                redisClient = new Redis({
                    sentinels: [
                        { host: this.config.get('bot_redis:host'), port: this.config.get('bot_redis:port') }
                    ],
                    name: this.config.get('bot_redis:name'),
                });
            } else {
                console.log("cluster redis is initializing");
                redisClient = createCluster({
                    rootNodes: [
                        {
                            url: connectionString
                        }
                    ]
                });

            }

            console.log("connection?", redisClient.isOpen)
            // redisClient.isOpen ? console.log("connection is already open") : console.log("connectinggggggggggggg");
            redisClient.isOpen ? console.log("connection is already open") : await redisClient.connect();
            // const result = await redisClient.ping();
            await redisClient.set('test_key', 'test_value');
            const value = await redisClient.get('test_key');
            console.log('Redis Connection Successful. Test value retrieved:', value);
        }
        catch (error) {
            console.error("Error connecting to Redis", error);
            throw error;
        }
        finally {
            if (redisClient) {
                redisClient.disconnect();
            }
        }
    }
}

module.exports = RedisDB;