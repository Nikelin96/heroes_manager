const http = require('http');
const url = require('url');
const querystring = require('querystring');
const express = require('express')
const { Client } = require('pg');
const app = express();
const PostgresRepository = require('./postgresRepository');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432,
});

client.connect(function(error) {
    if (error) { throw error };
    console.log('Connected!');
});

const repository = new PostgresRepository(client);

app.get('/', async(request, response) => {
    console.log(`GET heroes`);

    let heroes = await repository.getHeroesAsync();

    let searchText = request.query.searchText;
    if (searchText) {
        searchText = searchText.toLowerCase();
        heroes = heroes.find(heroes => heroes.name.toLowerCase().startsWith(searchText));
    }

    completeResponse(response, 200, heroes);
});

app.get('/:id', async(request, response) => {
    console.log('GET hero by id: ', request.params.id);

    let heroes = await repository.getHeroesAsync();

    const id = parseInt(request.params.id);
    heroes = heroes.find(heroes => heroes.id == id);

    completeResponse(response, 200, heroes);
});

app.post('/', async(request, response) => {
    const hero = request.body;
    await repository.createHeroAsync(hero);

    completeResponse(response, 200, hero);
});

app.delete('/:id', async(request, response) => {
    console.log('Delete hero by id: ', request.params.id);

    const id = parseInt(request.params.id);
    await repository.deleteHeroAsync(id);

    completeResponse(response, 200);
});

app.put('/', async(request, response) => {
    const hero = request.body;

    await repository.updateHeroAsync(hero);

    completeResponse(response, 200);
});

const completeResponse = (response, statusCode, body) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    if (body) {
        response.end(JSON.stringify(body));
    } else {
        response.end();
    }
}

// setup listening
const hostname = 'localhost';
const port = 3000;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});