import { Request, Response } from 'express';

import File from '../models/fileMdl';
import Tracking from '../models/trackingMdl';
import { Types } from 'mongoose';

class TrackingController {
  public async create(req: any, res: Response) {
    console.log(req.body);
    console.log(req.files);
    console.log(req.files.length >= 1);
    // console.log(req.params)
    //   return;
    try {
      const { id } = req.params;
      const trackings = await Tracking.find({ file: id });
      console.log(trackings.length);
      //   return;
      const totalT = Number(trackings.length) + 1;

      if (req.body.comment) {
        console.log('COMMENT---');
        const trackingN: any = new Tracking({
          comments: [
            {
              comment: req.body.comment,
              numV: 1
            }
          ],
          documents: [],
          file: id,
          status: 'OPEN',
          track: totalT,
          volumes: [
            {
              num: 1
            }
          ]
        });

        const tracking = await Tracking.create(trackingN);

        return res.json({
          tracking,
          message: 'Seguimiento creado correctamente',
          ok: true
        });
      } else if (req.files && req.files.length >= 1) {
        console.log(req.files);
        console.log('FILES---');

        const trackingN: any = new Tracking({
          comments: [],
          documents: [],
          file: id,
          status: 'OPEN',
          track: totalT,
          volumes: [
            {
              num: 1
            }
          ]
        });

        req.files.forEach((elem: any) => {
          let filePath = `${req.hostname}:3000/ftp/uploads/${elem.originalname}`;

          trackingN.documents.push({
            document: filePath,
            numV: 1
          });
        });

        const tracking = await Tracking.create(trackingN);

        return res.json({
          tracking,
          message: 'Seguimiento creado correctamente',
          ok: true
        });
      } else if (req.body.status) {
        //    console.log(req.body.status);
        //    console.log('STATUS---');
        //    return;
        const trackingN: any = new Tracking({
          comments: [],
          documents: [],
          file: id,
          status: req.body.status,
          track: totalT,
          volumes: [
            {
              num: 1
            }
          ]
        });

        const tracking = await Tracking.create(trackingN);

        return res.json({
          tracking,
          message: 'Seguimiento creado correctamente',
          ok: true
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear el Seguimiento', ok: false });
    }
  }

  public async delete(req: Request, res: Response) {
    // console.log(req.params)
    // return;
    try {
      const { id, idDoc } = req.params;
      const tracking: any = await Tracking.findOne({
        _id: id
      });

      let newDocs: any = [];

      newDocs = tracking.documents.filter((doc: any) => {
        return doc._id.toString() !== idDoc.toString();
      });

      const trackingU: any = await Tracking.findOneAndUpdate(
        {
          _id: id
        },
        {
          $set: { documents: newDocs }
        },
        {
          new: true
        }
      );

      console.log('NEWDOCS>>', newDocs);
      res.status(200).json({ tracking: trackingU, ok: true });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async getByLowyer(req: any, res: Response) {
    try {
      console.log(req.user._id);
      // const files: any = await File.aggregate([
      //   {
      //     $match: {
      //       user: req.user._id,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: 'trackings',
      //       localField: '_id',
      //       foreignField: 'file',
      //       as: 'tracks',
      //     },
      //   },
      // ])

      const files: any = await File.aggregate([
        {
          $match: {
            user: Types.ObjectId(req.user._id)
          }
        },
        {
          $lookup: {
            from: 'trackings',
            let: { idFile: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$file', '$$idFile'] }]
                  }
                }
              }
            ],
            as: 'tracks'
          }
        },
        {
          $lookup: {
            from: 'users',
            let: { client: '$assigned_client' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$client']
                  }
                }
              }
            ],
            as: 'assigned_client'
          }
        }
      ]);

      res.status(200).json({ files, ok: true });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async get(req: any, res: Response) {
    try {
      const {
        filter,
        filterOpt = 'track',
        page = 1,
        perPage = 10,
        orderField,
        orderType,
        status
      } = req.query;
      const { id } = req.params;
      console.log(id);
      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        populate: [
          {
            path: 'file'
          }
        ],
        sort: {
          track: 1
        }
      };

      let filtroE = new RegExp(filter, 'i');

      const query = {
        status: 'OPEN',
        $or: [
          {
            file: id
          }
        ]
      };

      if (orderField && orderType) {
        options.sort = {
          [orderField]: orderType
        };
      }

      const trackings = await Tracking.paginate(query, options);

      return res.status(200).json({
        trackings,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const file = await Tracking.findOne({ _id: req.params.id }).populate(
        'assigned_client'
      );

      res.status(200).json({ ok: true, file });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async update(req: any, res: Response) {
    // console.log(req.body);
    // console.log(req.files);
    // console.log(req.params)
    // return;
    try {
      const { id } = req.params;

      if (req.body.comment) {
        const newComment = {
          comment: req.body.comment,
          numV: 1
        };

        // let fileV: any = await Tracking.findOne({ _id: id });
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

        const tracking = await Tracking.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              comments: newComment
            }
          },
          {
            new: true
          }
        );

        return res.json({
          tracking,
          message: 'Comentarios agregados',
          ok: true
        });
      } else if (req.files && req.body.tracking) {
        console.log(req.files);
        let documents: any[] = [];
        req.files.forEach((elem: any) => {
          let filePath = `${req.hostname}:3000/ftp/uploads/${elem.originalname}`;

          documents.push({
            document: filePath,
            numV: 1
          });
        });
        console.log(documents);
        // return;

        const tracking = await Tracking.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              documents
            }
          },
          {
            new: true
          }
        );

        return res.json({
          tracking,
          message: 'Archivos agregados correctamente',
          ok: true
        });
      } else {
        const tracking = await Tracking.findOneAndUpdate(
          { _id: id },
          req.body,
          {
            new: true
          }
        );

        return res.json({
          tracking,
          message: 'Expediente actualizado correctamente',
          ok: true
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar el Expediente', ok: false });
    }
  }
}

const trackingController = new TrackingController();
export default trackingController;
