module.exports = {
    "oauth2": {
        authorizationURL: 'http://localhost:3000/oauth2/dialog/authorize',
        tokenURL: 'http://localhost:3000/oauth2/token',
        clientID: "DemoClientRom",
        clientSecret: "spiderman3000",
        callbackURL: "http://localhost:4444/demo/callback",
        userInfoUrl: 'http://localhost:3000/oauth2/api/userinfo'
    },
    "site": {
        "tls": {
            "key": "./certs/server.key",
            "cert": "./certs/server.crt"
        },
        "https_port": 1445,
        "http_port": 4444
    },
    "idm": {
        "host": "localhost",
        "port": 3000,
        "protocol": "http"
    }
};