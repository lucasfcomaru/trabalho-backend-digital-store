const connection = require("../config/connection");

// Chamando os arquivos para sincronizar
const UserModel = require("../models/UserModel");
const CategoriesModel = require("../models/CategoriesModel");
const ProductsModel = require("../models/ProductsModel");
const ImagesProductsModel = require("../models/ImagesProductsModel");
const OptionsProductsModel = require("../models/OptionsProductsModel");
const ProductsCategoriesModel = require("../models/ProductsCategoriesModel");

// Definindo associações após a criação dos modelos
// Associação entre Products e Categories
ProductsModel.belongsToMany(CategoriesModel, { through: 'productsCategories' });
CategoriesModel.belongsToMany(ProductsModel, { through: 'productsCategories' });
// Associando ProductsModel com ImagesProductsModel (um-para-muitos)
ProductsModel.hasMany(ImagesProductsModel, {
  foreignKey: 'productId',
  as: 'images',  // Alias para usar na consulta
});

// Associando ImagesProductsModel com ProductsModel (muitos-para-um)
ImagesProductsModel.belongsTo(ProductsModel, {
  foreignKey: 'productId',
  as: 'product',  // Alias para usar na consulta
});

// Associando ProductsModel com OptionsProductsModel (um-para-muitos)
ProductsModel.hasMany(OptionsProductsModel, {
  foreignKey: 'productId',
  as: 'options',  // Alias para usar na consulta
});

// Associando OptionsProductsModel com ProductsModel (muitos-para-um)
OptionsProductsModel.belongsTo(ProductsModel, {
  foreignKey: 'productId',
  as: 'product',  // Alias para usar na consulta
});

// Associando ProductsModel com ProductsCategoriesModel (um-para-muitos)
ProductsModel.hasMany(ProductsCategoriesModel, {
  foreignKey: 'productId',
  as: 'categories',  // Alias para usar na consulta
});

// Associando ProductsCategoriesModel com ProductsModel (muitos-para-um)
ProductsCategoriesModel.belongsTo(ProductsModel, {
  foreignKey: 'productId',
  as: 'product',  // Alias para usar na consulta
});

// Associando CategoriesModel com ProductsCategoriesModel (um-para-muitos)
CategoriesModel.hasMany(ProductsCategoriesModel, {
  foreignKey: 'categoryId',
  as: 'product_categories',  // Alias para usar na consulta
});

// Associando ProductsCategoriesModel com CategoriesModel (muitos-para-um)
ProductsCategoriesModel.belongsTo(CategoriesModel, {
  foreignKey: 'categoryId',
  as: 'category',  // Alias para usar na consulta
});

//Força a criação de tabelas novas
connection.sync()
  .then(() => {
    console.log("Tabelas criadas com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao criar tabelas:", error);
    if (error.errors) {
        error.errors.forEach(e => console.error(e.message));
      }
  });