import * as cheerio from "cheerio";
import { BASE_URL } from "./var";


const injectBootstrap = ($: cheerio.CheerioAPI) => {
    $('head').append(`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="icon" type="image/x-icon" href="${BASE_URL}/favicon.ico">
    `);
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>')
}

const injectHeader = ($: cheerio.CheerioAPI) => {
    $('body').append(`
<header class="my-4">
    <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
            <h1 class="text-center">${$('title').text()}</h1>
        </div>
        <div class="col-2"></div>
    </div>
</header>
`);
}

export const injectHTML = (html: string) => {
    const $ = cheerio.load(cheerio.load(html).html());

    const currentHTML = $('body').html()!;

    $('body').children().remove();

    injectHeader($);

    $('body').append(`<div id="container" class="container px-4 pt-4">
        <div class="row">
            <div class="col-2"></div>
            <div class="col-8">
                <div id="content"></div>
            </div>
            <div class="col-2"></div>
        </div>

        
    </div>`);

    const container = $('#content');

    container.append(currentHTML);

    // Do it last
    injectBootstrap($);

    return $.html();
}