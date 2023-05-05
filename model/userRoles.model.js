//Model that defines the structure of User Role Table
module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define("userRole", {
    type: {
      type: Sequelize.STRING,
    },
  });
  return UserRole;
};
