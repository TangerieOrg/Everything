import express from "express";
import dotenv from 'dotenv';
import { everythingRoute } from "./core";
import path from "path";
import { BASE_URL } from "./var";

dotenv.config();



const app = express();

app.set('trust proxy', true)

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    if(req.url.replace("/", "").trim().length === 0) {
        let contentsURL = BASE_URL;
        if(!contentsURL.endsWith("/")) contentsURL += '/';
        contentsURL += 'contents';
        res.redirect(contentsURL)
    } else next();
});

app.use((req, res, next) => {
    if(req.url.endsWith(".js")) res.status(404).send("");
    else if(req.url.endsWith("favicon.ico")) res.sendFile(path.join(__dirname, "..", "assets", "favicon.ico"))
    else next();
});

app.use((req, res, next) => {
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    console.log(`[${ip}] ${req.url}`);
    next();
});

app.post("*", everythingRoute);
app.get("*", everythingRoute);




const port = process.env.EXPRESS_PORT ?? 80;

app.listen(port, () => {
    console.log("Listening on port", port);
});