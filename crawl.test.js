const { normalizeUrl } = require("./crawl");
const { test, expect }  = require('@jest/globals');

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