import { Request, Response } from 'express';

import Case from '../models/caseMdl';
import Volume from '../models/volumeMdl';

class VolumeController {
  // Insert a New Row/Document Into The Volumes Collection
  public async create(req: any, res: Response) {
    try {
      const { idCase } = req.params;
      let volumeN: any = new Volume({
        case: idCase
      });

      const volume = await Volume.create(volumeN);

      res
        .status(201)
        .json({ volume, ok: true, message: 'Tomo creado correctamente' });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear el Tomo', ok: false });
    }
  }

  // Delete Temporary a Row/Document From The Volumes Collection
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
        message: `Caso ${caseDB.affair} borrado`,
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

  // Get All Rows/Documents From Volumes Collection
  public async get(req: Request, res: Response) {
    try {
      const { idCase } = req.params;
      const volumes = await Volume.find({
        case: idCase
      });
      res.status(200).json({ volumes, ok: true });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

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
}

const volumeController = new VolumeController();
export default volumeController;
