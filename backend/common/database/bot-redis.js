// const redis = require("redis");
const util = require("util");
const Redis = require("ioredis");
const { createCluster } = require('redis');

class RedisDB {
  constructor(config) {
    this.config = config;
    const connectionString = `redis://${config.get('bot_redis:host')}:${config.get('bot_redis:port')}`;
    this.client_cluster = createCluster({
      rootNodes: [
        {
          url: connectionString
        }
      ]
    });
    if (config.get('bot_redis:standalone:host') && config.get('bot_redis:standalone:host') != 'default' && config.get('bot_redis:standalone:port')) {
      this.client_standalone = new Redis({
        host: config.get('bot_redis:standalone:host'),
        port: config.get('bot_redis:standalone:port'),
      });
    } else {
      this.client_standalone = null;
      console.warn("Standalone Redis configuration is missing or set to default.", config.get('bot_redis:standalone:host'), config.get('bot_redis:standalone:port'));
    }

  }

  async setKey(keyValueArray, client) {
    console.log("Hitting redis :", client)
    if (client === "sentinel") {
      try {
        if (this.client.status === 'end') {
          await this.client.connect();
        }
        const connectionString = `host & port: ${this.config.get('bot_redis:host')}:${this.config.get('bot_redis:port')}`;
        for (let i = 0; i < keyValueArray.length; i++) {
          let result = await this.client.set(keyValueArray[i].key, keyValueArray[i].value);
          console.log("result_1::", result)
        }
      } catch (err) {
        console.log("Redis err::", err)
        throw err;
      }
    } else if (client === "cluster") {
      try {
        // console.log("connection?", this.client.isOpen)
        console.log("cluster redis is initializing");
        this.client_cluster.isOpen ? "" : await this.client_cluster.connect();
        for (let i = 0; i < keyValueArray.length; i++) {
          let result = await this.client_cluster.set(keyValueArray[i].key, keyValueArray[i].value);
          console.log("result_1::", result)
        }
        return true;
      } catch (err) {
        console.log("err::", err)
        throw err;
      }
    } else {
      try {
        console.log("standalone redis is initializing");
        console.log("connection?", this.client_standalone.status)
        if (this.client_standalone.status !== 'ready') {
          await this.client_standalone.connect();  // safe to call even if already connecting
        }
        for (let i = 0; i < keyValueArray.length; i++) {
          let result = await this.client_standalone.set(keyValueArray[i].key, keyValueArray[i].value);
          console.log("result_1::", result)
        }
        return true;
      } catch (err) {
        console.log("err::", err)
        throw err;
      }
    }
  }

  async fetchKey(key, client) {
    console.log("Hitting redis :", client);
    if (client === "sentinel") {
      try {
        if (this.client.status === 'end') {
          await this.client.connect();
        }
        const result = await this.client.get(key);
        // console.log("result:", result)
        return result;
      } catch (err) {
        console.log("Redis err::", err)
        throw err;
      }
    } else if (client === "cluster") {
      try {
        console.log("connection?", this.client_cluster.isOpen)
        this.client_cluster.isOpen ? "" : await this.client_cluster.connect();
        const result = await this.client_cluster.get(key);
        // console.log("result:", result)
        return result;
      } catch (err) {
        throw err;
      }
    } else {
      try {
        console.log("standalone redis is initializing");
        console.log("connection?", this.client_standalone.status)
        if (this.client_standalone.status !== 'ready') {
          await this.client_standalone.connect();  // safe to call even if already connecting
        }

        const result = await this.client_standalone.get(key);
        // console.log("result:", result);
        return result;

      } catch (err) {
        console.error("Redis error:", err);
        throw err;
      }
    }
  }

  async setMultipleKeys(keyValuePairs) {
    if (this.client_type === "sentinel") {
      try {
        if (this.client.status === 'end') {
          await this.client.connect();
        }
        const multi = this.client.multi();
        for (let i = 0; i < keyValuePairs.length; i++) {
          multi.set(keyValuePairs[i].key, keyValuePairs[i].value);
        }
        const result = await multi.exec()
        console.log("result_1::", result)
        return result
      }
      catch (err) {
        throw err;
      }
      finally {
        console.log("here in the finnaly::::::::::::::::")
        this.client?.quit()
      }
    } else {
      try {
        this.client.isOpen ? console.log("client already connected") : await this.client.connect();
        const multi = this.client.multi();
        for (let i = 0; i < keyValuePairs.length; i++) {
          multi.set(keyValuePairs[i].key, keyValuePairs[i].value);
        }
        const result = await multi.exec()
        console.log("result_1::", result)
        return result
      }
      catch (err) {
        throw err;
      }
      finally {
        console.log("here in the finnaly::::::::::::::::")
        this.client.isOpen ? "" : await this.client.quit()
      }
    }
  }

  async deleteCacheKeysWithPrefix(prefix, client) {
    console.log("Hitting redis to delete keys with prefix:", prefix, " on client:", client);
    if (client === "sentinel") {
      try {
        if (this.client.status === 'end') {
          await this.client.connect();
        }
        // console.log("CONNECTED TO REDIS", prefix);
        let KEYS_DATA = await this.client.keys(`cache_*`);
        // console.log("All Keys with prefix: ", KEYS_DATA)
        if (KEYS_DATA.length > 0) {
          for (let i = 0; i < KEYS_DATA.length; i++) {
            await this.client.del(KEYS_DATA[i], (reply) => {
              // console.log("deleted key:", KEYS_DATA[i], "res : ", reply);
            });
          }
        }
      } catch (err) {
        console.log("Redis ERROR", err);
        throw err;
      } finally {
        this.client?.quit();
      }
    }
    else if (client === "cluster") {
      try {
        console.log("-----------------", this.client_cluster.isOpen);
        if (!this.client_cluster.isOpen) {
          await this.client_cluster.connect();
        }
        console.log("CONNECTED To REDIS", this.client_cluster.isOpen);
        const cursor = '0';
        if (!this.client_cluster.masters || this.client_cluster.masters.length === 0) {
          console.log("No masters found in the cluster");
          return true;
        }
        await Promise.all(
          this.client_cluster.masters.map(async (master) => {
            const client = await this.client_cluster.nodeClient(master);
            const res = await client.scan(cursor, {
              MATCH: `${prefix}*`,
              COUNT: 1000
            });
            console.log("scan result", res);
            if (res.keys && res.keys.length > 0) {
              await this.deleteKeys(this.client_cluster, res.keys);
            }
          })
        );
      
      } catch (err) {
        console.log("ERROR", err);
        throw err;
      }
      
    } else {
      try {
        this.client_standalone.isOpen ? console.log("client already connected") : await this.client_standalone.connect();
        console.log("CONNECTED To REDIS", this.client_standalone.isOpen);
        console.log("standalone redis is initializing");
        // delete keys with the given prefix
        let cursor = '0'; // Initial cursor value for SCAN command
        do {
          const res = await this.client_standalone.scan(cursor, {
            MATCH: `${prefix}*`,
            COUNT: 1000
          });
          cursor = res.cursor;
          await this.deleteKeys(this.client_standalone, res.keys);
        } while (cursor !== '0');
      } catch (err) {
        console.log("Redis ERROR", err);
        throw err;
      }
    }
  }

  async deleteKeys(client, keyArray) {
    try {
      if (!keyArray || keyArray.length === 0) return true;
      // UNLINK supports multiple keys
      const result = await client.unlink(...keyArray);
      console.log("unlinked keys count:", result);
      return true;
    } catch (err) {
      console.log("err:: while deleting keys from redis ", err);
      throw err;
    }
  }
}

module.exports = RedisDB;
