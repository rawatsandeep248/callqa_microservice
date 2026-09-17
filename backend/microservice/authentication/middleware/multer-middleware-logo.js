const multer = require("multer");
const path = require("path");
// Configure multer to store files in memory
let storage = multer.memoryStorage();
// Multer upload settings
let upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Validate file type (e.g., only allow images)
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
}).fields([
    { name: 'header', maxCount: 1 },
    { name: 'login', maxCount: 1 }
  ]);

// Middleware function to handle image upload
const uploadLogoFile = async (req, res, next) => {
    try {
        // console.log("REQ BODY:::::::::::",req.body)
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
};

module.exports = uploadLogoFile;
