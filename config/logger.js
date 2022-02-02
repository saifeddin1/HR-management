const winston = require('winston');


module.exports.logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log', level: 'debug',
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.json()
            )
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            colorize: true
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
    exitOnError: false


});