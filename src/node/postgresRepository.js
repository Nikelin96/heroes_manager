class PostgresRepository {
    constructor(client) {
        this.client = client;
    }

    getHeroesAsync = async() => {
        console.log('Receiving heroes');

        const records = await this.client.query('SELECT * FROM "Hero"');

        return records.rows.map(hero => {
            return { id: hero.Id, name: hero.Name }
        });
    };

    deleteHeroAsync = async(id) => {
        console.log('Deleting hero by id: ', id);

        const query = 'DELETE FROM "Hero" WHERE "Id" = ($1)';
        let queryParameters = [id];

        await this.client.query(query, queryParameters);
    };

    createHeroAsync = async(hero) => {
        console.log('Creating hero');

        const query = 'INSERT INTO "Hero" ("Name") VALUES ($1) RETURNING *';
        let queryParameters = [hero.name];

        this.client.query(query, queryParameters)
            .then(res => {
                console.log(res.rows);
            })
            .catch(error => {
                console.error(error.stack);
            });
    };

    updateHeroAsync = async(hero) => {
        console.log('Updating hero');

        const query = `
        UPDATE "Hero" 
            SET "Name" = ($1) 
        WHERE "Id" = ($2)`;

        let queryParameters = [hero.name, hero.id];

        this.client.query(query, queryParameters)
            .then(res => {
                console.log(res.rows);
            })
            .catch(error => {
                console.error(error.stack);
            });
    };
}

module.exports = PostgresRepository