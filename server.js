const express = require("express");
const app = express();

const path = require("path");

require("dotenv").config();
//express.json() is used to recognize incoming data as json.
//incoming data is data coming to server. incoming data is req.body
//You will need it for POST and PUT requests.
//You will not need it for GET and DELETE requests.
app.use(express.json())

const {Configuration, OpenAIApi} = require("openai"); 
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
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
            prompt: `
                {prompt}

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

//If port is available in environment, we can use that,
//if not we can just use 4000.
const server = process.env.PORT || app.listen(4000);
const portNumber = server.address().port;
console.log(`port is open my good sir and its number is ${portNumber}`);