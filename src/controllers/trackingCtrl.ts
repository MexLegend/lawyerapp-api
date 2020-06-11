import { Request, Response } from 'express';

import File from '../models/fileMdl';
import Tracking from '../models/trackingMdl';
import { Types } from 'mongoose';

class TrackingController {
  public async create(req: any, res: Response) {
    try {
      const { id } = req.params;
      const trackings = await Tracking.find({ file: id });
      let docs: any[] = [];

      const totalT = Number(trackings.length) + 1;

      const trackingN: any = new Tracking({
        comment: req.body.comment ? req.body.comment : '',
        documents: [],
        file: id,
        status: req.body.status ? req.body.status : 'ACTIVO',
        track: totalT,
        volumes: [
          {
            num: 1
          }
        ]
      });

      if (req.files) {
        req.files.forEach((elem: any) => {
          let filePath = `${req.hostname}:${
            process.env.PORT || 3000
          }/ftp/uploads/${elem.originalname}`;

          docs.push(filePath);

          trackingN.documents.push({
            document: filePath,
            numV: 1
          });
        });
      }

      // console.log('TrackingN', trackingN.documents.length)
      // console.log(docs.length)
      // return;

      // if (trackingN.documents.length === docs.length) {

      const tracking = await Tracking.create(trackingN);

      return res.json({
        tracking,
        message: 'Seguimiento creado correctamente',
        ok: true
      });
      // }
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
      const { id } = req.params;

      const tracking: any = await Tracking.findOneAndDelete(
        {
          _id: id
        }
      );

      res.status(200).json({ tracking, ok: true });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async deleteDoc(req: Request, res: Response) {
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
      const trackingBD: any = await Tracking.findOne({ _id: id });
      let documents: any[] = [];
      let docs: any[] = [];
      let existD;
      let docsE: any[] = [];
      console.log(req.body);

      if (req.files) {

        if (trackingBD.documents.length >= 3) {
          return res.json({
            limit: true,
            message: 'Limite de archivos exedido',
            ok: true
          });
        } else {
          req.files.forEach((elem: any) => {
            let filePath = `${req.hostname}:${
              process.env.PORT || 3000
            }/ftp/uploads/${elem.originalname}`;

            existD = trackingBD.documents.findIndex(
              (e: any) => e.document === filePath
            );

            docs.push(filePath);

            if (existD === -1) {
              documents.push({
                document: filePath,
                numV: 1
              });
            } else {
              docsE.push(elem.originalname);
            }
          });

          if (existD !== -1 && docsE.length >= 1) {
            let message =
              docsE.length === 1
                ? `El archivo ${docsE[0]} ya existe`
                : `Los archivos: ${docsE.join(', ')} ya existen`;
            return res.json({
              exist: true,
              message,
              ok: true
            });
          } else {
            let tracking;
            // if (documents.length === docs.length) {
            if (documents.length >= 1) {
              tracking = await Tracking.findOneAndUpdate(
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
            }

            if (req.body.comment || req.body.status) {
              const trackingU = {
                comment: req.body.comment ? req.body.comment : trackingBD.comment,
                status: req.body.status ? req.body.status : 'ACTIVO'
              };
              tracking = await Tracking.findOneAndUpdate({ _id: id }, trackingU, {
                new: true
              });
            }

            return res.json({
              tracking,
              message: 'Archivos agregados correctamente',
              ok: true
            });
            // }
          }
        }
      }

      return;

      // if (req.files) {
      //   console.log(req.files);
      //   let documents: any[] = [];

      //   let existDocs: any[] = [];

      //   req.files.forEach((elem: any) => {
      //     let filePath = `${req.hostname}:3000/ftp/uploads/${elem.originalname}`;

      //         console.log(trackingBD.documents.length);
      //     if (trackingBD.documents.length >= 1) {

      //       trackingBD.documents.filter((doc: any) => {
      //         if(doc.document !== filePath) {
      //           // existDocs.push({
      //           //   name: elem.originalname,
      //           // });
      //           documents.push({
      //             document: filePath,
      //             numV: 1,
      //           });
      //         }
      //       });
      //     } else {
      //       documents.push({
      //         document: filePath,
      //         numV: 1,
      //       });
      //     }

      //   });
      //   // console.log(documents);
      //   console.log(`NEWDOCS:`, documents)
      //   // return;

      //   if(existDocs.length >= 1) {
      //     let word = existDocs.length === 1 ? 'El archivo ya existe' : 'Los archivos ya existen';
      //     return res.json({
      //       message: word,
      //       docs: existDocs,
      //       ok: true,
      //     });
      //   } else {
      //     const tracking = await Tracking.findOneAndUpdate(
      //       { _id: id },
      //       {
      //         $push: {
      //           documents,
      //         },
      //       },
      //       {
      //         new: true,
      //       }
      //     );

      //     return res.json({
      //       tracking,
      //       message: 'Archivos agregados correctamente',
      //       ok: true,
      //     });

      //   }

      // }
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar el Expediente', ok: false });
    }
  }
}

const trackingController = new TrackingController();
export default trackingController;
