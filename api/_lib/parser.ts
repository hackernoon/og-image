import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest, Theme } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { widths, heights } = (query || {});

    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = `**${encodeURIComponent(
        `Noonies Award 2020`,
    )}**`;

    if (arr.length === 1) {
        text += `<br />${encodeURIComponent(
            arr[0]
        )}`
    } else {
        extension = arr.pop() as string;
        text += arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        theme: 'light',
        md: true,
        fontSize: '72px',
        images: getArray(images),
        widths: getArray(widths),
        heights: getArray(heights),
    };
    parsedRequest.images = getDefaultImages();
    return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
    if (typeof stringOrArray === 'undefined') {
        return [];
    } else if (Array.isArray(stringOrArray)) {
        return stringOrArray;
    } else {
        return [stringOrArray];
    }
}

function getDefaultImages(): string[] {
    const images = [
        'https://hackernoon.com/hn-icon.png',
        'https://noonies.tech/sponsor-logo__amplify.png'
    ];
    
    return images;
}
