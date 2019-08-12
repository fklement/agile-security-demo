var passport = require('passport');
var express = require('express');
var login = require('connect-ensure-login');
var tokens = require('../db/tokens');


function router(conf, idm_conf) {
    var router = express.Router();
    require('./oauth2-client')(conf, idm_conf, router);
    require('./events')(conf, idm_conf, router);

    return router;
}
module.exports = router;