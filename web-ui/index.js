var express = require('express');
var conf = require('./conf/event_conf.js');
var agile = require('agile-sdk')({
    api: conf.api_url,
    idm: conf.idm_url,
    token: process.env.TOKEN
})

var auth_type = conf.auth_type;
var app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));

// Index route
app.get('/', function (req, res) {
    res.render('index', {
        title: 'Demo Web UI'
    })
});

// Event routes
app.post('/event/fall', (req, _res) => {
    setEvent(req, 'fall');
});

app.post('/event/normal', (req, _res) => {
    setEvent(req, 'normal');
});

app.post('/event/location', (req, _res) => {});

/*
Short helper function to get a user by name.
Then the status attribute gets set to the corresponding event.
The last step is setting the correct defined policy.
*/
function setEvent(req, event) {
    username = req.query.username
    agile.idm.user.get(username, auth_type).then(function (entity) {
        console.log(`\nSucessfully set status to ${event} for user:\n` + JSON.stringify(entity));
        return agile.idm.entity.setAttribute({
            entityId: username + '!@!' + auth_type,
            entityType: 'user',
            attributeType: 'status',
            attributeValue: event
        });
    }).then(function () {
        return agile.policies.pap.set({
            entityId: username + '!@!' + auth_type,
            entityType: 'user',
            field: 'location',
            policy: conf.policies[event]
        });
    }).catch(function (err) {
        console.log(err);
    });
}

// Start the server for the demo on port 4444
app.listen(4444, function () {});
console.log("Demo started on http://localhost:4444");