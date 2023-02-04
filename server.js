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
    res.send("form submit works")
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