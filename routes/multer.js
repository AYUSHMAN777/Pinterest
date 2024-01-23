const multer = require("multer");//multer configuration is responsible for defining how files should be stored on the server when uploaded
const { v4: uuidv4 } = require('uuid')
const path = require("path");

const storage = multer.diskStorage({  //The diskStorage function is used to define how files should be stored on the server. In this case, it specifies the destination directory and the filename.
    destination: function (req, file, cb) {
        // The cb function is called with two parameters:
        // The first parameter (null in this case) is for any error that might occur during the process. In this example, no error is provided, so it's set to null.
        // The second parameter is the destination directory where the uploaded files should be stored. In this case, it's ./public/images/uploads.
    
        cb(null, './public/images/uploads'); // Store uploaded files in the 'uploads/' directory
    },
    filename: function (req, file, cb) {
        const uniquename = uuidv4();      //generate unique filename using uuidv4
        cb(null, uniquename + path.extname(file.originalname))         //use the unique filename for upload file
    }
});

const upload = multer({ storage: storage })

module.exports = upload;