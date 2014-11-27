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

  concurrency: process.env.EMBED_MAIL_CONCURRENCY || defaultConcurrency,

  separators: require('./separators.js'),
  appName: process.env.APP_NAME || "embedmail-hydrater",
  redisURL: process.env.REDIS_URL
};
