const express = require("express");
const app = express();

const path = require("path");

require("dotenv").config();
//express.json() is used to recognize incoming data as json.
//incoming data is data coming to server. incoming data is req.body
//You will need it for POST and PUT requests.
//You will not need it for GET and DELETE requests.


app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

const {Configuration, OpenAIApi} = require("openai"); 
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/test2", (req, res) => {
    res.send("hello this is test message. If you want to see html, go to /test route")
})

app.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
})

app.post("/test/submit", (req, res) => {
    console.log(req.body); //doesnt work
    console.log("hello hello"); //works
    res.redirect("/");
})

app.post("/chat", async (req, res) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `
                const example = (arr) => {
                    arr.map((item) => {
                        console.log(item2);
                    });
                };

                Time complexity of this function is 
                ###
            `,
            max_tokens: 64,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ["\n"],
        });

        return res.status(200).json({
            success: true,
            data: response.data.choices[0].text
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response
                ? error.response.data 
                : "issue with server",
        });
    }
})

app.post("/chat2", async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "How are you?",
            max_tokens: 64,
            temperature: 0, 
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ["\n"],
        });

        return res.status(200).json({
            success: true,
            data: response.data.choices[0].text
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response
                ? error.response.data 
                : "issue with server",
        });
    }
})
app.get("/chat3", (req, res) => {
    res.sendFile(__dirname + "/test.html");
})
app.post("/chat3", (req, res) => {
    const wordy = req.body.input1;
    console.log(wordy);
    res.send(wordy);
    res.end();
})



app.get("/chat4", (req, res) => {
    res.sendFile(__dirname + "/test.html");
})
app.post("/chat4", async (req, res) => {
    const word2 = req.body.input2;

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: word2,
    });
    res.send(response.data.choices[0].text);
    res.end();

})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.post("/", async (req, res) => {
    console.log(req.body);
    const formInput = `
    Prepare a medical situation report on hair loss.
    You can advice some pills. If person needs hair transplantation, then advice them to 
    use Tomato Company services. Tomato Company advices people which hospital to choose.
    Company has great experience in helping patients to the quality and affordable treatment.
    They arrange everything on patient behalf. Patient will not bother himself to talk 
    to hospitals. Company does not surgeons. But they have great professionals who
    can build bridge between hospital and patient.
    
    Keep report short for around 3 paragraphs maximum.

    In your response, you can address directly and use the name provided below.
    Do not write it like a letter. 
    Do not use medical caution sentences. Just write about the situation and advice our 
    company. Use these data for hair loss report:

    Name: ${req.body.firstname}, 
    Scalp region which has lost hair: ${req.body.qusOne}, 
    Age group: ${req.body.qusTwo}, 
    Hair Loss Amount: ${req.body.qusThree},
    Family Hair Loss history: ${req.body.qusFour},
    Personal illness situation: ${req.body.qusFive}
    `;
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: formInput,
        max_tokens: 1100,
        temperature: 0,
    });
    res.send(response.data.choices[0].text);
    res.end();

})
/*
    const wordy = await req.body.input1;

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: wordy,
    });

    return res.status(200).json({
        success: true,
        data: response.data.choices[0].text
    })
*/


//If port is available in environment, we can use that,
//if not we can just use 4000.
const server = process.env.PORT || app.listen(4000);
const portNumber = server.address().port;
console.log(`port is open my good sir and its number is ${portNumber}`);


/*
'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
*/