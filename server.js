const express = require("express");
const app = express();
var http = require('http');
var fs = require('fs');
const path = require("path");

require("dotenv").config();




//express.json() is used to recognize incoming data as json.
//incoming data is data coming to server. incoming data is req.body
//You will need it for POST and PUT requests.
//You will not need it for GET and DELETE requests.
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

const {Configuration, OpenAIApi} = require("openai"); 
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.post("/", async (req, res) => {
    console.log(req.body);
    const formInput = `
    Prepare a medical situation report on hair loss.
    You can advice some pills. If person needs hair transplantation, then advice them to 
    use GotPerfect Company services. GotPerfect Company advices people which hospital to choose.
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


    fs.writeFileSync("./response.txt", response.data.choices[0].text);
    res.sendFile(path.join(__dirname, "./response.txt"));
    /*
    const data = response.data.choices[0].text;
    res.render('report', { data2: response.data.choices[0].text });

    const data = response.data.choices[0].text;
    res.render("report", {data});

    ---------

    const html = `<html><body><h1>${data}</h1></body></html>`;
    res.send(html);
    */
})


//If port is available in environment, we can use that,
//if not we can just use 4000.
const server = process.env.PORT || app.listen(4000);
const portNumber = server.address().port;
console.log(`port is open my good sir and its number is ${portNumber}`);