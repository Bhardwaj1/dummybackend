const express= require('express');
const cors= require('cors');
const dotenv=require('dotenv');
const connectDB=require('./config/db.js');
const userRoutes= require('./routes/userRoutes.js');
const excelRoutes=require("./routes/excelRoutes.js");

dotenv.config();
const app=express();

// middleware

app.use(cors());
app.use(express.json());

connectDB();

// testRoute
app.get("/",(req,res)=>{
    res.send("Backend is running");
});

app.use("/api/users",userRoutes);
app.use("/api/excel-uploads",excelRoutes);

const PORT = process.env.PORT||5000;

app.listen(PORT,()=>console.log(`Server is running on PORT 5000`));