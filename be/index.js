const express = require("express");
require("./database/config");
// const User = require("./database/config2");
const EmpDetail = require("./database/empdetails");
const EmpAdd = require("./database/empadd");
// const userdb = require("./database/user");
const Message = require("./database/messages");
const Projects = require("./database/projects");
const nodemailer = require("nodemailer");
const cors = require("cors");
// const io = require("socket.io")(8080,{
//   cors:{
//     origin: "http://localhost:3000",
//   }
// });
require("dotenv").config();

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const Jwt = require("jsonwebtoken");
// const empdetails = require("./database/empdetails");
const jwtKey = "algofolks";

const app = express();
app.use(cors());

app.use(express.json({ limit: 52428800 }));
app.use(
  express.urlencoded({
    extended: true,
    limit: 52428800,
    parameterLimit: 52428800,
  })
);

// io.on("connection", socket=>{

// });
//************************************For Google Login*********************************** */
// const session = require("express-session");
// const passport = require("passport");
// const OAuth2Strategy = require("passport-google-oauth2").Strategy;

// app.use(
//   session({
//     secret: "algofolks",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//   new OAuth2Strategy({
//     clientID: `${process.env.client_id}`,
//     clientSecret: `${process.env.client_secret}`,
//     callbackURL: "/auth/google/callback",
//     scope: ["profile", "email"]
//   },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await userdb.findOne({ googleId: profile.id });

//         if (!user) {
//           const displayName = `${profile.name.givenName} ${profile.name.familyName}`;
//           user = new userdb({
//             googleId: profile.id,
//             displayName: displayName,
//             email: profile.emails[0].value,
//             image: profile.photos[0].value,
//           });
//           await user.save();
//         }
//         return done(null, user)
//       } catch (error) {
//         return done(error, null)
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// })

// passport.deserializeUser((user, done) => {
//   done(null, user);
// })

