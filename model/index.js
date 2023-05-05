const Sequelize = require('sequelize');
const {DataTypes} = require('sequelize')
//Setting up Sequelize
const env = process.env.NODE_ENV||'developement'
const dbConfig = require('../config/dbConfig')[env]
//Connecting to db
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,{
host : dbConfig.HOST,
dialect : dbConfig.DIALECT
})
//Db contains all the database models and (sequelize and Sequelize) constants so that it can be used outside using imports 
const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = require('./users.model')(sequelize,Sequelize);
db.userInfo = require('./userInfo.model')(sequelize,Sequelize)
db.userRole = require('./userRoles.model')(sequelize,Sequelize);



//Relationship between user and userInfo
db.user.hasOne(db.userInfo,{
    foreignKey:'userId'
});
//Relationship between user and user Roles
db.user.hasMany(db.userRole);
// db export
module.exports = db;
