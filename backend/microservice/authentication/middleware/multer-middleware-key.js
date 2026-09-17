const multer = require("multer");
const MESSAGEUTIL = require("../../../common/utils/message-util");
const path = require('path')

    const handleUploadFile =async(req, res, next) =>{
        try {
            console.log("dir name::::::::::", __dirname);
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
        }
        catch (err) {
            console.log("main err", err)
            throw err
        }
    }

let storage = multer.diskStorage({
    destination: (req,  keyFile, cb) => {
        cb(null, path.join(__dirname, '../../../common/assets/ssl-files/'));
    },
    filename: (req,  keyFile, cb) => {
        let datetimestamp = Date.now();
        // console.log("================   ",keyFile)
        let fileName =  keyFile.fieldname + '-' + req.params.tenant_id+ '-' + datetimestamp + '.' + keyFile.originalname.split('.')[keyFile.originalname.split('.').length - 1] ;
        let filePath = path.join(__dirname, '../../../common/assets/ssl-files/') ;
        req.body['filename'] = fileName ;
        req.body['filepath'] = filePath ;
        cb(null, fileName);   
    }
});

let upload = multer({ //multer settings
    storage: storage,
    onFileUploadStart: ( keyFile) => {
        console.log("SSSSSSSSSSSSSSSSSSs", keyFile.originalname + ' is starting ...')
    },
}).single('keyFile')

module.exports = handleUploadFile;
