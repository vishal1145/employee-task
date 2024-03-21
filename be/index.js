const express = require("express");
require("./database/config");
const EmpDetail = require("./database/empdetails");
const EmpAdd = require("./database/empadd");
const cors = require("cors");

const Jwt = require("jsonwebtoken");
const jwtKey = "algofolks";

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.json({ limit: 52428800 }));
app.use(
  express.urlencoded({
    extended: true,
    limit: 52428800,
    parameterLimit: 52428800,
  })
);


// **********************************************For Login page**********************************************************
app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await EmpAdd.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: "24h" }, (err, token) => {
        if (err) {
          resp.send({ result: "something went wrong" });
        }
        resp.send({ user, auth: token });
      });
    } else {
      resp.send({ Result: "No user found." });
    }
  } else {
    resp.send({ Result: "Data not found." });
  }
});

// *********************************************For verifytoken***************************************************************
// function verifyToken(req,resp,next){
//     // console.log("result:success")
//     let token= req.headers['authorization'];
//     if(token){
//         token= token.split(' ')[1];
//         Jwt.verify(token,jwtKey,(err,valid)=>{
//             if(err){
//                 resp.status(401).send({result: "Please provide valid token"})
//             }else{
//                 next();
//             }
//         })
//     }else{
//         resp.status(403).send({result:"Please add token with header"});
//     }
// }
//*************************************************************************************************************** */

app.get("/empdetails/:id", async (req, resp) => {
  const result = await EmpDetail.find({ empid: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send("result not found");
  }
});

// app.get("/empdetailss/:id", async (req, resp) => {
//   const result = await EmpDetail.findOne({ _id: req.params.id });
//   if (result) {
//     resp.send(result);
//   } else {
//     resp.send("result not found");
//   }
// });

app.get("/taskautofill/:id", async (req, resp) => {
  const result = await EmpDetail.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send("result not found");
  }
});

app.get("/profileautofill/:id", async (req, resp) => {
  const result = await EmpAdd.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send("result not found");
  }
});

app.get("/listname", async (req, resp) => {
  const result = await EmpAdd.find();
  if (result) {
    resp.send(result);
  } else {
    resp.send("result not found");
  }
});

app.post("/adddetails", async (req, resp) => {
  let details = new EmpDetail(req.body);
  let result = await details.save();
  resp.send(result);
});

app.post("/addemp", async (req, resp) => {
  let details = new EmpAdd(req.body);
  let result = await details.save();
  resp.send(result);
});

app.get("/empprofile/:id", async (req, resp) => {
  const result = await EmpAdd.find({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send("result not found");
  }
});

app.put("/updatetask/:id", async (req, resp) => {
  let result = await EmpDetail.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  resp.send(result);
});

app.delete("/deletetask/:id", async (req, resp) => {
  const result = await EmpDetail.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.put("/addstatus/:id", async (req, resp) => {
  const result = await EmpDetail.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  resp.send(result);
});

app.put("/updateprofile/:id", async (req, resp) => {
  const result = await EmpAdd.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  resp.send(result);
});


app.get("/empdetailssearch/:key", async (req, resp) => {
  let result = await EmpDetail.find({
    $or: [
      { task: { $regex: req.params.key } },
      { status: { $regex: req.params.key } },
    ],
  });
  resp.send(result);
});

app.listen(5001);
