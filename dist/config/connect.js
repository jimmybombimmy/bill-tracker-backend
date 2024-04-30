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
const uri = process.env.DB_STRING;
const client = new MongoClient(uri);
export async function connectToDB() {
    if (uri == undefined) {
        return console.log("Could not connect to db");
    }
    return client.connect()
        .then((r) => {
        // return listDatabases(client)
    })
        .catch((e) => {
        console.error("error", e);
    });
}
export async function disconnectFromDB() {
    return client.close();
}
// main().catch(console.error)
async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    // console.log("client:", client.serverStatus())
    console.log("Databases:");
    databasesList.databases.forEach((db) => {
        console.log(`- ${db.name}`);
    });
}
async function listConnections(client) {
    const connectionsList = await client;
}
