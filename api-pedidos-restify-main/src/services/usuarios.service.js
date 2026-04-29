// Integração com o microsserviço de Usuários.
// Usado para validar se o idUsuario informado realmente existe.
const fetch = require("node-fetch");

const BASE_URL = process.env.USUARIOS_API_URL || "http://localhost:3001";

class UsuariosService {
  static async buscarPorId(id) {
    try {
      const res = await fetch(`${BASE_URL}/usuarios/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("Erro ao chamar UsuariosService:", err.message);
      return null;
    }
  }
}

module.exports = UsuariosService;
