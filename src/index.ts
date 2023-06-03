import express, { Request } from "express";
import dotenv from 'dotenv';
import cookieMiddleware from "cookie-parser";
import { Configuration, OpenAIApi } from "openai";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.set('trust proxy', true)

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieMiddleware(process.env.COOKIE_SECRET || "cookie_secret"));


const aiConfig = new Configuration({
    apiKey: process.env.OPENAI_KEY
});

const openai = new OpenAIApi(aiConfig);


const port = process.env.PORT || 8080;

const createPrompt = (path: string, extraData = "") => `Create a response document with content that matches the following URL path: 
\`${path}\`

The first line is the Content-Type of the response.
The following lines is the returned data.
In case of a html response, add relative href links with to related topics.
${extraData}

Content-Type:
`;

const createResponse = async (path: string, extraData = "") => {
    const data = (await openai.createCompletion({
        model: "text-davinci-003",
        prompt: createPrompt(path, extraData),
        temperature: 0.7,
        max_tokens: 512,
        n: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    })).data.choices[0].text!;

    const lines = data.split("\n");
    const contentType = lines.shift();
    const text = lines.join("\n");

    return {
        contentType, text
    }
}

app.post("*", async (req, res) => {
    let extraData = "";
    for(const key in req.body) {
        extraData += `${key}: ${req.body}\n`;
    }

    const { contentType, text } = await createResponse(req.url, extraData);

    try {
        res.setHeader('Content-Type', contentType as string);
    } catch { }

    res.send(text);
})

app.get("*", async (req, res) => {
    const { contentType, text } = await createResponse(req.url);

    try {
        res.setHeader('Content-Type', contentType as string);
    } catch { }

    res.send(text);
})

app.listen(port, () => {
    console.log("Listening on port", port);
});