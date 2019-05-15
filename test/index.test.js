const postcss = require('postcss');
const fs = require('fs');
const path = require('path');

const plugin = require('../src/index.js');

const readFile = (filePath, ...args) => new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filePath), ...args, (err, data) => {
        if (err) {
            reject();
        } else {
            resolve(data);
        }
    });
});

async function run(input, opts) {
    return postcss([plugin(opts)]).process(input).then((result) => {
               expect(result.css).toMatchSnapshot();
               expect(result.warnings().length).toBe(0);
           });
}

it('transform border with border-radius', async () => {
    const input = await readFile('./case/border-width-radius.css');
    run(input);
});