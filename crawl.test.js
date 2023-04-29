const { normalizeUrl, getURLsFromHTML } = require("./crawl");
const { test, expect } = require('@jest/globals');

test('normalizeUrl strip protocol', () => {
    const input = "https://blog.boot.dev/path";
    const actual = normalizeUrl(input);

    const expected = "blog.boot.dev/path";

    expect(actual).toEqual(expected);
})

test('normalizeUrl strip trailing slash / from url', () => {
    const input = "https://blog.boot.dev/path/";
    const actual = normalizeUrl(input);

    const expected = "blog.boot.dev/path";

    expect(actual).toEqual(expected);
})

test('normalizeUrl capitals', () => {
    const input = "https://BLOG.boot.dev/path/";
    const actual = normalizeUrl(input);

    const expected = "blog.boot.dev/path";

    expect(actual).toEqual(expected);
})

test('normalizeUrl strip http protocol', () => {
    const input = "http://blog.boot.dev/path/";
    const actual = normalizeUrl(input);

    const expected = "blog.boot.dev/path";

    expect(actual).toEqual(expected);
})

test('getURLsFromHTML absolute url', () => {
    const inputHtmlBody = `<html><body><a href="https://blog.boot.dev/path">bood.dev</a></body></html>`;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHtmlBody, inputBaseURL);

    const expected = ["https://blog.boot.dev/path"];

    expect(actual).toEqual(expected);
})

test('getURLsFromHTML relative url', () => {
    const inputHtmlBody = `<html><body><a href="/path">bood.dev</a></body></html>`;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHtmlBody, inputBaseURL);

    const expected = ["https://blog.boot.dev/path"];

    expect(actual).toEqual(expected);
})

test('getURLsFromHTML multiple url', () => {
    const inputHtmlBody = `
    <html>
    <body>
        <a href="/path">bood.dev</a>
        <a href="https://blog.boot.dev/path">bood.dev</a>
    </body>
    </html>
    `;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHtmlBody, inputBaseURL);

    const expected = ["https://blog.boot.dev/path", "https://blog.boot.dev/path"];

    expect(actual).toEqual(expected);
})

test('getURLsFromHTML invalid url', () => {
    const inputHtmlBody = `
    <html>
    <body>
        <a href="invalid">bood.dev</a>
    </body>
    </html>
    `;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHtmlBody, inputBaseURL);

    const expected = [];

    expect(actual).toEqual(expected);
})