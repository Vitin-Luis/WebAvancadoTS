import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CheckUserPassword, CreateHashPassword } from "../utils/HashPassword";
import { generateJWToken } from "../utils/JWT";

const prisma = new PrismaClient();

class AuthController{
    constructor(){

    }
    
    async signIn(req: Request, res: Response) {
        try {
          const { email, password } = req.body;
      
          // Validação de entrada
          if (!email || !password) {
            return res.status(400).json({
              status: 400,
              message: "Email ou senha não informados.",
            });
          }
      
          // Busca do usuário no banco de dados
          const user = await prisma.user.findUnique({
            where: { email },
          });
      
          if (!user) {
            return res.status(404).json({
              status: 404,
              message: "Um usuário com este email não existe.",
            });
          }
      
          // Verificação de senha
          const isPasswordValid = await CheckUserPassword(password, user.password);
      
          if (!isPasswordValid) {
            return res.status(401).json({
              status: 401,
              message: "Senha incorreta.",
            });
          }
      
          // Geração do token JWT
          const token = await generateJWToken(user);
      
          return res.status(200).json({
            status: 200,
            user: {
              id: user.id, 
              name: user.name,
              email: user.email,
              token: token,
              
            },
            message: "Login successful",
          });
        } catch (error) {
          console.error("Erro ao realizar signIn:", error);
          return res.status(500).json({
            status: 500,
            message: "Erro interno do servidor.",
            error: error instanceof Error ? error.message : "Erro desconhecido",
          });
        }
      }


    async signUp(req: Request, res: Response) {
        try {
            const { email, password, confirmPassword, name } = req.body;

            if (password !== confirmPassword) { 
                return res.status(400).json({
                    status: 400,
                    message: "As senhas devem ser iguais.",
                });
            }
    
            
            const existingUser = await prisma.user.findFirst({
                where: { email },
            });
    
            if (existingUser) {
                return res.status(400).json({
                    status: 400,
                    message: "Já existe um usuário com este e-mail.",
                });
            }
    
            // Cria o hash da senha
            const hashedPassword = await CreateHashPassword(password);
    
            if (!hashedPassword) {
                return res.status(500).json({
                    status: 500,
                    message: "Erro ao criar o hash da senha.",
                });
            }
    
            // Salva o novo usuário no banco de dados
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name, // Incluí o nome como exemplo
                },
            });
    
            return res.status(201).json({
                status: 201,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    nome: newUser.name,
                },
                message: "Usuário criado com sucesso.",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: "Falha ao realizar o cadastro."
            });
        }
    }
    
    async signOut(){

    }
}

export default new AuthController()