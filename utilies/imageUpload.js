const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const UPLOAD_FOLDER = path.join(__dirname, '..', '..') + '/public/media/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER)
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileNameWithoutExt = path.basename(file.originalname, fileExt);
        const sanitizedFileName = fileNameWithoutExt.replace(/\s+/g, "-");
        const finalFileName = sanitizedFileName + "-" + Date.now() + fileExt;
        cb(null, finalFileName);
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // 1MB
    },
    fileFilter: (req, file, cb) => {
        if(file.fieldname == 'avatar' || file.fieldname == 'image'){
            if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
                cb(null, true)
            } else {
                cb(new Error("Only .png .jpg or .jpeg file allowed!"))
            }
        } else if(file.fieldname == 'json'){
            if(file.mimetype == 'application/json'){
                cb(null, true)
            } else {
                cb(new Error("Only .json file allowed!"))
            }
        } else {
            cb(new Error("There was an unknown error!"))
        }
    }
});
  
module.exports = upload;