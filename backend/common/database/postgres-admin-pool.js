const { Pool } = require("pg");
const { getBaseConfig } = require("./common-pool");

let adminPool = null;

/**
 * Connects to the default "postgres" database for CREATE DATABASE operations.
 */
function getAdminPool() {
    if (!adminPool) {
        const adminDb = process.env.POSTGRES_ADMIN_DATABASE || "postgres";
        adminPool = new Pool(getBaseConfig(adminDb));
        adminPool.on("error", (err) => {
            console.error("[postgres-admin-pool] idle client error", err);
        });
    }
    return adminPool;
}

module.exports = { getAdminPool };
