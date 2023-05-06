const db = require("../model");
const UserInfo = db.userInfo;
const User = db.user;
const bcrypt = require("bcryptjs");

//Register a New User
exports.register = async (req, res) => {
  //Getting from Data
  let userInfo = {
    name: req.body.name,
    age: req.body.age,
    phone: req.body.phone,
    positionApplied: req.body.positionApplied,
    dob: req.body.dob,
    gender: req.body.gender,
    currentRole: req.body.currentRole,
  };
  //Checking if the resume is uploaded and moving it to the uploads folder in public directory with its respective file name,
  //Also setting thhe userInfo.resume attribute's value to the file name which will be used for ejs templates
  if (req.files) {
    //Middleware Used: express-fileupload to get the file
    const resume = req.files.resume;
    console.log(resume);
    const fileName = resume.name;
    //Adding resume key value pair in userInfo
    userInfo.resume = fileName;
    console.log(fileName);
    //mv function using express-fileupload
    resume.mv("./public/uploads/" + fileName, (err) => {
      if (err) {
        res
          .status(500)
          .send({ messsage: "Unable to upload resume due to " + err });
        return;
      }
    });
  }
  const newUserCredentials = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  };

  try {
    //Creating new User in the User Model
    const newUser = await User.create(newUserCredentials);
    //Creating new user data in the userInfo Model
    const newUserInfo = await UserInfo.create(userInfo);

    //Setting the relationship between user and userInfo
    await newUser.setUserInfo(newUserInfo);
    //Setting the roles of the created users as basic user only admin cn have apt rights
    await newUser.setUserRoles([2]);
    //Final Render
    //Rendering userInfo.ejs and passing userInfo as an object which is then used in the corrsponding template
    res.render("userInfo", userInfo);
  } catch (err) {
    // catching errors if any
    res
      .status(500)
      .send({ message: `Unable to create new User due to ${err}` });
  }
};

//Sign in
exports.login = async (req, res) => {
  try {
    //finding if the email is valid(if it exists in the database)
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      res.status(404).send({ message: "No user Exists with such an email" });
      return;
    }
    const userInfo = await user.getUserInfo();
    const userInfoObject = {
      name: userInfo.name,
      age: userInfo.age,
      phone: userInfo.phone,
      positionApplied: userInfo.positionApplied,
      dob: userInfo.dob,
      gender: userInfo.gender,
      currentRole: userInfo.currentRole,
      resume: userInfo.resume,
    };

    //Checking if the password is valid
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (passwordIsValid) {
      //getting roles of the user to see if the user is admin/user: We only have two roles for users as of now
      const roles = await user.getUserRoles();
      let currentUserRole = "user";
      //Setting currentUserRole as admin if the user that has logged in is admin,
      //Looping over roles array to see if even one of the roles is admin
      for (i = 0; i < roles.length; i++) {
        if (roles[i].type === "admin") {
          currentUserRole = "admin";
        }
      }
      //Rendering Admin Template if the user has admin roles
      if (currentUserRole === "admin") {
        try {
          //Getting informtion of all the users to display it in the admin panel
          const users = await User.findAll();
          // Creating an array that contains all userInfo
          const userInfoArray = [];
          //Pushing each userInfo in the userInfoArray tht contains information of all the users
          for (i = 0; i < users.length; i++) {
            const singleUserInfo = await users[i].getUserInfo();
            userInfoArray.push(singleUserInfo);
          }
          // Using userInfoArray to render ejs admin template that shows information of all users
          res.render("admin", {
            userInfoArray: userInfoArray,
          });
        } catch (err) {
          res.status(500).send({
            message: `Unable to find any users already registered due to ${err}`,
          });
        }
      } else {
        //If the user is not admin then we render the specific userData by using the userInfo Object
        res.render("userInfo", userInfoObject);
      }
    } else {
      res.status(404).send({ message: "Invalid Password" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server error" });
  }
};
