const express = require('express'), app = express();
const url = require('openurl');

app.use(express.static(__dirname));
app.listen(process.env.PORT || 8080);

if (!process.env.PORT) {
    url.open('http://localhost:8080');
}