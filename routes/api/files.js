const router = require('express').Router();
const fileController = require('../../controllers/file')
const multer = require('multer');


const { GridFsStorage } = require("multer-gridfs-storage");

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
// var cors = require('cors')
// var app = express()
// router.post('/api/v1/files/upload', upload.single('file'), fileController.uploadProfileImg);

// app.use(cors()) //Add CORS middleware
// profile photo upload


// router.post('/upload', upload.single('file'), fileController.uploadProfileImg);
// router.get('/documents/:id', fileController.findImgById)
// Manage connected employee file details 
router.get('/getAllWithQueries', fileController.getAllFilesWithQuries);
router.get('/employeeFileDetails', fileController.getEmployeeFileDetails);
router.get('/getOneByUserId/:userId', fileController.getOneByUserId);
router.get('/getCollaborators', fileController.getCollaborators);
router.put('/employeeFileDetails/:fileId', fileController.updateEmployeeFileDetails);
router.put('/employeeFileAsAdmin/:file_id', fileController.updateEmployeeFileAsAdmin);
router.delete('/employeeFileDetails', fileController.deleteEmployeeFileDetails);

// Default factory CRUD endpoints 
router.get('/', fileController.getAllFiles);
router.post('/', fileController.createNewFile);



router.get('/:id', fileController.getOneFile);
router.put('/:id', fileController.updateFile);
router.delete('/:id', fileController.deleteFile);


module.exports = router;















