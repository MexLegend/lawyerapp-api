const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
import { Request, Response } from 'express';

import Post from '../models/postMdl';
import PostAnalytics from '../models/postAnalyticsMdl';

class PostController {
  // Insert a New Row/Document Into The Posts Collection
  public async create(req: any, res: Response) {
    try {
      const {
        postImage: { url: postImage = null, public_id = null } = {},
        postData
      } = req.body;

      const post = await Post.create({
        ...(postImage ? { postImage } : {}),
        ...(public_id ? { public_id } : {}),
        ...postData
      });

      const postAnalyticN = new PostAnalytics({
        comments: [],
        dislikes: 0,
        likes: 0,
        reactions: [],
        post: post._id
      });

      await PostAnalytics.create(postAnalyticN);

      res
        .status(201)
        .json({ message: 'Articulo creado correctamente', ok: true, post });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear el articulo', ok: false });
    }
  }

  // Delete Temporary a Row/Document From The Posts Collection
  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const changeStatus = {
        status: false
      };

      const post: any = await Post.findOneAndUpdate({ _id: id }, changeStatus, {
        new: true
      });

      if (!post) {
        return res.status(404).json({
          message: 'No se encontro al Articulo',
          ok: false
        });
      }

      return res.json({
        message: `Articulo ${post.postTitle} borrado`,
        ok: true,
        post
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'No se encontro el Articulo',
        ok: false
      });
    }
  }

  // Get All Rows/Documents From Posts Collection
  public async get(req: Request, res: Response) {
    try {
      const { page = 1, perPage = 10, status, processState } = req.query;

      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        populate: [
          {
            path: 'user'
          },
          {
            path: 'postCategories.category'
          }
        ],
        sort: {
          created_at: -1
        }
      };

      let processStateQuery = processState
        ? [
            {
              status
            },
            {
              processState: 'PUBLISH'
            }
          ]
        : [
            {
              status
            }
          ];

      const query = {
        $and: processStateQuery
      };

      console.log(query);

      const posts = await Post.paginate(query, options);

      return res.status(200).json({
        posts,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get All Rows/Documents Of Lawyer From Posts Collection
  public async getByLawyer(req: Request, res: Response) {
    try {
      const { page = 1, perPage = 10, status, lawyerId } = req.query;

      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        populate: [
          {
            path: 'user'
          },
          {
            path: 'postCategories.category'
          }
        ],
        sort: {
          created_at: -1
        }
      };

      let roleQuery = [
        {
          processState: 'PUBLISH'
        },
        {
          status
        },
        {
          user: lawyerId
        }
      ];

      const query = {
        $and: roleQuery
      };

      const posts = await Post.paginate(query, options);

      return res.status(200).json({
        posts,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get All Rows/Documents From Posts Collection With Rol Condition
  public async getByRol(req: Request, res: Response) {
    try {
      const { page = 1, perPage = 10, status, user } = req.query;

      const parsedUserData = JSON.parse(user);

      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        populate: [
          {
            path: 'user'
          },
          {
            path: 'postCategories.category'
          }
        ],
        sort: {
          created_at: -1
        }
      };

      let roleQuery =
        parsedUserData.role === 'ADMIN'
          ? [
              {
                status
              }
            ]
          : [
              {
                status
              },
              {
                user: parsedUserData._id
              }
            ];

      const query = {
        $and: roleQuery
      };

      const posts = await Post.paginate(query, options);

      return res.status(200).json({
        posts,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From Posts Collection
  public async getOne(req: Request, res: Response) {
    try {
      const post = await Post.findOne({ _id: req.params.id })
        .populate('user')
        .populate('postCategories.category');

      res.status(200).json({ ok: true, post });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Update One or More Rows/Documents From Posts Collection
  public async update(req: any, res: Response) {
    try {
      const { id } = req.params;
      const {
        postImage: { url: postImage = null, public_id = null } = {},
        postData,
        cloudinaryItemsArray
      } = req.body;

      // Remove Cloudinary Post Main Image And Update It If Request Data Has Image Value
      if (postImage) {
        const postRequestData: any = await Post.findById({ _id: id });
        if (
          postRequestData.public_id &&
          postRequestData.public_id !== undefined &&
          postRequestData.public_id !== ''
        )
          await cloudinary.v2.uploader.destroy(postRequestData.public_id);
      }

      // Remove Cloudinary Post Attached Files Or Images
      if (cloudinaryItemsArray.length > 0)
        cloudinaryItemsArray.map(
          async (item: any) => await cloudinary.v2.uploader.destroy(item)
        );

      const post: any = await Post.findByIdAndUpdate(
        { _id: id },
        {
          ...(postImage ? { postImage } : {}),
          ...(public_id ? { public_id } : {}),
          ...postData
        },
        {
          new: true
        }
      );

      return res.json({
        message: 'Articulo actualizado correctamente',
        ok: true,
        post
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar el articulo', ok: false });
    }
  }

  // Change The State To Publish Or Rejected From One Row/Document Of Posts Collection
  public async updateState(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const changeStatus = {
        processState: req.body.processState
      };

      const state =
        req.body.processState === 'REVIEWING'
          ? 'En revisión'
          : req.body.processState === 'PUBLISH'
          ? 'Publicado'
          : 'Rechazado';

      const postDB: any = await Post.findOneAndUpdate(
        { _id: id },
        changeStatus,
        {
          new: true
        }
      ).populate('user');

      if (!postDB) {
        return res.status(404).json({
          message: 'No se encontro el Artículo',
          ok: false
        });
      }

      return res.json({
        post: postDB,
        message: `Artículo ${postDB.postTitle} ${state}.`,
        ok: true
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'No se encontro el Artículo',
        ok: false
      });
    }
  }
}

const postController = new PostController();
export default postController;
