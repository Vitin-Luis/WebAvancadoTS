import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CheckUserPassword } from "../utils/HashPassword";

const prisma = new PrismaClient();

class AuthController {
  constructor() {}

  async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.json({
          status: 400,
          message: "Email ou password não encontrados!",
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return res.json({
          status: 401,
          message: "Email não existe!",
        });
      }

      const passwordCheck = await CheckUserPassword(password, user.password);

      if (!passwordCheck) {
        return res.json({
          status: 401,
          message: "Usuário ou senha inválidos!",
        });
      }

      return res.json({
        status: 200,
        user: {
          token: "jioejoiqjoeijqoiejoi",
        },
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: 500,
        message: error,
      });
    }
  }

  async signup() {}

  async signout() {}
}

export default new AuthController();
