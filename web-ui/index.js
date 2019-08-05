var express = require('express');
var conf = require('./conf/event_conf.js');
var request = require('request');
var agile = require('agile-sdk')({
    api: conf.api_url,
    idm: conf.idm_url,
    token: process.env.TOKEN
})

var auth_type = conf.auth_type;
var app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/css/'));
app.use('/toastr', express.static(__dirname + '/node_modules/toastr/build/'))

// Index route
app.get('/', function (req, res) {
    res.render('index', {
        title: 'Demo Web UI'
    })
});

// Event routes
app.post('/fallevent', (req, res) => {
    setEvent(req, res, 'fall');
});

app.post('/normalevent', (req, res) => {
    setEvent(req, res, 'normal');
});

app.post('/createdoc', (req, res) => {
    agile.idm.user.getCurrentUserInfo()
        .then(function (data) {
            console.log('you are logged in as: ' + JSON.stringify(data));
            return agile.idm.user.create(req.query.username, auth_type, {
                'role': 'doctor',
                'password': 'secret'
            });
        }).then(function (user) {
            console.log('user created ' + JSON.stringify(user));
            return res.status(201).send("Created doc successfully");
        }).catch(function (err) {
            console.log(err);
            return res.status(err.response.status).send(err.response.data.error);
        });
});

app.post('/deletedoc', (req, res) => {
    agile.idm.user.getCurrentUserInfo()
        .then(function (data) {
            console.log('you are logged in as: ' + JSON.stringify(data));
            return agile.idm.user.delete(req.query.username, auth_type)
        }).then(function (deletions) {
            console.log('user deleted');
            return res.status(200).send("Deleted doc successfully");
        });
});

app.post('/checkpolicy', (req, res) => {
    agile.idm.user.getCurrentUserInfo()
        .then(function (data) {
            console.log('you are logged in as: ' + JSON.stringify(data));
            return agile.policies.pdp.evaluate([{
                entityId: req.query.username + '!@!' + auth_type,
                entityType: 'user',
                field: 'location',
                method: 'read'
            }]);
        }).then(function (results) {
            console.log('pdp results' + JSON.stringify(results));
            if (results[0])
                return res.status(200).send(req.query.username + " can read the checked field");
            else
                return res.status(403).send(req.query.username + " can't read the checked field");
        }).catch(function (err) {
            console.log(err);
            return res.status(err.response.status).send(err.response.data.error);
        });
});

app.post('/location', (req, res) => {
    request({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'ZdpjeqfqJ4GQ8QtDIWisq6zGLxe3wEhhiNcKo4NecsaPqg7XXOQu9WTbdsOY1aDk'
        },
        uri: 'http://localhost:8080/location/1/status'
    }, function (error, response, body) {
        console.log(response);
        if (!error && response.statusCode == 200) {
            console.log(body) // Print the google web page.
        }
    })

});

/*
Short helper function to get a user by name.
Then the status attribute gets set to the corresponding event.
The last step is setting the correct defined policy.
*/
function setEvent(req, res, event) {
    username = req.query.username

    // .then(function (entity) {
    //     console.log(`\nSucessfully set status to ${event} for user:\n` + JSON.stringify(entity));
    //     return agile.idm.entity.setAttribute({
    //         entityId: username + '!@!' + auth_type,
    //         entityType: 'user',
    //         attributeType: 'status',
    //         attributeValue: event
    //     });
    // })

    agile.idm.user.get(username, auth_type).then(function () {
        agile.policies.pap.set({
            entityId: username + '!@!' + auth_type,
            entityType: 'user',
            field: 'location',
            policy: conf.policies[event]
        });

        return res.status(200).send(`Sucessfully set status to ${event}`);
    }).catch(function (err) {
        console.log(err);
        return res.status(err.response.status).send(err.response.data.error);
    });


}

// Start the server for the demo on port 4444
app.listen(4444, function () {});
console.log("Demo started on http://localhost:4444");