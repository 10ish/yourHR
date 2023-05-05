// Model that defines the structure of user table
const { sequelize, Sequelize } = require(".");

module.exports = (sequelize,Sequelize)=>{
    const User = sequelize.define('user',{
        email:{
            type: Sequelize.STRING
        },
        password:{
            type: Sequelize.STRING
        }

    });
    return User
}