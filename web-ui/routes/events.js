var tokens = require('../db/tokens');
var request = require('request');
var conf = require('../conf/event_conf.js');


var auth_type = conf.auth_type;

function router(_application_conf, _idm_conf, router) {

    router.route('/fallevent').post(function (req, res) {
        username = req.query.username
        tokens.find(username + '!@!' + auth_type, function (_error, token) {
            agile = require('agile-sdk')({
                api: conf.api_url,
                idm: conf.idm_url,
                token: token
            });
            agile.policies.pap.set({
                entityId: username + '!@!' + auth_type,
                entityType: 'user',
                field: 'location',
                policy: conf.policies['fall']
            }).then(function (r) {
                return res.status(200).send({
                    text: 'Sucessfully set status to fall'
                });
            }).catch(function (err) {
                return res.status(err.response.status).send({
                    text: err.response.data.error
                })
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

            agile.policies.pap.set({
                entityId: username + '!@!' + auth_type,
                entityType: 'user',
                field: 'location',
                policy: conf.policies['normal']
            }).then(function (r) {
                return res.status(200).send({
                    text: 'Sucessfully set status to normal'
                });
            }).catch(function (err) {
                return res.status(err.response.status).send({
                    text: err.response.data.error
                });
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
                console.log('user created ');
                return res.status(201).send({
                    text: "Created user doctor successfully"
                });
            }).catch(function (err) {
                return res.status(err.response.status).send({
                    text: err.response.data.error
                });
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
                    text: "Deleted user doctor successfully"
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
                    entityId: 'patient!@!local',
                    entityType: 'user',
                    field: 'location',
                    method: 'read'
                }]);
            }).then(function (results) {
                console.log('pdp results' + JSON.stringify(results));
                if (results[0])
                    return res.status(200).send({
                        text: req.query.username + " can read the location field"
                    });
                else
                    return res.status(403).send({
                        text: req.query.username + " can't read the location field"
                    });
            }).catch(function (err) {
                console.log(err);
                return res.status(err.response.status).send({
                    text: err.response.data.error
                });
            });
        });
    });



    router.route('/location').post(function (req, res) {
        username = req.query.username;
        tokens.find(username, function (_error, token) {
            request({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + token
                },
                json: true,
                uri: 'http://localhost:8080/location/1/status'
            }, function (error, response, body) {
                if (response.statusCode == 200) {
                    returnText = body.split(',', 2);
                    return res.status(200).send({
                        text: "The current position of the patient is: " + returnText[1]
                    });
                } else {
                    returnText = body.split(',', 2);
                    return res.status(response.statusCode).send({
                        text: returnText[1]
                    });
                }

            })
        });
    });

    return router;
}
module.exports = router;