// This file should set up the express server as shown in the lecture code
import express from 'express'
import { dbConnection, closeConnection } from './config/mongoConnection.js'
import configRoutes from './routes/index.js'

const app = express()
app.use(express.json())

configRoutes(app)

const server = app.listen(3000, async () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
    await dbConnection()
});

server.on('exit', async (stream) => {
    await closeConnection()
});
