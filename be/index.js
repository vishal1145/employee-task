const express = require("express");
require("./database/config");
const EmpDetail = require("./database/empdetails");
const EmpAdd = require("./database/empadd");
const nodemailer = require("nodemailer");
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

// app.post("/addemp", async (req, resp) => {
//   let details = new EmpAdd(req.body);
//   let result = await details.save();
//   resp.send(result);
// });


app.post("/addemp", async (req, resp) => {
  try {
    const existingEmployee = await EmpAdd.findOne({ email: req.body.email });

    if (existingEmployee) {
      return resp.status(400).send("Email already exists");
    }

    let details = new EmpAdd(req.body);
    let result = await details.save();
    resp.send(result);
  } catch (error) {
    // Handle other errors
    console.error("An error occurred:", error);
    return resp.status(500).send("An error occurred while adding the employee.");
  }
});


app.get("/empprofile/:id", async (req, resp) => {
  const result = await EmpAdd.find({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send("result not found");
  }
});

// app.get("/empdashmenu/:id", async (req, resp) => {
//   const result = await EmpAdd.find({ _id: req.body.id });
//   if (result) {
//     resp.send(result);
//   } else {
//     resp.send("result not found");
//   }
// });

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

app.delete("/deleteemp/:id", async (req, resp) => {
  const result = await EmpAdd.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.put("/addstatus/:id", async (req, resp) => {
  const result = await EmpDetail.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  resp.send(result)
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






app.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email exists in the database
    const user = await EmpAdd.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token for resetting password
    const resetToken = Jwt.sign({ userId: user._id }, jwtKey, {
      expiresIn: "1h", // Expiry time for the token
    });

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'kenton10@ethereal.email',
          pass: 'mMCkET8vQ5WwFDYUa4'
      }
    });

    // Email options
    const baseURL = process.env.BASE_URL || 'https://employee-backend.algofolks.com/resetpassword'; // Assuming BASE_URL is set in your environment variables

    const resetLink = `${baseURL}?token=${resetToken}`; // Include the token in the reset link

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Endpoint for resetting password
app.post("/resetpassword", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = Jwt.verify(token, jwtKey);

    // Update user's password
    await EmpAdd.updateOne(
      { _id: decoded.userId },
      { $set: { password: newPassword } }
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});


app.listen(5000);
