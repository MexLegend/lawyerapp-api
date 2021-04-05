import { Request, Response } from 'express';

import Case from '../models/caseMdl';
import Evidence from '../models/evidenceMdl';

import documents from '../helpers/documents';

class EvidenceController {
  // Update Status From One Row/Document From Evidences Collection
  public async changeTemp(req: Request, res: Response) {
    try {
      // return;
      const { idCase, idEvidence } = req.params;
      let { status, deleted } = req.body;
      const evidenceDB: any = await Evidence.findOne({ case: idCase });
      let newEvidences: any[] = [];

      status = status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';

      evidenceDB.evidences.forEach((evidence: any) => {
        if (evidence._id.toString() === idEvidence.toString()) {
          evidence.status = req.body.status ? status : deleted;
        }
        newEvidences.push(evidence);
      });

      const note = await Evidence.findOneAndUpdate(
        { case: idCase },
        {
          $set: {
            evidences: newEvidences
          }
        },
        {
          new: true
        }
      );

      if (!note) {
        return res.status(404).json({
          message: 'No se encontro la Nota',
          ok: false
        });
      }

      return req.body.status
        ? res.json({
            message: `${status === 'PUBLIC' ? 'Pública' : 'Privada'}`,
            note,
            ok: true
          })
        : res.json({
            deleted: true,
            message: 'Evidencia borrada',
            note,
            ok: true
          });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'No se encontro la Evidencia',
        ok: false
      });
    }
  }

  // Insert a New Row/Document Into The Evidences Collection
  public async create(req: any, res: Response) {
    try {
      const { idCase } = req.params;
      const evidenceDB: any = await Evidence.find({ case: idCase });
      let evidences: any[] = [];
      let newEvidence;
      let evidence;

      if (req.body) {
        req.body.map((evidence: any) => {
          evidences.push({
            name: evidence.name,
            path: evidence.url,
            public_id: evidence.public_id,
            size: evidence.size
          });
        });

        if (evidenceDB.length === 0) {
          newEvidence = {
            case: idCase,
            evidences: evidences
          };

          evidence = await Evidence.create(newEvidence);
        } else if (
          evidenceDB[0].evidences.length >= 1 ||
          evidenceDB[0].evidences.length === 0
        ) {
          evidence = await Evidence.findOneAndUpdate(
            { case: idCase },
            {
              $push: {
                evidences
              }
            },
            {
              new: true
            }
          );
        }

        // documents.docs = [];
      }

      return res.json({
        evidence,
        message: 'Evidencia creada correctamente',
        ok: true
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear la Evidencia', ok: false });
    }
  }

  // Delete Permanently a Row/Document From The Evidences Collection
  public async deleteFile(req: Request, res: Response) {
    try {
      const { idEvidence, idCase } = req.params;
      const evidence: any = await Evidence.findOne({
        _id: idEvidence
      });

      let newEvidences: any = [];

      newEvidences = evidence.evidences.filter((evidence: any) => {
        return evidence._id.toString() !== idCase.toString();
      });

      const evidenceU: any = await Evidence.findOneAndUpdate(
        {
          _id: idEvidence
        },
        {
          $set: { evidences: newEvidences }
        },
        {
          new: true
        }
      );

      res.status(200).json({ evidence: evidenceU, ok: true });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get All Rows/Documents From Evidences Collection
  public async get(req: any, res: Response) {
    try {
      const {
        filter,
        filterOpt = '',
        page = 1,
        perPage = 10,
        orderField,
        orderType
      } = req.query;
      const { idCase } = req.params;

      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        populate: [
          {
            path: 'case'
          }
        ],
        sort: {
          date: 1
        }
      };

      let filtroE = new RegExp(filter, 'i');

      const query = {
        case: idCase,
        status: { $ne: 'DELETED' }
      };

      if (orderField && orderType) {
        options.sort = {
          [orderField]: orderType
        };
      }

      const evidences = await Evidence.paginate(query, options);

      return res.status(200).json({
        evidences,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From Evidences Collection
  public async getOne(req: any, res: Response) {
    try {
      const { idCase } = req.params;

      const evidence = await Evidence.findOne({ case: idCase });

      return res.status(200).json({
        evidence,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Update One or More Rows/Documents From Evidences Collection
  public async update(req: any, res: Response) {
    try {
      const { idEvidence, idFile } = req.params;
      const { file } = req.body;
      const evidenceBD: any = await Evidence.findOne({ _id: idEvidence });
      let newEvidences: any[] = [];
      let evidence;

      if (evidenceBD && req.files && req.files.length >= 1) {
        documents.getDocs().forEach((evidence: any) => {
          let filePath = `${req.hostname}${
            process.env.NODE_ENV === 'dev' ? ':3000' : ''
          }/ftp/uploads/${evidence}`;

          newEvidences.push({
            evidence: filePath
          });
        });

        if (newEvidences.length >= 1) {
          evidence = await Evidence.findOneAndUpdate(
            { _id: idEvidence },
            {
              $push: {
                evidences: newEvidences
              }
            },
            {
              new: true
            }
          );
        }
        documents.docs = [];
      }

      return res.json({
        evidence,
        message: 'Archivos agregados correctamente',
        ok: true
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar la Evidencia', ok: false });
    }
  }
}

const evidenceController = new EvidenceController();
export default evidenceController;
