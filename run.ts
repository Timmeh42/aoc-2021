const fs = require('fs');

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: node run <day> [<part>] [<runs>]');
    console.error('Missing <day> input');
    process.exit(1);
}

const day: string | undefined = args.shift();
const parts = [];
if (args[0] === '1' || args[0] === '2') {
    parts.push(args.shift());
} else {
    parts.push('1', '2');
}
const runs = typeof args[0] === 'string' ? parseInt(args[0]) : 1;

let input;
try {
    input = fs.readFileSync(`days/${day}/input.txt`, 'utf8').trimEnd();
} catch (e) {
    console.error(`days/${day}/input.txt not found.`);
    process.exit(1);
}

for (let p of parts) {
    let answer: Function;
    try {
        answer = require(`./days/${day}/${p}.ts`);
    } catch (e) {
        console.error(`days/${day}/${p} not found or failed parse.`);
        if (e instanceof Error) {
            console.error(e.message);
        }
        process.exit(1);
    }
    let solution;
    const startTime = process.hrtime.bigint();
    for (let i = 0; i < runs; i++) {
        solution = answer(input);
    }
    const endTime = process.hrtime.bigint();
    const avgTime = Number(endTime - startTime) / 1e9 / runs;
    console.log(`Part ${p}: ${avgTime.toFixed(6)}s`);
    console.log(solution);
}