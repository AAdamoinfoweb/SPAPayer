//server.js
console.log("Starting server")
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 8888;
const app = express();
app.use(favicon(__dirname + '/dist/main-frontend/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'dist/main-frontend')));
app.get('/ping', function (req, res) {
    return res.send('pong');
});
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist/main-frontend', 'index.html'));
});
app.listen(port);
console.log("Started server on port", port)
