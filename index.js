var express = require('express')
var app = express();


app.get('/chat', async function (req, res) {
    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
        apiKey: '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',//process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(configuration);

    await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "what is web service",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    }).then(response => {
        const message = response.data.choices[0].text.trim();
        console.log('ChatGPT response:', message);
        res.send(message);
    }).catch(error => {
        console.error('Failed to generate ChatGPT response:', error);
        res.send('Failed to generate ChatGPT response');
    });

});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


