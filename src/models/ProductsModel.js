const { DataTypes, Model } = require("sequelize");
const connection = require("../config/connection");
const ImagesProductsModel = require("./ImagesProductsModel");

class ProductsModel extends Model {}

ProductsModel.init(
  {
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
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
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.STRING(300),
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price_with_discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "products",
    timestamps: true,
    sequelize: connection,
    modelName: "ProductsModel",
  }  
);

module.exports = ProductsModel;
