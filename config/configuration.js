/**
 * @file Defines the hydrater settings.
 */

// node_env can either be "development" or "production"
var node_env = process.env.NODE_ENV || "development";
var default_port = 8000;


// Number of instance to run simultaneously per cluster
var default_concurrency = 1;

if(node_env === "production") {
  default_port = 80;
}

// Exports configuration
module.exports = {
  env: node_env,
  port: process.env.PORT || default_port,

  concurrency: process.env.EMBED_MAIL_CONCURRENCY || default_concurrency,

  separators_html: [
    "<div class=\"yahoo_quoted\">",
    "<div class=\"gmail_extra\">",
  ],

  separators_text: [
    /\n?De\s*:\s*/i, // Outlook Web App
    /-{2,}\s*[a-z0-9 ]*(forward)|(original)[a-z0-9 ]*\s*-{2,}/i, // Gmail
    /\n?From\s*:\s/i,
    /\n[_-]{4,}/,
    /\non(.+)wrote:\n/i,
  ]
};
