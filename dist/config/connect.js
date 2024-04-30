import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ENV = process.env.NODE_ENV || 'production';
dotenv.config({
    path: `${__dirname}/../../.env.${ENV}`
});
async function main() {
    // console.log(process.env)
    const uri = process.env.MONGO_CONNECT;
    // console.log(uri)
    if (uri == undefined) {
        return console.log("Could not connect to db");
    }
    const client = new MongoClient(uri);
    // console.log(client)
    return client.connect()
        .then((r) => {
        return listDatabases(client);
    })
        .then(() => {
        return client.close();
    })
        .catch((e) => {
        console.error("error", e);
    });
}
main().catch(console.error);
async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach((db) => {
        console.log(`- ${db.name}`);
    });
}
