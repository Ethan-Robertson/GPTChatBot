const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = 'API KEY HERE';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', async (req, res) => {
    const userInput = req.body.message;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant named LearnBot.' },
                    { role: 'user', content: userInput }
                ],
                max_tokens: 150,
                temperature: 0.7,
                top_p: 1,
                n: 1
            })
        });

        const data = await response.json();
        console.log(data);

        if (data.choices && data.choices.length > 0) {
            const learnBotResponse = data.choices[0].message.content.trim();
            res.json({ response: learnBotResponse });
        } else {
            console.log('API response does not contain choices:', data);
            res.json({ response: 'Sorry, I could not understand that. Could you please rephrase?' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
