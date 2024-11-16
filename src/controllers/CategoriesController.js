const CategoriesModel = require("../models/CategoriesModel");
const { use } = require("../routes/UserRoutes");

class CategoriesController {
  async listarCategorias(request, response) {
    // Buscar todas as categorias (sem limite ou paginação):
    // /v1/category/search?limit=-1&page=1&fields=name,slug&use_in_menu=true

    // Buscar categorias com paginação:
    // /v1/category/search?limit=10&page=2&fields=name,slug
    try {
      // Obter os parâmetros da query string
      const {
        limit = 12,
        page = 1,
        fields = "name,slug",
        use_in_menu,
      } = request.query;

      // Definir os campos a serem retornados
      const fieldsArray = fields.split(","); // Converte a string de campos em um array de strings

      // Converte limit para um número, se for -1, significa que não deve haver limite
      const limitValue = limit === "-1" ? null : parseInt(limit, 10);

      // Converte page para um número (o padrão é 1)
      const pageValue = parseInt(page, 10);

      // Condição de filtro para `use_in_menu` (caso não seja undefined)
      const whereCondition =
        use_in_menu !== undefined
          ? { use_in_menu: use_in_menu === "true" }
          : {};

      // Paginando apenas se limit não for -1
      const pagination =
        limitValue !== null
          ? {
              limit: limitValue,
              offset: (pageValue - 1) * limitValue, // Cálculo do offset com base na página
            }
          : {};

      // Busca as categorias com base nos parâmetros fornecidos
      const result = await CategoriesModel.findAll({
        where: whereCondition,
        attributes: fieldsArray,
        ...pagination, // Inclui a paginação apenas se o limite não for -1
      });

      // Se a consulta retornar dados, conta o total de itens
      const total =
        limitValue !== null
          ? await CategoriesModel.count({ where: whereCondition })
          : result.length;

      // Retorna os dados e o total de itens
      return response.status(200).json({
        data: result,
        total,
        limit: limitValue || 12, // Retorna o valor de limite ou 12 como padrão
        page: pageValue, // Retorna o número da página
      });
    } catch (error) {
      return response.status(400).json({
        error: "Erro ao processar a requisição",
        details: error.message,
      });
    }
  }

  async informacaoCategoria(request, response) {
    try {
      const { id } = request.params; // Obtém o ID da URL
      const category = await CategoriesModel.findByPk(id, {
        attributes: ["id", "name", "slug", "use_in_menu"],
      }); // Busca a categoria pelo ID

      if (!category) {
        return response.status(404).json({ error: "Categoria não encontrada" });
      }

      return response.status(200).json(category.get());
    } catch (error) {
      return response.status(500).json({
        error: "O servidor encontrou um erro inesperado.",
        details: error.message,
      });
    }
  }

  async criar(request, response) {
    try {
      let body = request.body;
      await CategoriesModel.create(body);
      response.status(201).json({
        message: "Categoria cadastrada com sucesso.",
      });
    } catch (error) {
      return response.status(400).json({
        error: "Dados incorretos. Categoria não cadastrada",
        details: error.message,
      });
    }
  }

  async atualizar(request, response) {
    try {
      const { id } = request.params; // ID do usuário na URL
      const { name, slug, use_in_menu } = request.body; // Dados enviados no corpo da requisição
      // Verifica se o usuário existe
      const category = await CategoriesModel.findByPk(id);
      if (!category) {
        return response.status(404).json({ error: "Categoria não encontrada" });
      } else if (!name || !slug || !use_in_menu) {
        return response
          .status(400)
          .json({ error: "Campos obrigatórios não preenchidos" }); // Bad Request
      }
      // Atualiza o usuário
      await category.update({ name, slug, use_in_menu });
      return response
        .status(200)
        .json({
          message: "Categoria " + category.name + " atualizada com sucesso",
        });
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Erro ao atualizar a categoria", details: error.message });
    }
  }

  async deletar(request, response) {
    try {
      const { id } = request.params; // ID do usuário na URL
      // Verifica se o usuário existe
      const category = await CategoriesModel.findByPk(id);
      if (!category) {
        return response.status(404).json({ error: "Categoria não encontrada" });
      }
      // Deleta o usuário
      await category.destroy();
      return response
        .status(200)
        .json({ message: "Categoria deletado com sucesso" });
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Erro inesperado ao deletar categoria", details: error.message });
    }
  }
}

module.exports = CategoriesController;
