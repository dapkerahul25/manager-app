/* Reuired NPM modules */
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require('http')
const logger = require("./util/logger");
const dotenv = require('dotenv');
const cors = require('cors');
/* Start Reading .env configuration */
dotenv.config();

/* Create a simple http server */
const server = http.createServer(app);
app.use(bodyParser.json({ limit: 1000 }));

/* Use cors middleware for handling cross origin request */
app.use(cors());

/* Require all routes of app */
require('./router')(app)

/* Handling Server Uncaught Exception */
process.on('uncaughtException', (err) => {
    logger.error('uncaughtException : ' + err);
})

/* Require mongo connection */
require("./config/mongo");

const port = process.env.SERVER_PORT || 8282;

/* server start listening on port 8282 */
server.listen(port, () => {
    logger.info(`server listening on port ${port}`)
    console.log(`server listening on port ${port}`);
});