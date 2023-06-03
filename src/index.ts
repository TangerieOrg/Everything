import express from "express";
import dotenv from 'dotenv';
import { everythingRoute } from "./core";

dotenv.config();

const app = express();

app.set('trust proxy', true)

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const everything = express();

everything.post("*", everythingRoute);
everything.get("*", everythingRoute);

app.use(process.env.BASE_URL ?? '', everything);


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Listening on port", port);
});