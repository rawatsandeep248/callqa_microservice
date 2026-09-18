const { AsyncLocalStorage } = require("async_hooks");

const tenantStorage = new AsyncLocalStorage();

function runWithTenantPool(pool, fn) {
    return tenantStorage.run({ pool }, fn);
}

function getTenantPoolFromContext() {
    return tenantStorage.getStore()?.pool || null;
}

module.exports = { runWithTenantPool, getTenantPoolFromContext };
