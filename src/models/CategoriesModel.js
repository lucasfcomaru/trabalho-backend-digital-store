const { DataTypes, Model } = require("sequelize");
const connection = require("../config/connection");

class CategoriesModel extends Model {}

CategoriesModel.init(
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    use_in_menu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    sequelize: connection,
    modelName: "CategoriesModel",
  }
);

module.exports = CategoriesModel;
