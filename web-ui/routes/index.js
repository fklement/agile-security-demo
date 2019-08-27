var express = require('express');

function router(conf, idm_conf) {
    var router = express.Router();
    require('./oauth2-client')(conf, idm_conf, router);
    require('./events')(conf, idm_conf, router);

    return router;
}
module.exports = router;