// app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))
// app.get("/auth/google/callback", passport.authenticate("google", {
//   successRedirect: `${process.env.FRONTEND_URL}`,
//   failureRedirect: `${process.env.FRONTEND_URL}/loginpage`
// }))

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
//**************************************************For Home Page*************************** */
app.get("/alltasknotempid", async (req, resp) => {
  try {
    const result = await EmpDetail.find({ empid: null });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/listnamess", async (req, resp) => {
  try {
    const result = await EmpAdd.find();
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/listnamess/:id", async (req, resp) => {
  try {
    const result = await EmpAdd.findOne({ _id: req.params.id });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.post("/adddetailss", async (req, resp) => {
  try {
    let details = new EmpDetail(req.body);
    let result = await details.save();
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.put("/updatetaskss/:id", async (req, resp) => {
  try {
    let result = await EmpDetail.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/taskautofillss/:id", async (req, resp) => {
  try {
    let result = await EmpDetail.findOne({ _id: req.params.id });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.put("/addhighlight/:id", async (req, resp) => {
  try {
    let result = await EmpDetail.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

// app.get('/highlighttask', async (req, resp) => {
//   try {
//     let result = await EmpDetail.find({ priority: '' });
//     if (result) {
//       resp.send(result);
//     } else {
//       resp.send("result not found");
//     }
//   } catch (error) {
//     resp.status(500).send("Error: " + error.message);
//   }
// });

//******************************************************************************************* */
//**********************************************For Projects********************************************************* */
app.get("/allprojects", async (req, resp) => {
  try {
    const result = await Projects.find({ empid: null });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/listprojects", async (req, resp) => {
  try {
    const result = await Projects.find();
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

// app.get("/listprojects", async (req, res) => {
//   try {
//     const result = await Projects.findAll({});
//     if (result && result.length > 0) {
//       res.json(result);
//     } else {
//       res.status(404).json({ message: "No projects found" });
//     }
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.get("/listnamess/:id", async (req, resp) => {
//   const result = await EmpAdd.findOne({ _id: req.params.id });
//   if (result) {
//     resp.send(result);
//   } else {
//     resp.send("result not found");
//   }
// });

app.post("/addprojects", async (req, resp) => {
  try {
    let details = new Projects(req.body);
    let result = await details.save();
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.put("/updateprojects/:id", async (req, resp) => {
  try {
    let result = await Projects.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/projectsautofillss/:id", async (req, resp) => {
  try {
    let result = await Projects.findOne({ _id: req.params.id });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.delete("/deleteproject/:id", async (req, resp) => {
  try {
    const result = await Projects.deleteOne({ _id: req.params.id });
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});
//************************************************************************************************************************* */
//**************************************************For Archive Page*************************** */
app.get("/allarchivetask", async (req, resp) => {
  try {
    const result = await EmpDetail.find({ archive: true });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/archiveicon", async (req, resp) => {
  try {
    let result = await EmpDetail.find({ archive: true });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});
//************************************************************************************************************************* */
app.get("/empdetails/:id", async (req, resp) => {
  try {
    const result = await EmpDetail.find({ empid: req.params.id, archive: false });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/taskautofill/:id", async (req, resp) => {
  try {
    const result = await EmpDetail.findOne({ _id: req.params.id });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/profileautofill/:id", async (req, resp) => {
  try {
    const result = await EmpAdd.findOne({ _id: req.params.id });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/listname", async (req, resp) => {
  try {
    const result = await EmpAdd.find({});

    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/reassignListName", async (req, resp) => {
  try {
    const result = await EmpAdd.find({});
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.post("/adddetails", async (req, resp) => {
  try {
    let details = new EmpDetail(req.body);
    let result = await details.save();
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.post("/addemp", async (req, resp) => {
  try {
    const existingEmployee = await EmpAdd.findOne({ email: req.body.email });
    if (existingEmployee) {
      return resp.status(400).send("Email Id already exists");
    } else {
      let details = new EmpAdd(req.body);
      let result = await details.save();
      resp.send(result);
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.put("/addemp/:id", async (req, resp) => {
  try {
    const result = await EmpAdd.updateOne(
      { _id: req.params.id },
      { $set: { password: req.body.password } }
    );
    resp.send(result);
  } catch (error) {
    console.error("Error updating password:", error);
    resp.status(500).send("Internal Server Error");
  }
});


app.get("/empprofile/:id", async (req, resp) => {
  try {
    const result = await EmpAdd.find({ _id: req.params.id });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
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
  try {
    let result = await EmpDetail.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.delete("/deletetask/:id", async (req, resp) => {
  try {
    const result = await EmpDetail.deleteOne({ _id: req.params.id });
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.delete("/deleteemp/:id", async (req, resp) => {
  try {
    const result = await EmpAdd.deleteOne({ _id: req.params.id });
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.put("/addstatus/:id", async (req, resp) => {
  try {
    const result = await EmpDetail.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.put("/updateprofile/:id", async (req, resp) => {
  try {
    const result = await EmpAdd.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/empsearch/:key", async (req, resp) => {
  try {
    let result = await EmpAdd.find({
      $or: [
        { name: { $regex: req.params.key } },
        // { status: { $regex: req.params.key } },
      ],
    });
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/messagebodyname/:id", async (req, resp) => {
  try {
    const result = await EmpAdd.find({ _id: req.params.id });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.post("/addmessages", async (req, resp) => {
  try {
    let message = new Message(req.body);
    let result = await message.save();
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.get("/getmessages/:id", async (req, resp) => {
  try {
    let result = await Message.find({ empid: req.params.id });
    if (result) {
      resp.send(result);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.delete("/deletechat/:id", async (req, resp) => {
  try {
    const result = await Message.deleteOne({ _id: req.params.id });
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

const extractDigits = (inputString) => {
  const regex = /\d+/;
  const match = inputString.match(regex);

  if (match) {
    return parseInt(match[0]);
  }

  return 0; // Return 0 if no digits are found
};

app.get("/statuscount/:id", async (req, resp) => {
  try {
    let result = await EmpDetail.findOne({ empid: req.params.id });

    if (result) {
      const pendingCount = await EmpDetail.countDocuments({
        empid: req.params.id,
        status: "Pending",
      });
      const runningCount = await EmpDetail.countDocuments({
        empid: req.params.id,
        status: "Running",
      });
      const completedCount = await EmpDetail.countDocuments({
        empid: req.params.id,
        status: "Completed",
      });
      const time = await EmpDetail.countDocuments({
        empid: req.params.id,
        time: "On Going",
      });

      const tasks = await EmpDetail.find({ empid: req.params.id });

      let totalTime = 0;
      tasks.forEach((task) => {
        totalTime += extractDigits(task.time); // Assuming there is a function extractDigits to extract digits from time string
      });

      resp.json({
        pending: pendingCount,
        running: runningCount,
        completed: completedCount,
        time: time,
        totalTime: totalTime,
      });
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: "Internal server error" });
  }
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
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "lexus.smith16@ethereal.email",
        pass: "rjg7r9F4vc6qBfCkVy",
      },
    });

    // Email options
    const baseURL =
      process.env.BASE_URL ||
      "https://employee-backend.algofolks.com/resetpassword"; // Assuming BASE_URL is set in your environment variables

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

app.get("/listname-menu", async (req, resp) => {
  try {
    const res = await EmpAdd.aggregate([
      {
        $lookup: {
          from: "empdetails",
          localField: "_id",
          foreignField: "empid",
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$archive", false] }
              }
            }
          ],
          as: "tasks",
        },
      },
      {
        $addFields: {
          pending: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond:

                  { $eq: ["$$task.status", "Pending"] },

              },
            },
          },
          completed: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond:

                  { $eq: ["$$task.status", "Completed"] },

              },
            },
          },
          running: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond:

                  { $eq: ["$$task.status", "Running"] },

              },
            },
          },
          time: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond:

                  { $eq: ["$$task.time", "On Going"] },

              },
            },
          },

          // totalTime: {
          //   $reduce: {
          //     input: "$tasks",
          //     initialValue: 0,
          //     in: {
          //       $add: [
          //         "$$value",
          //         {
          //           $toInt: {
          //             $arrayElemAt: [{ $split: ["$$this.time", " "] }, 0],
          //           },
          //         },
          //       ],
          //     },
          //   },
          // },
          totalTime: {
            $reduce: {
              input: {
                $map: {
                  input: "$tasks",
                  as: "task",
                  in: {
                    $cond: [
                      { $eq: ["$$task.time", "On Going"] },
                      0, 
                      {
                        $toInt: {
                          $arrayElemAt: [{ $split: ["$$task.time", " "] }, 0],
                        },
                      },
                    ],
                  },
                },
              },
              initialValue: 0,
              in: { $add: ["$$value", "$$this"] },
            },
          },
        },
      },
    ]);

    // console.log("res", res);
    if (res) {
      resp.send(res);
    } else {
      resp.send("result not found");
    }
  } catch (error) {
    resp.status(500).send("Error: " + error.message);
  }
});

app.listen(5000);
