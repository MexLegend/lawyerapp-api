import { Request, Response } from 'express';

import Case from '../models/caseMdl';
import Note from '../models/noteMdl';

class NoteController {
  // Update Status From One Row/Document From Notes Collection
  public async changeTemp(req: Request, res: Response) {
    try {
      const { idCase, idNote } = req.params;
      let { status, deleted } = req.body;
      const noteDB: any = await Note.findOne({ case: idCase });
      let newN: any[] = [];

      status = status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';

      noteDB.notes.forEach((note: any) => {
        if (note._id.toString() === idNote.toString()) {
          note.status = req.body.status ? status : deleted;
        }
        newN.push(note);
      });

      const note = await Note.findOneAndUpdate(
        { case: idCase },
        {
          $set: {
            notes: newN
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
            message: 'Nota borrada',
            note,
            ok: true
          });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'No se encontro la Nota',
        ok: false
      });
    }
  }

  // Insert a New Row/Document Into The Notes Collection
  public async create(req: any, res: Response) {
    try {
      const { idCase } = req.params;
      const noteDB = await Note.find({ case: idCase });
      let noteN: any;
      let note: any;
      console.log(noteDB);
      // return;
      note = {
        affair: req.body.noteAffair,
        message: req.body.noteMessage,
        status: req.body.noteStatus
      };

      if (noteDB.length === 0) {
        noteN = new Note({
          case: idCase,
          notes: [note]
        });
        note = await Note.create(noteN);
      } else if (noteDB && noteDB.length >= 1) {
        note = await Note.findOneAndUpdate(
          { case: idCase },
          {
            $push: {
              notes: [note]
            }
          },
          {
            new: true
          }
        );
      }

      return res.json({
        note,
        message: 'Nota creada correctamente',
        ok: true
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear la Nota', ok: false });
    }
  }

  // Get All Rows/Documents From Notes Collection
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
      const { id } = req.params;

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
        case: id,
        status: { $ne: 'DELETED' }
      };

      if (orderField && orderType) {
        options.sort = {
          [orderField]: orderType
        };
      }

      const notes = await Note.paginate(query, options);

      return res.status(200).json({
        notes,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From Notes Collection
  public async getOne(req: any, res: Response) {
    try {
      const { id } = req.params;

      const note = await Note.findOne({ _id: id });

      if (!note) {
        return res.json({
          message: 'La Nota no existe',
          ok: false
        });
      }

      return res.status(200).json({
        note,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Update One or More Rows/Documents From Notes Collection
  public async update(req: any, res: Response) {
    try {
      const { idCase, idNote } = req.params;
      const evidenceDB: any = await Note.findOne({ case: idCase });
      let newN: any[] = [];

      evidenceDB.notes.forEach((n: any) => {
        if (n._id.toString() === idNote.toString()) {
          n = req.body;
        }
        newN.push(n);
      });

      const note = await Note.findOneAndUpdate(
        { case: idCase },
        {
          $set: {
            notes: newN
          }
        },
        {
          new: true
        }
      );

      return res.json({
        note,
        message: 'Nota actualizada correctamente',
        ok: true
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar la Evidencia', ok: false });
    }
  }
}

const noteController = new NoteController();
export default noteController;
