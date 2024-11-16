const UserModel = require("../models/UserModel");

class UserController {
  async listar(request, response) {
    try {
      const { id } = request.params; // Obtém o ID da URL
      const user = await UserModel.findByPk(id, {
        attributes: ["id", "firstname", "surname", "email"],
      }); // Busca o usuário pelo ID

      if (!user) {
        return response.status(404).json({ error: "Usuário não encontrado" });
      }

      return response.json(user);
    } catch (error) {
      return response
        .status(404)
        .json({ error: "O recurso solicitado não existe." });
    }
  }

  async criar(request, response) {
    try {
      let body = request.body;
      await UserModel.create(body);
      response.status(201).json({
        message: "Usuário cadastrado com sucesso.",
      });
    } catch (error) {
      return response
        .status(400)
        .json({ error: "O usuário não foi cadastrado" });
    }
  }

  async atualizar(request, response) {
    try {
      const { id } = request.params; // ID do usuário na URL
      const { firstname, surname, email } = request.body; // Dados enviados no corpo da requisição

      // Verifica se o usuário existe
      const user = await UserModel.findByPk(id);
      if (!user) {
        return response.status(404).json({ error: "Usuário não encontrado" });
      } else if (!firstname || !surname || !email) {
        return response
          .status(400)
          .json({ error: "Campos obrigatórios não preenchidos" }); // Bad Request
      }

      // Atualiza o usuário
      await user.update({ firstname, surname, email });

      return response
        .status(200)
        .json({ message: "Usuário " + user.firstname + " atualizado com sucesso" });
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Erro ao atualizar o usuário", details: error.message });
    }
  }

  async deletar(request, response) {
    try {
      const { id } = request.params; // ID do usuário na URL
  
      // Verifica se o usuário existe
      const user = await UserModel.findByPk(id);
      if (!user) {
        return response.status(404).json({ error: "Usuário não encontrado" });
      }
  
      // Deleta o usuário
      await user.destroy();
  
      return response.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Erro ao deletar o usuário", details: error.message });
    }
  }
}

module.exports = UserController;
