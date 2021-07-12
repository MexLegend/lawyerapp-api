import { Request, Response } from 'express';

import PracticeArea from '../models/practiceArea.Mdl';
import User from '../models/userMdl';
import { Types } from 'mongoose';

class PracticeAreaController {
  // Insert a New Row/Document Into The Practice Areas Collection
  public async create(req: any, res: Response) {
    try {
      const { author, practiceAreaData, lawyersList } = req.body;

      const practiceArea = await PracticeArea.create({
        ...practiceAreaData,
        author: author._id
      });

      const authorLawyerName = author.firstName + ' ' + author.lastName;

      // Add Created Practice Area To Lawyers List
      await User.updateMany(
        {
          _id: { $in: lawyersList.map((lawyerId: any) => lawyerId) }
        },
        { $push: { practice_areas: { practice_area: practiceArea._id } } }
      );

      res.status(201).json({
        message: 'Área de práctica creada correctamente',
        ok: true,
        practiceArea
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'Error al crear la área de práctica',
        ok: false
      });
    }
  }

  // Delete Completly a Row/Document From The Practice Areas Collection
  public async deleteCompletly(req: Request, res: Response) {
    try {
      const { idPracticeArea } = req.params;

      const practiceArea: any = await PracticeArea.findByIdAndDelete({
        _id: idPracticeArea
      });

      // Delete Pactice Area From All Users Collection
      await User.updateMany(
        {
          practice_areas: {
            practice_area: { $elemMatch: { _id: idPracticeArea } }
          }
        },
        {
          $set: {
            practice_areas: {
              practice_area: { $ne: { _id: idPracticeArea } }
            }
          }
        }
      );

      if (!practiceArea) {
        return res.status(404).json({
          message: 'No se encontro la área de práctica',
          ok: false
        });
      }

      return res.json({
        message: `Área de práctica ${practiceArea.name} eliminada completamente`,
        ok: true,
        practiceArea
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'No se encontro la área de práctica',
        ok: false
      });
    }
  }

