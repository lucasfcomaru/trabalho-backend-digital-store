const { DataTypes, Model } = require("sequelize");
const connection = require("../config/connection");
const ProductsModel = require('./ProductsModel')
const CategoriesModel = require('./CategoriesModel')

class ProductsCategoriesModel extends Model {}

ProductsCategoriesModel.init(
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductsModel,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CategoriesModel,
        key: "id",
      },
    },
  },
  {
    tableName: "productsCategories",
    timestamps: false,
    sequelize: connection,
    modelName: "ProductsCategoriesModel",
  }
);

module.exports = ProductsCategoriesModel;
