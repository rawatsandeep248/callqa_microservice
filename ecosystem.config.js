module.exports = {
    "apps": [
      {
        "name": "app",
        "script": "./backend/microservice/analytics_and_reporting/main.js",
        "instances": 4,
        "autorestart": true,
        "watch": false,
        "log_date_format": "YYYY-MM-DD HH:mm Z",
        "time": true,
        "env": {
          "PORT": 6000,
          "NODE_ENV": "production"
        },
      }
    ]
  }