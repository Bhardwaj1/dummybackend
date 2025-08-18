const express =require('express');
const multer = require('multer');
const XLSX = require("xlsx");

const router = express.Router();

// Save excel in uploads folder
const upload = multer({dest:'uploads/'});


// Upload + parse excel

router.post('/',upload.single("file"),(req,res)=>{
    try {
        if(!req.file){
            return res.status(404).json({error:"No file uploaded"});
        };

        const workbook=XLSX.readFile(req.file.path);
        const sheetName= workbook.SheetNames[0];
        const sheet= workbook.Sheets[sheetName];
        const data= XLSX.utils.sheet_to_json(sheet);
        res.json({rows:data});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Failed to parse excel file"});
    }
})

module.exports=router;