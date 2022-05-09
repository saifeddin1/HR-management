const express = require('express');
// const logger = require('morgan');
const dotenv = require('dotenv');
const expressStatusMonitor = require('express-status-monitor');
// const connectDB = require('./config/mongoose');
const routes = require('./routes');
const i18next = require("./utils/i18n.js");
const middleware = require("i18next-http-middleware");
const logger = require('./config/logger').logger
const { auth } = require('./config/auth')
const cors = require('cors')
dotenv.config({ path: '.env' });
const app = express();
global.__basedir = __dirname;
const fileController = require('./controllers/file')
const multer = require('multer');


const { GridFsStorage } = require("multer-gridfs-storage");
// connectDB();

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



require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;

const storage = new GridFsStorage({
  url: MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "profile_uploads",
      };
      resolve(fileInfo);

    });
  },
});

const upload = multer({ storage: storage });


app.post('/api/v1/files/upload', upload.single('file'), auth, fileController.uploadProfileImg);
app.get('/api/v1/files/documents/:id', fileController.findImgById)

app.use(auth);
app.use(routes);
const port = process.env.PORT || 8080;
const address = process.env.SERVER_ADDRESS || 'localhost';

app.get('/', (req, res) => res.send('Hello World!'));

const { connection } = require('./config/mongoose');
connection.once("open", () => {
  console.log("*** SERVER INIT ***");
});
app.listen(port, () => {
  console.log(`server is running at: ${address}:${port}`);
});



// const run = require('./kafka')


// run().catch(console.error)