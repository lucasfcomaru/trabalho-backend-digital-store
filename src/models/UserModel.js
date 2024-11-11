const { DataTypes, Model } = require("sequelize");
const connection = require("../config/connection");

class UserModel extends Model {}

UserModel.init(
  {
    firstname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    sequelize: connection,
    modelName: "UserModel",
  }
);

module.exports = UserModel;
