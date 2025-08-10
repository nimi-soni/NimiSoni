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
 * Complete the 'getTotalGoals' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. STRING team
 *  2. INTEGER year
 */

const axios = require("axios");

async function getTotalGoals(team, year) {
    let count = 0;
    const api = "https://jsonmock.hackerrank.com/api/";
    let res = await axios.get(api + "football_matches?year=" + year + "&team1=" + team);
    let result = res.data;
    let total_pages = result.total_pages || 1;
    for(let i = 1; i <= total_pages; i++) {
        const res = await axios.get(api + "football_matches?year=" + year + "&team1=" + team + "&page=" + i);
        const result = res.data;
        const data = result.data;
        if(Array.isArray(data)){
            data.forEach(d => {
                count+=Number(d.team1goals);
            });
        }
    }

    res = await axios.get(api + "football_matches?year=" + year + "&team2=" + team);
    result = res.data;
    total_pages = result.total_pages || 1;
    for(let i = 1; i <= total_pages; i++) {
        const res = await axios.get(api + "football_matches?year=" + year + "&team2=" + team + "&page=" + i);
        const result = res.data;
        const data = result.data;
        if(Array.isArray(data)){
            data.forEach(d => {
                count+=Number(d.team2goals);
            });
        }
    }
    return count;
}

async function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const team = readLine();

    const year = parseInt(readLine().trim(), 10);

    const result = await getTotalGoals(team, year);

    ws.write(result + '\n');

    ws.end();
}
