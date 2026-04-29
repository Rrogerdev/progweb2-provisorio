const prisma = require("../config/prisma"); 
 
class UsuariosController { 
  static async listar(req, res) { 
    try { 
      const usuarios = await prisma.usuario.findMany({ 
        orderBy: { id: "asc" } 
      }); 
 
      res.send(200, usuarios); 
    } catch (error) { 
      res.send(500, { message: "Erro ao listar usuários." }); 
    } 
  } 
 
  static async criar(req, res) { 
    try { 
      const { nome, email } = req.body; 
 
      if (!nome || !email) { 
        res.send(400, { 
          message: "Nome e email são obrigatórios." 
        }); 
      } 
      const novoUsuario = await prisma.usuario.create({ 
        data: { nome, email } 
      }); 
 
      res.send(201, novoUsuario); 
    } catch (error) { 
      if (error.code === "P2002") { 
        res.send(409, { message: "Já existe usuário com esse email." }); 
      } 
 
      res.send(500, { message: "Erro ao cadastrar usuário." }); 
    } 
  } 
} 
 
module.exports = UsuariosController; 