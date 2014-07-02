module.exports = {
  html: [
    "<div class=\"yahoo_quoted\">",
    "<div class=\"gmail_extra\">",
  ],

  text: [
    /\n?De\s*:\s*/i, // Outlook Web App
    /\n?-{2,}\s*[a-z0-9 ]*(forward)|(original)[a-z0-9 ]*\s*-{2,}/i, // Gmail
    /\n?From\s*:\s/i,
    /\n[_-]{4,}/,
    /\non(.+)wrote:\n/i,
  ]
};