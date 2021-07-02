import { Request, Response } from 'express';

import Case from '../models/caseMdl';
import Tracking from '../models/trackingMdl';
import Volume from '../models/volumeMdl';

class CaseController {
  // Insert a New Row/Document Into The Cases Collection
  public async create(req: any, res: Response) {
    try {
      // return;
      const {
        actor,
        affair,
        assigned_client,
        defendant,
        extKey,
        observations,
        third
      } = req.body;

      const databaseCasesArray: any = await Case.find({
        user: req.user._id
      });

      let intKeyYear: string = `${new Date().getFullYear()}-`;
      let intKeyCaseNumber: number =
        Number(databaseCasesArray.length) === 0
          ? 1
          : Number(databaseCasesArray.length) + 1;
      let intKey = `${intKeyYear}${req.user.public_lawyer_id}-C${intKeyCaseNumber}/T1`;

      let caseN = {
        actor,
        affair,
        assigned_client,
        defendant,
        extKey,
        intKey: intKey,
        observations,
        third,
        user: req.user._id
      };

      const cases: any = await Case.find();
      let volume: any;

      const caseDB = await Case.create(caseN);

      const volumeN = new Volume({
        case: caseDB._id
      });
      volume = await Volume.create(volumeN);

      res
        .status(201)
        .json({ case: caseDB, ok: true, message: 'Caso creado correctamente' });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear el Caso', ok: false });
    }
  }

  // Delete Temporary a Row/Document From The Cases Collection
  public async deleteTemp(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const changeStatus = {
        status: 'DELETED'
      };

      const caseDB: any = await Case.findOneAndUpdate(
        { _id: id },
        changeStatus,
        {
          new: true
        }
      );

      if (!caseDB) {
        return res.status(404).json({
          message: 'No se encontro el Caso',
          ok: false
        });
      }

      return res.json({
        case: caseDB,
        message: `Caso ${caseDB.affair} eliminado`,
        ok: true
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'No se encontro el Caso',
        ok: false
      });
    }
  }

  // Get All Rows/Documents From Cases Collection With Condition
  public async get(req: any, res: Response) {
    try {
      const {
        filter,
        filterOpt = 'affair',
        page = 1,
        perPage = 10,
        orderField,
        orderType,
        status
      } = req.query;
      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        populate: [
          {
            path: 'assigned_client'
          }
        ],
        sort: {
          affair: 1
        }
      };

      let filtroE = new RegExp(filter, 'i');

      const query = {
        [filterOpt]: filtroE,
        status: { $ne: 'DELETED' },
        $or: [
          {
            user: req.user._id
          },
          {
            assigned_client: req.user._id
          }
        ]
      };

      if (orderField && orderType) {
        options.sort = {
          [orderField]: orderType
        };
      }

      const cases = await Case.paginate(query, options);

      return res.status(200).json({
        cases,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get All Rows/Documents From Cases Collection
  public async getAll(req: Request, res: Response) {
    try {
      const cases = await Case.find({
        assigned_client: req.params.idClient
      }).populate('assigned_client');
      res.status(200).json({ cases, ok: true });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From Cases Collection
  public async getOne(req: Request, res: Response) {
    try {
      const caseDB = await Case.findOne({ _id: req.params.id }).populate(
        'assigned_client'
      );

      res.status(200).json({ ok: true, case: caseDB });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Update One or More Rows/Documents From Cases Collection
  public async update(req: any, res: Response) {
    try {
      const { id } = req.params;
      const caseDB = await Case.findOneAndUpdate({ _id: id }, req.body, {
        new: true
      });

      return res.json({
        case: caseDB,
        message: 'Caso actualizado correctamente',
        ok: true
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar el Caso', ok: false });
    }
  }

  // Update Status From One Row/Document From Cases Collection
  public async updateStatus(req: any, res: Response) {
    try {
      const { id } = req.params;
      const newRole = req.body.status;
      const caseDB = await Case.findOneAndUpdate(
        { _id: id },
        { status: newRole },
        {
          new: true
        }
      );

      return res.json({
        case: caseDB,
        ok: true
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar el Caso', ok: false });
    }
  }
}

const caseController = new CaseController();
export default caseController;
