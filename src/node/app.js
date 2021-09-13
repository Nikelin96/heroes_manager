const http = require('http');
const url = require('url');
const querystring = require('querystring');
const express = require('express')
const { Client } = require('pg');
const app = express();

app.use(express.urlencoded({
    extended: true
}));
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

const GetHeroes = async() => {
    console.log('Receiving heroes');

    var records = await client.query('SELECT * FROM "Hero"');

    return records.rows.map(hero => {
        return { id: hero.Id, name: hero.Name }
    });
};

const DeleteHero = async(id) => {
    console.log('Deleting hero by id: ', id);

    const query = 'DELETE FROM "Hero" WHERE "Id" = ' + id;
    await client.query(query);
};

const CreateHero = async(hero) => {
    console.log('Creating hero');

    const query = `INSERT INTO "Hero" ("Name") 
        VALUES ('` + hero.name + `');`;

    await client.query(query);
};

const UpdateHero = async(hero) => {
    console.log('Updating hero');

    const query = `UPDATE "Hero" 
    SET "Name" ='` + hero.name + `'
    WHERE "Id" = ` + hero.id;

    await client.query(query);
};

app.get('/', async(request, response) => {
    console.log(`GET heroes`);

    let heroes = await GetHeroes();

    const searchText = request.query.searchText;
    if (searchText) {
        heroes = heroes.find(heroes => heroes.name.toLowerCase().startsWith(searchText.toLowerCase()));
    }

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    response.end(JSON.stringify(heroes));
});

app.get('/:id', async(request, response) => {
    console.log('GET hero by id: ', request.params.id);

    let heroes = await GetHeroes();

    const id = parseInt(request.params.id);
    heroes = heroes.find(heroes => heroes.id == id);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    response.end(JSON.stringify(heroes));
});

app.post('/', async(request, response) => {
    console.log('Create hero');

    const hero = request.body;
    await CreateHero(hero);

    response.statusCode = 201;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    response.end(JSON.stringify(hero));
});

app.delete('/:id', async(request, response) => {
    console.log('Delete hero by id: ', request.params.id);

    const id = parseInt(request.params.id);
    await DeleteHero(id);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    response.end();
});

app.put('/', async(request, response) => {
    console.log('Update hero');
    const hero = request.body;

    await UpdateHero(hero);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    response.end();
});

// setup listening
const hostname = 'localhost';
const port = 3000;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});