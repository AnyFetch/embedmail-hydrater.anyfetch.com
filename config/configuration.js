/**
 * @file Defines the hydrater settings.
 */

// nodeEnv can either be "development" or "production"
var nodeEnv = process.env.nodeEnv || "development";
var defaultPort = 8000;


// Number of instance to run simultaneously per cluster
var defaultConcurrency = 1;

if(nodeEnv === "production") {
  defaultPort = 80;
}

// Exports configuration
module.exports = {
  env: nodeEnv,
  port: process.env.PORT || defaultPort,

  concurrency: process.env.CONCURRENCY || defaultConcurrency,
  tasksPerProcess: process.env.TASKS_PER_PROCESS,

  separators: require('./separators.js'),
  appName: process.env.APP_NAME || "embedmail-hydrater",
  redisUrl: process.env.REDIS_URL,

  opbeat: {
    organizationId: process.env.OPBEAT_ORGANIZATION_ID,
    appId: process.env.OPBEAT_APP_ID,
    secretToken: process.env.OPBEAT_SECRET_TOKEN
  }
};
