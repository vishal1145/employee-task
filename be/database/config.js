const mongoose= require('mongoose');
// mongoose.connect("mongodb://0.0.0.0:27017/empstatus");

mongoose.connect(
    // "mongodb+srv://yashgupta7247:Y%40sh7247@cluster0.4pumz8s.mongodb.net/empstatus"
    "mongodb+srv://yashgupta365ji:Y@sh7247@algofolksdb.cp3amtq.mongodb.net/empstatus"
);

// ***********for mysql*****************
// const mysql= require('mysql');
// const conn= mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'college'
// });
// module.exports=conn;