var passport = require('passport');
var login = require('connect-ensure-login');
var tokens = require('../db/tokens');
var request = require('request');

function router(conf, idm_conf, router) {
    /*
     Routes for Oauth2 endpoint as client
    */
    router.route('/demo').get(passport.authenticate('oauth2'));

    router.route('/demo/callback').get(passport.authenticate('oauth2', {
            failureRedirect: '/login'
        }),

        function (req, res) {
            console.log(req.user.id);
            res.render('demo', {
                title: 'Demo Web UI',
                userID: req.user.id
            })
        });

    router.route('/').get(login.ensureLoggedIn('/demo/'), function (req, res) {
        res.render('demo', {
            title: 'Demo W2eb UI',
            userID: req.user.id
        })
    });

    router.route('/logout').get(login.ensureLoggedIn('/demo/'), function (req, res) {
        var url = idm_conf.protocol + "://" + idm_conf.host + ":" + idm_conf.port;
        tokens.find(req.user.id, function (error, token) {
            var options = {
                url: url + '/oauth2/logout',
                headers: {
                    'Authorization': 'bearer ' + token,
                    'User-Agent': 'user-agent',
                    'Content-type': 'application/json'
                }
            };
            tokens.delete(req.user.id, function () {
                req.logout();
                request.get(options, function (error, response, body) {
                    console.log("status code after logging out " + response.statusCode);
                    res.render('index');
                });
            });

        });

    });

    return router;
}
module.exports = router;