const express = require('express');
const app = express();
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const bodyParser = require('body-parser');
const https = require("https");
const fs = require("fs");
const dir = './pics';
const axios = require('axios');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(bodyParser.json());
var historyChatGPT = [];

const apiKey = 'YOUR_STABLEDIFFUSIONAPI.COM_API_KEY';
const numberOfPics = '1' //Limitation of 4 maximum image generation per call observed.

app.get('/pics/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'pics', imageName);
    res.sendFile(imagePath);
});

app.post('/process_user_input_sdiff', async (req, res) => {
    try {
        console.log('');
        console.log('');
        console.log('Generating Images....');
        console.log('');
        const prompt = req.body.input;
        const bodyInfo = JSON.stringify(
            {
                "key": apiKey,
                "prompt": prompt,
                "negative_prompt": "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
                "width": "512",
                "height": "512",
                "samples": numberOfPics,
                "num_inference_steps": "30",
                "safety_checker": "no",
                "enhance_prompt": "yes",
                "seed": null,
                "guidance_scale": 7.5,
                "webhook": null,
                "track_id": null
            });
        const options = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const result = await axios.post('https://stablediffusionapi.com/api/v3/text2img', bodyInfo, options);
        const picAmount = result.data.output.length;
        let images = [];
        for (let i = 0; i < picAmount; i++) {
            let number = i + 1;
            const imageUrl = `${number}.png`; // URL gambar dengan increment angka
            await downloadAndReplaceImage(result.data.output[i], `${number}.png`);
            images.push(imageUrl);
            console.log('Generated Pic ' + number);
        }
        res.json({ images });
        //res.sendFile(path.join(__dirname, 'pics', images[images.length - 1]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function downloadAndReplaceImage(url, filename) {
    return new Promise((resolve, reject) => {
      const tempImagePath = path.join(__dirname, 'pics', 'temp.png');
      const newImagePath = path.join(__dirname, 'pics', filename);
  
      const file = fs.createWriteStream(tempImagePath);
      const request = https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
          file.close(() => {
            if (fs.existsSync(newImagePath)) {
              fs.unlinkSync(newImagePath);
            }
            fs.renameSync(tempImagePath, newImagePath);
            resolve();
          });
        });
      });
  
      request.on('error', function (err) {
        fs.unlink(tempImagePath, () => {
          reject(err);
        });
      });
    });
  }

async function getData(image, filename) {
    await download(image, filename)
}

async function download(url, filename) {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        if (fs.existsSync(filename)) {
            return;
        } else {
            let request = https.get(url, function (response) {
                if (response.statusCode === 200) {
                    let file = fs.createWriteStream(dir + '/' + filename);
                    response.pipe(file);
                }
                request.setTimeout(12000, function () {
                    request.abort();
                });
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// CHATGPT START

app.post('/process_user_input_gpt', (req, res) => {
    (async () => {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        //let history = [];
        const userInput = req.body.input;
        if (userInput.toUpperCase() === "#FLUSH") {
            historyChatGPT = [];
            return;
        }
        const messages = [];
        for (const [input_text, completion_text] of historyChatGPT) {
            messages.push({ role: "user", content: input_text });
            messages.push({ role: "assistant", content: completion_text });
        }

        messages.push({ role: "user", content: userInput });
        try {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
            });
            const completion_text = completion.data.choices[0].message.content;
            const botResponse = `${completion_text}`;
            res.json({ answer: botResponse });
            historyChatGPT.push([userInput, completion_text]);
            const userInputAgain = userInput;
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }
        console.log(historyChatGPT);
    })();
});

app.post('/reset_array', (req, res) => {
    // Mengosongkan array di sisi backend
    historyChatGPT = [];
    res.sendStatus(200); // Menanggapi permintaan dengan status 200 OK
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});