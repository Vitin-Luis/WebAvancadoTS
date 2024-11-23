import express from "express";
import AuthRouter from "./routes/AuthRoutes";

import CommentRouter from "./routes/CommentRoutes";
import PostRouter from "./routes/PostRoutes";
import UserRouter from "./routes/UserRoutes";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors());

app.use(UserRouter);
app.use(PostRouter);
app.use(CommentRouter);
app.use(AuthRouter);

app.listen(3000, function () {
  console.log("Servidor rodando na porta 3000");
});
