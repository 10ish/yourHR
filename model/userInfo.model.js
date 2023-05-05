//MOdel that defines the structure for UserInfo Table
module.exports = (sequelize, Sequelize) => {
  const userInfo = sequelize.define("userInfo", {
    name: {
      type: Sequelize.STRING,
    },
    age: {
      type: Sequelize.STRING,
    },
    positionApplied: {
      type: Sequelize.STRING,
    },
    dob: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.STRING,
    },
    currentRole: {
      type: Sequelize.STRING,
    },
    resume: {
      type: Sequelize.BLOB("long"),
    }
  });
  return userInfo;
};
