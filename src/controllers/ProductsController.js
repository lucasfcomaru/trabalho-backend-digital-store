const { Sequelize } = require("sequelize");
const ProductsModel = require("../models/ProductsModel");
const ImagesProductsModel = require("../models/ImagesProductsModel");
const OptionsProductsModel = require("../models/OptionsProductsModel");
const ProductsCategoriesModel = require("../models/ProductsCategoriesModel");
const CategoriesModel = require("../models/CategoriesModel");

class ProductsController {
  // Requisito 01 - Listar produtos
  async listarProdutos(request, response) {
    try {
      const {
        limit = 12,
        page = 1,
        fields,
        match,
        category_ids,
        price_range,
        ...optionsFilters
      } = request.query;

      const where = {};

      // Filtro de nome e descrição (campo 'match')
      if (match) {
        where.name = { [Sequelize.Op.like]: `%${match}%` };
        where.description = { [Sequelize.Op.like]: `%${match}%` };
      }

      // Filtro de faixa de preço
      if (price_range) {
        const [min, max] = price_range.split("-");
        where.price = {
          [Sequelize.Op.between]: [parseFloat(min), parseFloat(max)],
        };
      }

      // Filtro de categorias, usando a tabela intermediária ProductsCategoriesModel
      if (category_ids) {
        where["$categories.category.id$"] = {
          [Sequelize.Op.in]: category_ids.split(",").map((id) => parseInt(id)),
        };
      }

      // Definindo as inclusões com os aliases corretos
      const include = [
        {
          model: ImagesProductsModel,
          attributes: ["id", "path"],
          as: "images", // Usando o alias 'images' definido na associação
        },
        {
          model: OptionsProductsModel,
          attributes: { exclude: ["productId"] },
          as: "options", // Usando o alias 'options' definido na associação
        },
        {
          model: ProductsCategoriesModel,
          as: "categories", // Usando o alias 'categories' para a associação ProductsModel -> ProductsCategoriesModel
          include: {
            model: CategoriesModel,
            as: "category", // Usando o alias 'category' para a associação ProductsCategoriesModel -> CategoriesModel
            attributes: ["id", "name"], // Selecionando os atributos 'id' e 'name' de CategoriesModel
          },
        },
      ];

      // Buscando os produtos com as inclusões e filtros
      const products = await ProductsModel.findAll({
        where,
        include,
        limit: limit == -1 ? null : parseInt(limit),
        offset: (page - 1) * (limit == -1 ? 0 : parseInt(limit)),
        attributes: fields ? fields.split(",") : undefined,
        logging: console.log, // Para visualizar a consulta SQL gerada
      });

      // Contando o total de produtos com os filtros aplicados
      const total = await ProductsModel.count({ where });

      // Retornando a resposta com os dados
      return response.status(200).json({
        data: products,
        total,
        limit,
        page,
        message: "Lista exibida com sucesso.",
      });
    } catch (error) {
      return response.status(400).json({
        error: "Lista não encontrada.",
        message: error.message,
      });
    }
  }

