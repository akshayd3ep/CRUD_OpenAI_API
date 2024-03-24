const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios');
const dbConnection = require('./config/settings')
const noteController = require('./controllers/notes')

dotenv.config()

dbConnection()

const OpenAI = require('openai');

const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

app = express()
app.use(express.json())

app.use("/notes",noteController)

app.post("/generate-text", async (req, res, next) => {
    const { prompt, model = 'gpt-3.5-turbo', max_tokens = 1024, temperature = 0.7, top_p = 1 } = req.body;

    try {
        if (!prompt) {
            throw new Error('Please provide a prompt');
        }

        const response = await openai.chat.completions.create({
            model: model,
            messages: [{ "role": "user", "content": prompt }],
            max_tokens: max_tokens
        });

        console.log(response);
        const response_data = response.choices[0].message.content;

        res.json({ status: 200, data: { prompt: prompt, GeneratedText: response_data }, message: "Data retrieved" });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "Error generating text: " + error.message });
    }
});


app.use((req,res,next) =>{
    const erro = Error('Not Found 404');
    erro.status = 404
    next(erro)
})
app.use((error,req,res,next) =>{
    res.status(error.status || 500)
    res.json({message:{error:error.message}})
})



module.exports = app
