import { Request, Response } from 'express';

import File from '../models/fileMdl';

class FileController {
  public async create(req: any, res: Response) {
    try {
      const {
        actor,
        affair,
        assigned_client,
        defendant,
        intKey,
        comments,
        documents,
        extKey,
        observations,
        third,
      } = req.body;
      console.log(req.body, intKey);
      // return;

      const fileN = new File({
        actor,
        affair,
        assigned_client,
        comments: [],
        defendant,
        documents: [],
        extKey,
        intKey,
        observations,
        third,
        user: req.user._id,
        volumes: [
          {
            num: 1,
          },
        ],
      });

      const file = await File.create(fileN);

      res
        .status(201)
        .json({ file, ok: true, message: 'Expediente creado correctamente' });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear el Expediente', ok: false });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const changeStatus = {
        status: false,
      };

      const file: any = await File.findOneAndUpdate({ _id: id }, changeStatus, {
        new: true,
      });

      if (!file) {
        return res.status(404).json({
          message: 'No se encontro el Expediente',
          ok: false,
        });
      }

      return res.json({
        file,
        message: `Expediente ${file.affair} borrado`,
        ok: true,
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'No se encontro el Expediente',
        ok: false,
      });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const files = await File.find({
        assigned_client: req.params.idClient,
      }).populate('assigned_client');
      res.status(200).json({ files, ok: true });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async get(req: any, res: Response) {
    try {
      const {
        filter,
        filterOpt = 'affair',
        page = 1,
        perPage = 10,
        orderField,
        orderType,
        status,
      } = req.query;
      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        populate: [
          {
            path: 'assigned_client',
          },
        ],
        sort: {
          affair: 1,
        },
      };

      let filtroE = new RegExp(filter, 'i');

      const query = {
        [filterOpt]: filtroE,
        status: true,
        $or: [
          {
            user: req.user._id,
          },
          {
            assigned_client: req.user._id,
          },
        ],
      };

      if (orderField && orderType) {
        options.sort = {
          [orderField]: orderType,
        };
      }

      const files = await File.paginate(query, options);

      return res.status(200).json({
        files,
        ok: true,
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const file = await File.findOne({ _id: req.params.id }).populate(
        'assigned_client'
      );

      res.status(200).json({ ok: true, file });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async update(req: any, res: Response) {
      console.log(req.body)
      // console.log(id)
      return;
    try {
      const { id } = req.params;

      if (req.body.comment) {
        const newComment = {
          comment: req.body.comment,
          numV: 1,
        };

        // let fileV: any = await File.findOne({ _id: id });
        // console.log(fileV.volumes.length)
        // return;

        // let num = 0;
        // num += Number(fileV.volumes.length) + 1;

        // const newVolume = {
        //   num,
        //   volume: 'hahahah/20/04'
        // }

        // const newKey = {
        //   num,
        //   intKey: 'hahahah/20/04'
        // }

        console.log(newComment);
        // return;

        const file = await File.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              comments: newComment,
            },
          },
          {
            new: true,
          }
        );

        return res.json({
          file,
          message: 'Expediente actualizado correctamente',
          ok: true,
        });
      } else if (req.file) {
        console.log(req.file)
        let filePath = `${ req.hostname }:3000/ftp/uploads/${ req.file.originalname }`;
        const newDocument = {
          document: filePath,
          numV: 1,
        };
        
        const file = await File.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              documents: newDocument,
            },
          },
          {
            new: true,
          }
        );

        return res.json({
          file,
          message: 'Expediente actualizado correctamente',
          ok: true,
        });
      } else {
        const file = await File.findOneAndUpdate({ _id: id }, req.body, {
          new: true,
        });

        return res.json({
          file,
          message: 'Expediente actualizado correctamente',
          ok: true,
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar el Expediente', ok: false });
    }
  }

  public async upload(req: any, res: Response) {
    // return console.log(req.body.img.url)
    try {
      const { type, id, img } = req.body;

      console.log(req.file)
      console.log('storage location is ', req.hostname + '/' + req.file.path);
      return res.send(req.file);
    } catch (err) {
      res.status(500).json({
        err,
        ok: false,
      });
    }
  }
}

const fileController = new FileController();
export default fileController;