  // Requisito 02 - Informações do produto por ID
  async informacaoProduto(request, response) {
    try {
      const { id } = request.params;

      const product = await ProductsModel.findByPk(id, {
        include: [
          {
            model: ImagesProductsModel,
            as: "images", // Defina o alias correto aqui
            attributes: ["id", "path"],
          },
          {
            model: OptionsProductsModel,
            as: "options", // Se você estiver usando um alias para este modelo também
            attributes: { exclude: ["productId"] },
          },
          {
            model: ProductsCategoriesModel,
            as: "categories", // Alias para as associações com categorias, se necessário
            include: {
              model: CategoriesModel,
              as: "category", // Alias da categoria
            },
          },
        ],
      });

      if (!product)
        return response.status(404).json({ error: "Produto não encontrado." });

      return response
        .status(200)
        .json({ data: product, message: "Produto encontrado com sucesso." });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  // Requisito 03 - Criar produto
  async criar(request, response) {
    try {
      const { category_ids, images, options, ...productData } = request.body;

      // Criação do produto
      const product = await ProductsModel.create(productData);

      // Associação de categorias
      if (category_ids) {
        const categories = category_ids.map((categoryId) => ({
          productId: product.id,
          categoryId,
        }));
        await ProductsCategoriesModel.bulkCreate(categories);
      }

      // Adicionando imagens
      if (images) {
        const productImages = images.map((img) => ({
          productId: product.id,
          path: img.content,
        }));
        await ImagesProductsModel.bulkCreate(productImages);
      }

      // Adicionando opções
      if (options) {
        const productOptions = options.map((opt) => ({
          productId: product.id,
          ...opt,
        }));
        await OptionsProductsModel.bulkCreate(productOptions);
      }

      // Retornando o produto criado com sucesso e serializando com .toJSON()
      return response.status(201).json({
        product: product.toJSON(), // Usando .toJSON() para garantir que o objeto seja serializado corretamente
        message: "Cadastro realizado com sucesso.",
      });
    } catch (error) {
      return response.status(400).json({
        message: "Dados informados incorretos",
        error: error.message,
      });
    }
  }

  // Requisito 04 - Atualizar produto
  async atualizar(request, response) {
    try {
      const { id } = request.params;
      let { category_ids, images, options, ...productData } = request.body;
    
      // Verifica se category_ids foi fornecido
      if (category_ids) {
        // Se category_ids for um array, converta para inteiro
        if (Array.isArray(category_ids)) {
          category_ids = category_ids.map(id => parseInt(id, 10)); // Converte cada item para inteiro
        } else {
          category_ids = parseInt(category_ids, 10); // Se já for uma string, converte para inteiro
        }
      }
    
      const product = await ProductsModel.findByPk(id);
      if (!product) return response.status(404).json({ error: "Produto não encontrado." });
    
      // Atualiza os dados do produto
      await product.update(productData);
    
      // Agora category_ids é um valor inteiro ou um array de inteiros, podemos manipular diretamente
      if (category_ids) {
        // Se category_ids for um array, verifique se todas as categorias existem
        if (Array.isArray(category_ids)) {
          const validCategories = await CategoriesModel.findAll({
            where: { id: category_ids },
          });
    
          if (validCategories.length !== category_ids.length) {
            return response.status(400).json({
              message: "Algumas categorias fornecidas não existem no banco de dados.",
            });
          }
    
          // Remove as categorias existentes do produto
          await ProductsCategoriesModel.destroy({ where: { productId: id } });
    
          // Cria as novas associações de categoria
          const categories = category_ids.map((categoryId) => ({
            productId: id,
            categoryId,
          }));
          await ProductsCategoriesModel.bulkCreate(categories);
    
        } else {
          // Se category_ids for um único valor inteiro, verifica se a categoria existe
          const validCategory = await CategoriesModel.findOne({
            where: { id: category_ids },
          });
    
          if (!validCategory) {
            return response.status(400).json({
              message: "Categoria fornecida não existe no banco de dados.",
            });
          }
    
          // Remove as categorias existentes do produto
          await ProductsCategoriesModel.destroy({ where: { productId: id } });
    
          // Cria a nova associação de categoria
          await ProductsCategoriesModel.create({
            productId: id,
            categoryId: category_ids,
          });
        }
      }
    
      // Processamento de imagens
      if (images) {
        for (const img of images) {
          if (img.deleted) {
            await ImagesProductsModel.destroy({ where: { id: img.id } });
          } else if (img.id) {
            await ImagesProductsModel.update(img, { where: { id: img.id } });
          } else {
            await ImagesProductsModel.create({
              productId: id,
              path: img.content,
            });
          }
        }
      }
    
      // Processamento de opções
      if (options) {
        for (const opt of options) {
          if (opt.deleted) {
            await OptionsProductsModel.destroy({ where: { id: opt.id } });
          } else if (opt.id) {
            await OptionsProductsModel.update(opt, { where: { id: opt.id } });
          } else {
            await OptionsProductsModel.create({ productId: id, ...opt });
          }
        }
      }
    
      return response.status(204).send();
    } catch (error) {
      return response.status(400).json({
        message: "Dados informados incorretos.",
        error: error.message,
      });
    }    
  }

  // Requisito 05 - Deletar produto
  async deletar(request, response) {
    try {
      const { id } = request.params;
  
      // Encontrar o produto
      const product = await ProductsModel.findByPk(id);
      if (!product)
        return response.status(404).json({ error: "Produto não encontrado." });
  
      // Excluir as associações de categorias relacionadas ao produto
      await ProductsCategoriesModel.destroy({
        where: { productId: id },
      });
  
      // Excluir as associações de opções relacionadas ao produto
      await OptionsProductsModel.destroy({
        where: { productId: id },
      });
  
      // Excluir as imagens associadas ao produto
      await ImagesProductsModel.destroy({
        where: { productId: id },
      });
  
      // Excluir o produto
      await product.destroy();
      return response.status(204).send();
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Ocorreu um erro inesperado", error: error.message });
    }
  }  

}

module.exports = ProductsController;
