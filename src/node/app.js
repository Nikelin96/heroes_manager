const http = require('http');
const url = require('url');
const { Client } = require('pg');
const querystring = require('querystring');
var express = require('express')
var app = express();

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432,
});

console.log(`connecting to database`);
client.connect(function(err) {
    if (err) { throw err };
    console.log("Connected!");
});

const GetHeroes = async() => {
    console.log(`receiving heroes`);
    var records = await client.query('SELECT * FROM "Hero"');

    console.log(`mapping result`);
    return records.rows.map(hero => {
        return { id: hero.Id, name: hero.Name }
    })
};

const server = http.createServer(async(request, response) => {
    const urlParameters = url.parse(request.url, true);
    console.log(urlParameters);

    // request.method
    var heroes = await GetHeroes();
    console.log(`heroes received`);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    response.end(JSON.stringify(heroes));
});

// setup listening
const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});