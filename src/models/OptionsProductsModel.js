const { DataTypes, Model } = require("sequelize");
const connection = require("../config/connection");
const ProductsModel = require('./ProductsModel')

class OptionsProductsModel extends Model {}

OptionsProductsModel.init(
  {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductsModel,
            key: 'id',
        }
      },
    title: {
      type: DataTypes.STRING(50),
      defaultValue: false,
    },
    shape: {
      type: DataTypes.ENUM('square', 'circle'),
      defaultValue: 'square',
    },
    radius: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    type: {
        type: DataTypes.ENUM('text', 'color'),
        defaultValue: 'text',
      },
      value: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
  },
  {
    tableName: "optionsProducts",
    timestamps: false,
    sequelize: connection,
    modelName: "OptionsProductsModel",
  }
);

module.exports = OptionsProductsModel;
