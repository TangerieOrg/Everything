import { Configuration, OpenAIApi } from "openai";
import { RequestParam, ResponseParam } from "./types";
import { injectHTML } from "./inject";

const aiConfig = new Configuration({
    apiKey: process.env.OPENAI_KEY
});

const openai = new OpenAIApi(aiConfig);


const createPrompt = (path: string, extraData = "") => `Create a response document with content that matches the following URL path: 
\`${path}\`

The first line is the Content-Type of the response.
The following lines is the returned data.
In case of a html response, add relative href links with to related topics.
${extraData}

Content-Type:
`;

const SAMPLE = {
    contentType: "text/html",
    text: `
    <html><head>
    <title>Everything Contents</title>
    </head>
    <body>
        <h1>Everything Contents</h1>
        <ul>
        <li><a href="/overview">Overview</a></li>
        <li><a href="/details">Details</a></li>
        <li><a href="/reviews">Reviews</a></li>
        </ul>
    </body></html>
`
}

const createResponse = async (path: string, extraData = "") => {
    const data = (await openai.createCompletion({
        model: "text-davinci-003",
        prompt: createPrompt(path, extraData),
        temperature: 0.7,
        max_tokens: 2048,
        n: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    })).data.choices[0].text!;

    const lines = data.split("\n");
    const contentType = lines.shift()!;
    const text = lines.join("\n");

    return {
        contentType, text
    }
}


export const everythingRoute = async (req: RequestParam, res: ResponseParam) => {
    let extraData = "";
    if (typeof req.body == "object" && Object.keys(req.body).length > 0) {
        for (const key in req.body) {
            extraData += `${key}: ${req.body}\n`;
        }
    }

    let { contentType, text } = await createResponse(req.url, extraData);

    try {
        res.setHeader('Content-Type', contentType as string);
    } catch { 
        res.setHeader('Content-Type', 'text/html');
        contentType = 'text/html';
    }

    if(contentType.includes('html')) {
        res.setHeader('Content-Type', 'text/html');
        res.send(injectHTML(text));
    } else {
        res.send(text);
    }
}
