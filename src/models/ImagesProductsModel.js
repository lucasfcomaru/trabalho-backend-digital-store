const { DataTypes, Model } = require("sequelize");
const connection = require("../config/connection");
const ProductsModel = require('./ProductsModel'); // Importando ProductsModel

class ImagesProductsModel extends Model {}

// Definindo o modelo ImagesProductsModel
ImagesProductsModel.init(
  {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductsModel,
            key: 'id', // Referência à chave primária em ProductsModel
        }
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "imagesProducts",
    timestamps: false,
    sequelize: connection,
    modelName: "ImagesProductsModel",
  }
);

module.exports = ImagesProductsModel;
