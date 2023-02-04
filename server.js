const express = require("express");
const app = express();

const path = require("path");

app.get("/", (req, res) => {
    res.send("hello this is test message. If you want to see html, go to /test route")
})

app.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
})


const server = app.listen(4000);
const portNumber = server.address().port;
console.log(`port is open my good sir and its number is ${portNumber}`);