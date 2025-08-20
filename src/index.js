const express= require('express');
const cors= require('cors');
const dotenv=require('dotenv');
const connectDB=require('./config/db.js');
const userRoutes= require('./routes/userRoutes.js');
const excelRoutes=require("./routes/excelRoutes.js");
const bulkUserUploadRoutes=require("./routes/bulkUserUploadRoutes.js");
const authRoutes=require('./routes/auth.js');
const cookieParser=require('cookie-parser');
const session= require('express-session');
dotenv.config();
const app=express();

// import passport config (google strategy)
require('./utils/passport.js');

// Import 

// middleware

app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))

// testRoute
app.get("/",(req,res)=>{
    res.send("Backend is running");
});
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes);
app.use("/api/excel-uploads",excelRoutes);
app.use("/api/bulk-user-uploads",bulkUserUploadRoutes)

const PORT = process.env.PORT||5000;

app.listen(PORT,()=>console.log(`Server is running on PORT 5000`));