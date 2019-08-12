var conf = require('./conf/oauth-client-conf');
var express = require('express');
var fs = require('fs');
var https = require('https');
var request = require('request');
var passport = require('passport');
require('./passport/serializer');
require('./passport/strategy')(conf.oauth2);

var app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/css/'));
app.use('/toastr', express.static(__dirname + '/node_modules/toastr/build/'))



app.use(passport.initialize());
app.use(passport.session());
app.use("/", require('./routes/')(conf.oauth2, conf.idm));


var options = {
    key: fs.readFileSync(conf.site.tls.key),
    cert: fs.readFileSync(conf.site.tls.cert)
};
app.listen(conf.site.http_port);
https.createServer(options, app).listen(conf.site.https_port);

console.log("- Demo started -");
console.log("listening on port http://localhost:" + conf.site.http_port + " for http ");
console.log("listening on port https://localhost:" + conf.site.https_port + " for https ");

module.exports = app;