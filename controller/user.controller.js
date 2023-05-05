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
  
  if(req.files){
    const resume = req.files.resume;
    console.log(resume)
    const fileName = resume.name;
    //Adding resume key value pair in userInfo
    userInfo.resume = fileName;
    console.log(fileName);
    resume.mv('./public/uploads/'+ fileName, (err)=>{
      if(err){
      res.status(500).send({messsage:'Unable to upload resume due to ' + err});
      return;
      }

    })

  }

  console.log('Resume File Name')
  console.log(userInfo.resume);
  const newUserCredentials = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  };

  try {
    const newUser = await User.create(newUserCredentials);
    
    const newUserInfo = await UserInfo.create(userInfo);

    //Setting the relationship between user and userInfo
    await newUser.setUserInfo(newUserInfo);
    //Setting the roles of the created users as basic user only admin cn have apt rights
    await newUser.setUserRoles([2]);
    //Final Message

    res.render("userInfo", userInfo);
  } catch (err) {
    res.status(500).send({message: `Unable to create new User due to ${err}`})
  }
};

//Sign in
exports.login = async (req, res) => {
  try {
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
      const roles = await user.getUserRoles();
      let currentUserRole = "user";
      for (i = 0; i < roles.length; i++) {
        if (roles[i].type === "admin") {
          currentUserRole = "admin";
        }
      }
      if (currentUserRole === "admin") {
        try {
          //Getting informtion of all the users to display it in the admin panel
          const users = await User.findAll();
         
          const userInfoArray = []
          for(i=0;i<users.length;i++){
            const singleUserInfo = await users[i].getUserInfo()
            userInfoArray.push(singleUserInfo)
          }
          res.render('admin',{
            userInfoArray: userInfoArray
          })
          
        } catch (err) {
          res.status(500).send({message: `Unable to find any users already registered due to ${err}`})
        }
      } else {
        res.render("userInfo", userInfoObject);
      }
    } else {
      res.status(404).send({ message: "Invalid Password" });
    }
  } catch {
    res.status(500).send({ message: "Internal Server error" });
  }
};
