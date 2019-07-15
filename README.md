# Demo for Agile-Security
This repo contains all components for a scenario related to e-health.

## Web-UI
Before you start the Web-UI you need to adjust the core config of the backend security manager.  
The complete `agile-idm-core-conf.js` demo config file can be found in the `configs` folder inside this repository.  
To start the web ui, first switch to the `web-ui` folder.  
Then you need to add your token from the backend security manager to the `package.json` config field.  
The config part looks like the following:
```json
"config": {
    "token": "<insert-your-token-here>"
},
```

Now you are ready to go:
```shell
$ npm install
$ npm start

> web-ui@1.0.0 start /Users/fklement/Code/semiotics/fklement/agile-security-demo
> export TOKEN=$npm_package_config_token; node index.js

Demo started on http://localhost:4444
```