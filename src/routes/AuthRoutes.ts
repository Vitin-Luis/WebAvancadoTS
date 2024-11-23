import { Router } from "express";
import AuthController from "../controllers/AuthController";


const AuthRouter = Router()

AuthRouter.post("/auth/signin", AuthController.signIn)
AuthRouter.post("/auth/signup", AuthController.signUp)

export default AuthRouter;