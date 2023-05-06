const db = require('../model');
const User = db.user
const checkUniqueEmail = async (req,res,next)=>{
//Checkin if there's any email in our db with the email user is trying to register
   const users = await User.findAll({where:{email:req.body.email}})
   if(!users[0]){
    next();
    //moving to next if email is availabe
    return;
   }
   else{
    //dending error if email already exists
    res.status(404).send({message:'Sorry the email you are trying to use is already used'});
    return;
   }
}

module.exports = {
    checkUniqueEmail: checkUniqueEmail
}