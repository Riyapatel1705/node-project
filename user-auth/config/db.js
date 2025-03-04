const mysql=require('mysql2');
require('dotenv').config();

//connect your project folder with MySQL
const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
});

//check for the connection with errors
db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("MySql connected..");
});

module.exports=db;