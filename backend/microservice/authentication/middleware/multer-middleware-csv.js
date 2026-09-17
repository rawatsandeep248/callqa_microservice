const multer = require("multer");
const MESSAGEUTIL = require("../../../common/utils/message-util");
const path = require('path')

    const handleUploadFile =async(req, res, next) =>{
        try {
            // console.log("Req BOdy inside multerrrrrrrrrrrrrrrrrrrrrrrrr",req.body)
            upload(req,res ,(err)=>{
                if(err){
                    console.log("Errrrr",err);
                    throw err
                }else{
                    // console.log("RESOLVED:::::::::::::::::::::::",req.body);
                    next();
                }
            });       
        } catch (err) {
            console.log("main err", err)
            throw err
        }
    }

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../common/assets/data-source-csv-files/'));

    },
    filename: (req, file, cb) => {
        let datetimestamp = Date.now();
        // console.log("================   ",file)
        let fileName = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]
        let filePath =  path.join(__dirname, '../../../common/assets/data-source-csv-files/')
        req.body['filename'] = fileName ;
        req.body['filepath'] = filePath ;
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

let upload = multer({ //multer settings
    storage: storage,
    onFileUploadStart: (file) => {
        console.log("SSSSSSSSSSSSSSSSSSs",file.originalname + ' is starting ...')
    },
}).single('file')

module.exports = handleUploadFile;
