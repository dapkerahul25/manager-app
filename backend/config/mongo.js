const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const logger = require("../util/logger");

/* Get mongodb url from .env config file */
var dbConfig = process.env.MONGO_URL
mongoose.connect(dbConfig, { useNewUrlParser: true, useUnifiedTopology: true });

/* When successfully connected */
mongoose.connection.on('connected', () => {
    console.log('Mongoose connection open successful ');
});

mongoose.set('useFindAndModify', false);

/* If the connection throws an error */
mongoose.connection.on('error', (err) => {
    logger.error('Mongoose connection error: ' + err);
});

/* When the connection is disconnected */
mongoose.connection.on('disconnected', () => {
    logger.error('Mongoose connection disconnected ');
});

/* When the connection encounter err */
mongoose.connection.on("error", (err) => {
    if (err) {
        logger.error('Mongoose connection err : ' + err);
    }
});