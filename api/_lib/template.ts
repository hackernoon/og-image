import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

marked.setOptions({ breaks: true })

const rglr = readFileSync(`${__dirname}/../_fonts/HackerNoonV1-Regular.woff2`).toString('base64');

function getCss(theme: string, fontSize: string) {
    let background = '#00ff00';
    let foreground = 'black';
    let radial = 'lightgray';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
        radial = 'dimgray';
    }
    return `
    @font-face {
        font-family: 'Hacker';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }


    code {
        color: #D400FF;
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .bordered img {
        box-shadow: rgb(0, 0, 0) 0px 0.2em,
                    rgb(0, 0, 0) 0px -0.2em,
                    rgb(0, 0, 0) 0.2em 0px,
                    rgb(0, 0, 0) -0.2em 0px;
    }

    .logo {
        margin: 0 75px;
    }

    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .sponsor {
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
    }

    .sponsor .description {
        font-family: 'Hacker', sans-serif;
        font-size: 22px;
        margin-bottom: 6px;
    }

    .sponsor img {
        height: 100px;
    }

    .plus {
        color: #000000;
        font-size: 72px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .heading {
        font-family: 'Hacker', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }
    
    .background-image-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
    }

    .background-image {
        width: 100%;
        height: auto;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights, nominee, category } = parsedReq;

    let backgroundImageUrl = `https://noonies.tech/${category.toLowerCase()}.jpg`;

    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="background-image-wrapper">
            <img class="background-image" src="${backgroundImageUrl}" />
        </div>
        
        <div class="content-container">
            <div class="heading">
                <div class="award">
                    ${emojify(
                        md ? marked(text) : sanitizeHtml(text)
                    )}
                </div>
                ${
                    nominee
                    ?
                    `
                    <div class="nominee">
                        ${sanitizeHtml(nominee)}
                    </div>
                    `
                    :
                    ""
                }
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = 'auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}
