const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, callback){
        callback(null,file.fieldname +'-'+Date.now()+path.extname(file.originalname))
    }
});

//init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 100000000},
    fileFilter: function(req, file, callback){
        checkFileType(file, callback);
    }
}).single('myImage');

function checkFileType(file, callback){
    //allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    //check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mimetype
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return callback(null,true);
    }else{
        callback("Err: Images only!");
    }

}

//init app variable
const app = express();

//setup ejs
app.set('view engine', 'ejs');

//public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index')); 

app.post('/upload', (req, res) => {
    upload(req,res,(err) =>{
        if(err){
            res.render('index', {
                msg: err
            });
        }else{
            // console.log(req.file);
            // res.send('test');
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Err: No file selected!'
                });
            }else{
                res.render('index', {
                    msg: 'File uploaded!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
})


const port = 5000;
app.listen(port, () => console.log(`server started on port ${port}`));