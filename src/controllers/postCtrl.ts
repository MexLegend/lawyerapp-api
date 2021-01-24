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
      const { content, external_sources, title } = req.body.post;

      const postN = new Post({
        content,
        external_sources,
        img: req.body.img.url ? req.body.img.url : null,
        processState: req.body.processState
          ? req.body.processState
          : 'REVIEWING',
        public_id: req.body.img.public_id ? req.body.img.public_id : '',
        title,
        user: req.user._id
      });
      const post = await Post.create(postN);

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
        message: `Articulo ${post.title} borrado`,
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
      const {
        filter,
        filterOpt = 'title',
        page = 1,
        perPage = 10,
        orderField,
        orderType,
        status,
        processState
      } = req.query;

      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        populate: [
          {
            path: 'user'
          }
        ],
        sort: {
          created_at: -1
        }
      };

      let filtroE = new RegExp(filter, 'i');
      let processStateQuery = processState
        ? [
            {
              [filterOpt]: filtroE
            },
            {
              status
            },
            {
              processState: 'PUBLISH'
            }
          ]
        : [
            {
              [filterOpt]: filtroE
            },
            {
              status
            }
          ];

      const query = {
        $and: processStateQuery
      };

      if (orderField && orderType) {
        options.sort = {
          [orderField]: orderType
        };
      }

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
      const {
        filter,
        filterOpt = 'title',
        page = 1,
        perPage = 10,
        orderField,
        orderType,
        status,
        user
      } = req.query;

      const parsedUserData = JSON.parse(user);

      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        populate: [
          {
            path: 'user'
          }
        ],
        sort: {
          created_at: -1
        }
      };

      let filtroE = new RegExp(filter, 'i');
      let roleQuery =
        parsedUserData.role === 'ADMIN'
          ? [
              {
                [filterOpt]: filtroE
              },
              {
                status
              }
            ]
          : [
              {
                [filterOpt]: filtroE
              },
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

      if (orderField && orderType) {
        options.sort = {
          [orderField]: orderType
        };
      }

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
      const post = await Post.findOne({ _id: req.params.id }).populate('user');
      res.status(200).json({ ok: true, post });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Update One or More Rows/Documents From Posts Collection
  public async update(req: any, res: Response) {
    try {
      const { id } = req.params;
      const { content, external_sources, title } = req.body.post;
      const postG: any = await Post.findOne({ _id: id });

      if (req.body.img.url) {
        if (
          postG.public_id &&
          postG.public_id !== undefined &&
          postG.public_id !== ''
        ) {
          await cloudinary.v2.uploader.destroy(postG.public_id);
        }
      }

      const postU = {
        content:
          content !== undefined && content !== '' ? content : postG.content,
        external_sources:
          external_sources !== undefined && external_sources !== ''
            ? external_sources
            : postG.external_sources,
        img: req.body.img.url ? req.body.img.url : postG.img,
        public_id: req.body.img.public_id
          ? req.body.img.public_id
          : postG.public_id,
        processState: req.body.processState
          ? req.body.processState
          : postG.processState,
        title: title !== undefined && title !== '' ? title : postG.title
      };

      const post: any = await Post.findOneAndUpdate({ _id: id }, postU, {
        new: true
      });

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
        req.body.processState === 'PUBLISH' ? 'Publicado' : 'Rechazado';

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
        message: `Artículo ${postDB.title} ${state}.`,
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
