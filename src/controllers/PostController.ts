import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PostController{
    constructor(){

    }
    async listPosts(req: Request, res: Response) {
        try {
          const posts = await prisma.post.findMany({
            include: {
              author: true,  // Inclui as informações do autor
            },
          });
      
          res.json(posts);  // Retorna os posts com o autor
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            error: error,
          });
        }
      }
      
    async createPost(req: Request, res: Response) {
        try {
            const { title, content, authorId } = req.body;  // Desestrutura o authorId
            if (!title) {
                return res.status(400).json({
                    status: 400,
                    message: "Você precisa inserir um título",
                });
            }
            if (!content) {
                return res.status(400).json({
                    status: 400,
                    message: "O post deve possuir um conteúdo",
                });
            }
            const newPost = await prisma.post.create({
                data: {
                    title,
                    content,
                    authorId,  // Associa o post com o authorId
                },
            });
            
            res.json({
                status: 200,
                newPost, // Retorna o novo post com o authorId
            });
        } catch (error) {
            console.log(error);
            res.json({
                status: 500,
                message: error,
            });
        }
    }
    
    async deletePost(req: Request, res: Response){
        try{
            const postId = req.params.id

            await prisma.post.delete({
                where: {
                    id: parseInt(postId)
                },
            })

            res.status(400).json({
                status: 200,
                message: "Post deletado com sucesso"
            })
        }catch(error){
            console.log(error);
            res.json({
              status: 500,
              message: error,
            });
        }
    }
    async editPost(req: Request, res: Response) {
        try {
            const postId = req.params.id;
            const { title, content, authorId } = req.body;  // Desestrutura o authorId
            if (!title) {
                return res.status(400).json({
                    status: 400,
                    message: "Você precisa inserir um título",
                });
            }
            if (!content) {
                return res.status(400).json({
                    status: 400,
                    message: "O post deve possuir um conteúdo",
                });
            }
            const updatedPost = await prisma.post.update({
                where: {
                    id: parseInt(postId),
                },
                data: {
                    title,
                    content,
                    authorId,  // Atualiza o authorId
                },
            });
    
            res.json({
                status: 200,
                updatedPost, // Retorna o post atualizado
            });
        } catch (error) {
            console.log(error);
            res.json({
                status: 500,
                message: error,
            });
        }
    }
    
}

export default new PostController();