  // Delete Pactice Area From One Lawyer Of Users Collection
  public async deleteSpecializedLawyer(req: Request, res: Response) {
    try {
      const { idPracticeArea } = req.params;
      const { lawyers } = req.body;

      const specializedLawyers = await User.updateMany(
        {
          _id: { $in: lawyers.map((lawyerId: any) => lawyerId) }
        },
        {
          $set: {
            practice_areas: {
              practice_area: { $ne: { _id: idPracticeArea } }
            }
          }
        }
      );

      res.status(200).json({ ok: true, specializedLawyers });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Delete Temporary a Row/Document From The Practice Areas Collection
  public async deleteTemporary(req: Request, res: Response) {
    try {
      const { idPracticeArea } = req.params;
      const changeStatus = {
        status: false
      };

      const practiceArea: any = await PracticeArea.findByIdAndUpdate(
        { _id: idPracticeArea },
        changeStatus,
        {
          new: true
        }
      );

      if (!practiceArea) {
        return res.status(404).json({
          message: 'No se encontro la área de práctica',
          ok: false
        });
      }

      return res.json({
        message: `Área de práctica ${practiceArea.name} enviada a la papelera`,
        ok: true,
        practiceArea
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'No se encontro la área de práctica',
        ok: false
      });
    }
  }

  // Get All Rows/Documents From Practice Areas Collection
  public async get(req: Request, res: Response) {
    try {
      const {
        page = 1,
        perPage = 10,
        status,
        processState,
        is_category
      } = req.query;

      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        populate: [
          {
            path: 'author'
          }
        ],
        sort: {
          created_at: 1
        }
      };

      let processStateQuery =
        processState === 'ALL'
          ? [
              {
                status
              },
              is_category === 'true' ? {} : { is_category }
            ]
          : [
              {
                status
              },
              is_category === 'true' ? {} : { is_category },
              {
                processState: processState
              }
            ];

      const query = {
        $and: processStateQuery
      };

      const practiceAreas = await PracticeArea.paginate(query, options);

      return res.status(200).json({
        practiceAreas: practiceAreas.docs,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From Practice Areas Collection
  public async getOne(req: Request, res: Response) {
    try {
      const practiceArea = await PracticeArea.findOne({
        _id: req.params.idPracticeArea
      });
      res.status(200).json({ ok: true, practiceArea });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get All Rows/Documents From Users Collection Where Parctice Area Matches
  public async getSpecializedLawyers(req: Request, res: Response) {
    try {
      const specializedLawyers = await User.aggregate([
        {
          $match: {
            practice_areas: {
              $elemMatch: {
                practice_area: Types.ObjectId(req.params.idPracticeArea)
              }
            }
          }
        },
        {
          $lookup: {
            from: 'rates',
            let: { idRating: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$data_id', '$$idRating']
                  }
                }
              },
              {
                $group: {
                  _id: '$_id',
                  ratingAvg: { $avg: '$rating' }
                }
              }
            ],
            as: 'ratingData'
          }
        }
      ]).sort({ firstName: 1 });

      res.status(200).json({ ok: true, specializedLawyers });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Update One or More Rows/Documents From Practice Areas Collection
  public async update(req: any, res: Response) {
    try {
      const { idPracticeArea } = req.params;
      const {
        practiceAreaData,
        lawyersList: { newLawyers, removedLawyers }
      } = req.body;

      if (newLawyers.length > 0) {
        await User.updateMany(
          {
            _id: { $in: newLawyers.map((newLawyerId: any) => newLawyerId) }
          },
          { $push: { practice_areas: { practice_area: idPracticeArea } } }
        );
      }

      if (removedLawyers.length > 0) {
        await User.updateMany(
          {
            _id: {
              $in: removedLawyers.map((removedLawyerId: any) => removedLawyerId)
            }
          },
          {
            $pull: {
              practice_areas: {
                practice_area: { _id: idPracticeArea }
              }
            }
          }
        );
      }

      const practiceArea: any = await PracticeArea.findByIdAndUpdate(
        { _id: idPracticeArea },
        practiceAreaData,
        {
          new: true
        }
      );

      return res.json({
        message: 'Área de práctica actualizada correctamente',
        ok: true,
        practiceArea
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'Error al actualizar la área de práctica',
        ok: false
      });
    }
  }

  // Add Lawyer Into One Practice Area
  public async updateSpecializedLawyer(req: Request, res: Response) {
    try {
      const { idPracticeArea, idLawyer } = req.body;

      const specializedLawyer: any = await User.findByIdAndUpdate(
        { _id: idLawyer },
        { $push: { practice_areas: { practice_area: idPracticeArea } } },
        {
          new: true
        }
      );

      if (!specializedLawyer) {
        return res.status(404).json({
          message: 'No se encontro el abogado',
          ok: false
        });
      }

      return res.json({
        specializedLawyer,
        message: `Abogado ${
          specializedLawyer.firstName + ' ' + specializedLawyer.lastName
        } agregado la área de práctica.`,
        ok: true
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'Error al actualizar la área de práctica',
        ok: false
      });
    }
  }

  // Change The State To Publish One Row/Document Of Practice Areas Collection
  public async updateState(req: Request, res: Response) {
    try {
      const { idPracticeArea } = req.params;
      const changeStatus = {
        processState: req.body.processState
      };
      const state =
        req.body.processState === 'APPROVED' ? 'aprobada' : 'en espera';

      const practiceArea: any = await PracticeArea.findByIdAndUpdate(
        { _id: idPracticeArea },
        changeStatus,
        {
          new: true
        }
      );

      if (!practiceArea) {
        return res.status(404).json({
          message: 'No se encontro la área de práctica',
          ok: false
        });
      }

      return res.json({
        practiceArea,
        message: `Área de práctica ${practiceArea.name} ${state}.`,
        ok: true
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'Error al actualizar la área de práctica',
        ok: false
      });
    }
  }
}

const practiceAreaController = new PracticeAreaController();
export default practiceAreaController;
