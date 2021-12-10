const fs = require('fs');
const argsRaw = process.argv.slice(2).join(' ');
const argsMatch = argsRaw.match(/^(?<day>\d+)(?: (?<part>(?:1|2|solution)\b))?(?: (?<runs>\d+)?)?/);
if (argsMatch === null || !argsMatch.groups.day) {
    console.error('Usage: node run <day> [<part>] [<runs>]');
    console.error('Missing <day> input');
    process.exit(1);
}

const {day, part, runs = 1} = argsMatch.groups;


let input;
try {
    input = fs.readFileSync(`days/${day}/input.txt`, 'utf8').trimEnd();
} catch (e) {
    console.error(`days/${day}/input.txt not found.`);
    process.exit(1);
}

const parts = part ? [part] : ['1', '2'];
for (let p of parts) {
    let answer;
    try {
        answer = require(`./days/${day}/${p}.js`);
    } catch (e) {
        console.error(`days/${day}/${p} not found or failed parse.`);
        console.error(e.message);
        process.exit(1);
    }
    let solution;
    const startTime = process.hrtime.bigint();
    solution = answer(input);
    const splitTime = process.hrtime.bigint();
    for (let i = 0; i < runs - 1; i++) {
        solution = answer(input);
    }
    const endTime = process.hrtime.bigint();
    const oneTime = Number(splitTime - startTime) / 1e6;
    const avgTime = Number(endTime - splitTime) / 1e6 / runs;
    console.log('Solution:');
    console.log(solution);
    console.log(`One run: ${oneTime.toFixed(6)}ms`);
    if (runs > 1) {
        console.log(`${runs} runs: ${avgTime.toFixed(6)}ms`);
    }
}