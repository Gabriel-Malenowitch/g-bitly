const { Client } = require('pg');

const connect = async () => {
    const client = new Client({
        user: 'postgres',
        database: 'g-bitly',
        password: '123',
        port: 5432,
        host: 'localhost',
    });

    if(global.dbConnection) {
        return global.dbConnection
    }
    
    await client.connect();
    global.dbConnection = client

    return client
}

module.exports = {
    connect
}