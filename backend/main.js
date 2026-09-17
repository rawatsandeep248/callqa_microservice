const { server } = require('./agentic_server');
const emoji = require("node-emoji");
const CONFIG = require("./common/utils/config-util");
// const OtelEnabled = CONFIG.get("open_telemetry:enabled")
const OtelEnabled = false

server.listen(CONFIG.get("agentic:server:port"), () => {
  console.log(
    emoji.get('rocket'), emoji.get('rocket'), emoji.get('sparkles'), "Agentic server is running on port " +
  CONFIG.get("agentic:server:port"), emoji.get('sparkles'), emoji.get('rocket')
  );
})