/******************* NPM Libraries *****************************/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const nonCampaignCron = require("node-cron");
const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const CONFIG = require("./common/utils/config-util");

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const { createClient } = require('redis');
const Redis = require("ioredis");
const entities = require("entities");
const emoji = require("node-emoji");
const MESSAGEUTIL = require("./common/utils/message-util");
const RESPONSEHANDLER = require("./common/middlewares/response-handler");
const { createAdapter } = require("@socket.io/redis-adapter");
global.mongoObject = {}

// below creds are used for bedrock 
// <REMOVED DUE TO SECURITY ISSUE>
/******************* ROUTES IMPORTS ***************************/

const { AUTHENTICATION } = require("./microservice/authentication/routes");
const {  SCORECARDROUTE } = require("./microservice/analytics_and_reporting/routes");

// GOOGLE TTS credentials path configuration
let CREDENTIALS_PATH;
  CREDENTIALS_PATH = path.resolve(__dirname, `${CONFIG.get('google_tts_creds')}`);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = CREDENTIALS_PATH;

/******************* HTML SANITIZATION UTILITY *****************************/

/**
 * Recursively sanitizes HTML content in objects, arrays, and strings
 * @param {*} data - The data to sanitize
 * @returns {*} - Sanitized data
 */
function sanitizeData(data) {
  // Sanitization options - configure as needed
  const sanitizeOptions = {
    allowedTags: [], // Remove all HTML tags
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
    allowedIframeHostnames: []
  };

  if (typeof data === 'string') {
    let sanitized = sanitizeHtml(data, sanitizeOptions);
    return entities.decode(sanitized);
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (data !== null && typeof data === 'object') {
    const sanitized = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = sanitizeData(data[key]);
      }
    }
    return sanitized;
  }

  return data;
}

const SANITIZATION_BYPASS_PATHS = ['/cartesia/dictionaries'];
/**
 * Middleware to sanitize request body
 */
function htmlSanitizationMiddleware(req, res, next) {
  try {
    const requestPath = req.originalUrl || req.path || '';
    if (SANITIZATION_BYPASS_PATHS.some((p) => requestPath.includes(p))) {
      return next();
    }
    if (req.body && typeof req.body === 'object') {
      // Sanitize the entire req.body recursively
      req.body = sanitizeData(req.body);

      // // Special handling for query parameter as requested
      // if (req.body.query) {
      //   req.body.query = sanitizeData(req.body.query);
      // }
    }

    // // Also sanitize query parameters from URL
    // if (req.query && typeof req.query === 'object') {
    //   req.query = sanitizeData(req.query);
    // }

    next();
  } catch (error) {
    console.error('Error during HTML sanitization:', error);
    return res.status(400).send({
      response: MESSAGEUTIL.error().ERROR_OCCURRED,
      error: {
        name: 'SANITIZATION_ERROR',
        message: 'Invalid input data format',
        code: 400,
      },
    });
  }
}

(() => {
  configur_cors();
  configur_parser();
  config_responsehandler();
  config_static();
  configur_routes();
  globalErrorHandler();
  // connectRedisClients(server)
})();

function configur_cors() {
  const allowedOrigins = [
    'http://localhost:4200',
    `https://${CONFIG.get("agentic:server:env_name")}.ghixqa.com`
  ];

  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));
}

function config_static() {
  app.use(express.static(__dirname));
}

function configur_parser() {
  app.use(express.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
  app.use((req, res, next) => {
    bodyParser.json({ limit: "10mb" })(req, res, (err) => {
      if (err) {
        return res.status(400).send({
          response: MESSAGEUTIL.error().ERROR_OCCURRED,
          error: {
            name: MESSAGEUTIL.error().ERROR_OCCURRED,
            message: MESSAGEUTIL.response().BAD_REQUEST,
            code: 400,
          },
        });
      }
      next();
    });
  });
  app.use(bodyParser.json({}));

  // Add HTML sanitization middleware after body parsing
  app.use(htmlSanitizationMiddleware);
}

function configur_routes() {
  // authentication microservice routes
  app.use("/agentic/auth/api/v1/authentication", AUTHENTICATION);
  // report microservice routes
  app.use("/agentic/reporting/api/v1/scorecard", SCORECARDROUTE);

  // health check route
  app.get('/agentic/api/v1/health-check', (req, res) => {
    res.status(200).send({
      response: 'SUCCESS',
      data: { status: 'UP' },
      error: null
    });
  });
}

function config_responsehandler() {
  app.use(new RESPONSEHANDLER(CONFIG).responseMiddleware);
}


/*******************************FILE UPLOAD PATH*****************************/

const folderPath = path.join(__dirname, "uploads");

// Check if the folder exists
fs.access(folderPath, fs.constants.F_OK, (err) => {
  if (err) {
    // Folder doesn't exist, create it
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating folder:", err);
      } else {
        console.log('Folder "Uploads" created successfully');
      }
    });
  }
});

/***********************  global Error Handler ******************************/

function globalErrorHandler() {
  app.use((err, req, res, next) => {
    if (!err) {
      return next();
    }
    console.log(emoji.get('warning'),emoji.get('warning'),emoji.get('warning'),emoji.get('warning'),emoji.get('exploding_head'), emoji.get('negative_squared_cross_mark'),"error captured at global error handler::::", err);
    res.status(err.status || 500).send({
      response: err.response?.data?.error || MESSAGEUTIL.response().FAILED,
      error: {
        name: err.response?.data?.error
          ? err.response.data.error
          : err.code
            ? err.code : MESSAGEUTIL.error().ERROR_OCCURRED,
        message: err.response?.data?.message
          ? err.response.data.message
          : err.inner
            ? err.inner.message : err.response?.data?.error_description ? err.response?.data?.error_description :
              err.response?.data?.errorMessage ? err.response?.data?.errorMessage : err.message ? err.message
                : MESSAGEUTIL.error().ERROR_MESSAGE,
        code: err.response?.status
          ? err.response.status
          : err.status
            ? err.status
            : 500,
        target: err.target || "",
        innererror: err.innererror || {},
      },
    });
  });
}

module.exports = { server };
