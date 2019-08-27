var express = require("express");
var app = express();

var locations = ["living room", "kitchen", "bedroom", "garage", "bathroom", "basement"];


app.get("/location/1/status", (_req, res, _next) => {
    res.json(locations[Math.floor(Math.random() * locations.length)]);
});

app.listen(8081, () => {
    console.log("Location service running on port 4000");
});