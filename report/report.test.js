const { sortPages } = require("./report");
const { test, expect } = require('@jest/globals');

test('sortPages 2 pages', () => {
    const input = {
        'https://theritikchoure.github.io/headx-doc/': 1,
        'https://theritikchoure.github.io/': 3
    };

    const actual = sortPages(input);

    const expected = [
        {
            url: 'https://theritikchoure.github.io/',
            occurrence: 3 ,
        },
        {
            url: 'https://theritikchoure.github.io/headx-doc/',
            occurrence: 1,
        }
    ]

    expect(actual).toEqual(expected);
})