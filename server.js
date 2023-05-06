//Server Configuration
const serverConfig = require("./config/serverConfig");
//Requiring controllers for that will perform operation on the database
const userController = require("./controller/user.controller");
//Custom MiddleWare
const registerMiddleware = require('./middlewares/register.middleware')
//Requiring express package to set up the server
const express = require("express");
//Requiring File upload Module
const upload = require("express-fileupload");
//body Parser to parse json data
const bodyParser = require("body-parser");
//Path module and bcrypt for hashing the passwords
const path = require("path");
const bcrypt = require("bcryptjs");
//Setting up express as an app constant
const app = express();

//Using middlewares

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload());

//Views folder ejs setup
app.set("view engine", "ejs");
//Requiring Database and their models
const db = require("./model");
const UserRole = db.userRole;
const User = db.user;
const UserInfo = db.userInfo;
//Dropping all the previous tables and crerating new ones and initializing some sample data for Testing using the init function
db.sequelize.sync({ force: true }).then(() => {
  console.log("Tables Dropped and Created");
  init();
});
//Sample Users with different roles
async function init() {
  const roles = [{ type: "admin" }, { type: "user" }];
  const users = [
    {
      email: "abc@gmail.com",
      password: bcrypt.hashSync("1234", 8),
    },
    {
      email: "qwerty@gmail.com",
      password: bcrypt.hashSync("1234", 8),
    },
  ];
  const usersInfo = [
    {
      name: "Sample Admin",
      age: "23",
      currentRole: "HR, at myHr.com",
      dob: "08-09-1993",
      gender: "Male",
      userId: 1,
    },
    {
      name: "Sample User",
      age: "23",
      currentRole: "Open to Work",
      dob: "04-20-1989",
      gender: "Male",
      userId: 2,
    },
  ];

  try {
    await UserRole.bulkCreate(roles);
    const sampleUsers = await User.bulkCreate(users);
    await UserInfo.bulkCreate(usersInfo);
    sampleUsers[0].setUserRoles([1, 2]);
    sampleUsers[1].setUserRoles([2]);
  } catch (err) {
    res
      .status(500)
      .send({ message: +"Error while creating sample data " + err });
  }
}
/* ALL ROUTES FOR OUR APP */
//Home route
app.get("/", (req, res) => {
  res.render("index");
});
/*  
User Routes
*/
//Register Routes
app.get("/register", (req, res) => {
  res.render(`register`);
});
app.post("/register",[registerMiddleware.checkUniqueEmail], userController.register);

//Login Routes
app.get("/login", (req, res) => {
  res.render(`login`);
});
app.post("/login", userController.login);

//Server Listening to PORT in .env file
app.listen(serverConfig.PORT, () => {
  console.log("Server started on port" + serverConfig.PORT);
  console.log(process.env.NODE_ENV);
});
