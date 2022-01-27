const express = require('express');
const helmet = require("helmet");

const app = express();

app.use(helmet());

app.use(helmet.hidePoweredBy());

// Sets "X-Frame-Options: DENY"
app.use(
  helmet.frameguard({
    action: "deny",
  })
);

// Sets "X-XSS-Protection: 0"
app.use(helmet.xssFilter());

// Sets "X-Content-Type-Options: nosniff"
app.use(helmet.noSniff());

// Sets "X-Download-Options: noopen"
app.use(helmet.ieNoOpen());

let maxAge = 90*24*60*60;

app.use(
  helmet.hsts({
    maxAge: maxAge,
    force: true,
  })
);

app.use(helmet.dnsPrefetchControl());

app.use(helmet.noCache());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'"],
      "script-src" : ["'self'", "'trusted-cdn.com'"],
    },
  })
);

module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
