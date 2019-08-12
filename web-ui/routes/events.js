var login = require('connect-ensure-login');
var tokens = require('../db/tokens');
var request = require('request');
var conf = require('../conf/event_conf.js');


var auth_type = conf.auth_type;

function router(application_conf, idm_conf, router) {

    router.route('/fallevent').post(function (req, res) {
        username = req.query.username
        tokens.find(username + '!@!' + auth_type, function (_error, token) {
            agile = require('agile-sdk')({
                api: conf.api_url,
                idm: conf.idm_url,
                token: token
            });

            agile.idm.user.get(username, auth_type).then(function () {
                agile.policies.pap.set({
                    entityId: username + '!@!' + auth_type,
                    entityType: 'user',
                    field: 'location',
                    policy: conf.policies['fall']
                });

                return res.status(200).send({
                    text: 'Sucessfully set status to fall'
                });
            }).catch(function (err) {
                console.log(err);
                return res.status(err.response.status).send(err.response.data.error);
            });
        });
    });

    router.route('/normalevent').post(function (req, res) {
        username = req.query.username
        tokens.find(username + '!@!' + auth_type, function (_error, token) {
            agile = require('agile-sdk')({
                api: conf.api_url,
                idm: conf.idm_url,
                token: token
            });

            agile.idm.user.get(username, auth_type).then(function () {
                agile.policies.pap.set({
                    entityId: username + '!@!' + auth_type,
                    entityType: 'user',
                    field: 'location',
                    policy: conf.policies['normal']
                });

                return res.status(200).send({
                    text: 'Sucessfully set status to normal'
                });
            }).catch(function (err) {
                console.log(err);
                return res.status(err.response.status).send(err.response.data.error);
            });
        });
    });

    router.route('/createdoc').post(function (req, res) {
        username = req.query.username
        tokens.find(username + '!@!' + auth_type, function (_error, token) {
            agile = require('agile-sdk')({
                api: conf.api_url,
                idm: conf.idm_url,
                token: token
            });

            agile.idm.user.getCurrentUserInfo().then(function (_data) {
                return agile.idm.user.create(req.query.username, auth_type, {
                    'role': 'doctor',
                    'password': 'secret'
                });
            }).then(function (user) {
                console.log('user created ' + JSON.stringify(user));
                return res.status(201).send({
                    text: "Created doc successfully"
                });
            }).catch(function (err) {
                console.log(err);
                return res.status(err.response.status).send(err.response.data.error);
            });
        });
    });


    router.route('/deletedoc').post(function (req, res) {
        username = req.query.username
        tokens.find(username + '!@!' + auth_type, function (_error, token) {
            agile = require('agile-sdk')({
                api: conf.api_url,
                idm: conf.idm_url,
                token: token
            });

            agile.idm.user.getCurrentUserInfo().then(function (_data) {
                return agile.idm.user.delete(req.query.username, auth_type)
            }).then(function (_deletions) {
                console.log('user deleted');
                return res.status(200).send({
                    text: "Deleted doc successfully"
                });
            });
        });
    });

    router.route('/checkpolicy').post(function (req, res) {
        username = req.query.username
        tokens.find(username, function (_error, token) {
            agile = require('agile-sdk')({
                api: conf.api_url,
                idm: conf.idm_url,
                token: token
            });

            agile.idm.user.getCurrentUserInfo().then(function (data) {
                return agile.policies.pdp.evaluate([{
                    entityId: data.id,
                    entityType: 'user',
                    field: 'location',
                    method: 'read'
                }]);
            }).then(function (results) {
                console.log('pdp results' + JSON.stringify(results));
                if (results[0])
                    return res.status(200).send({
                        text: req.query.username + " can read the checked field"
                    });
                else
                    return res.status(403).send({
                        text: req.query.username + " can't read the checked field"
                    });
            }).catch(function (err) {
                console.log(err);
                return res.status(err.response.status).send(err.response.data.error);
            });
        });
    });



    router.route('/location').post(function (req, res) {
        username = req.query.username
        tokens.find(username + '!@!' + auth_type, function (_error, token) {
            request({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + token
                },
                uri: 'http://localhost:8080/location/1/status'
            }, function (error, response, body) {
                console.log(response);
                if (!error && response.statusCode == 200) {
                    console.log(body) // Print the google web page.
                }
            })
        });
    });

    return router;
}
module.exports = router;