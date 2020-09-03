const winston = require('winston');

require('winston-daily-rotate-file');
const moment = require('moment');
const DatePattern = `YYYY-MM-DD-HH`
const Prepend = true
const ZippedArchive = true
const Timestamp = `YYYY-MM-DD hh:mm:ss`
const MyFormat = `YYYY-MM-DD hh:mm:ss.SSS`

const options = {
    file: {
        level: 'info',
        filename: `./logs/app.log`,
        datePattern: DatePattern,
        prepend: Prepend,
        zippedArchive: ZippedArchive,
        timestamp: () => {
            return moment().format(Timestamp)
        }
    },
    warningfile: {
        level: 'warn',
        filename: `./logs/warning.log`,
        datePattern: DatePattern,
        prepend: Prepend,
        zippedArchive: ZippedArchive,
        timestamp: () => {
            return moment().format(Timestamp)
        }
    },
    errorFile: {
        level: 'error',
        filename: `./logs/error.log`,
        datePattern: DatePattern,
        prepend: Prepend,
        zippedArchive: ZippedArchive,
        timestamp: () => {
            return moment().format(Timestamp)
        }
    }
};

const {
    splat,
    combine,
    timestamp,
    printf
} = winston.format;

const myFormat = printf(({
    timestamp,
    level,
    message
}) => {
    return `${moment(timestamp).format(MyFormat)} - ${level} : ${message}`;
});

let loggerW = winston.createLogger({
    format: combine(
        timestamp(),
        splat(),
        myFormat
    ),
    transports: [
        new (winston.transports.DailyRotateFile)(options.file),
        new (winston.transports.DailyRotateFile)(options.warningfile),
        new (winston.transports.DailyRotateFile)(options.errorFile),
    ],
    exitOnError: false,
});

loggerW.stream = {
    write: (message, encoding) => {
        loggerW.info(message);
        loggerW.error(message);
        loggerW.warn(message);
    },
};

module.exports = loggerW;
