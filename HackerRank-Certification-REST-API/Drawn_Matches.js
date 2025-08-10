'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}


/*
 * Complete the 'getNumDraws' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts INTEGER year as parameter.
 */
const axios = require("axios");

const api = "https://jsonmock.hackerrank.com/api/";

async function getCountFor(year, i){
    let count = 0;
    const res = await axios.get(api + "football_matches?year=" + year + "&page=" + i);
    const result = res.data;
    const data = result.data;
    if(Array.isArray(data)){
        data.forEach(d => {
            if(d.team1goals === d.team2goals){
                count++;
            }
        });
    }
    return count;
}

async function getNumDraws(year) {
    let count = 0;

    let res = await axios.get(api + "football_matches?year=" + year);
    let result = res.data;
    let total_pages = result.total_pages || 1;
    const promises = [];
    for(let i = 1; i <= total_pages; i++) {
        promises.push(getCountFor(year, i));
    }
    const results = await Promise.all(promises);
    results.forEach(c => count+=c);
    return count;
}
async function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const year = parseInt(readLine().trim(), 10);

    const result = await getNumDraws(year);

    ws.write(result + '\n');

    ws.end();
}
