const express = require('express');
// const logger = require('morgan');
const dotenv = require('dotenv');
const expressStatusMonitor = require('express-status-monitor');
const connectDB = require('./config/mongoose');
const routes = require('./routes');
const i18next = require("./utils/i18n.js");
const middleware = require("i18next-http-middleware");
const logger = require('./config/logger').logger
const { auth } = require('./config/auth')
const cors = require('cors')
dotenv.config({ path: '.env' });
const app = express();
global.__basedir = __dirname;

connectDB();

app.use(express.json());
app.use(middleware.handle(i18next));
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(expressStatusMonitor());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(cors());
app.use(auth);
app.use(routes);

const port = process.env.PORT || 8080;
const address = process.env.SERVER_ADDRESS || 'localhost';

app.get('/', (req, res) => res.send('Hello World!'));

app.listen((port), (error) =>
  error ? logger.error(error)
    : logger.info(`Server running on http://${address}:${port}`));


const  run= require('./kafka')

run().catch(console.error)