import { Request, Response } from 'express';

import Case from '../models/caseMdl';
import Contact from '../models/contactMdl';

class ContactController {
  // Insert a New Row/Document Into The Contacts Collection
  public async create(req: any, res: Response) {
    try {
      const { idUser, idContact } = req.body;

      const mainContact = await Contact.findOneAndUpdate(
        {
          user: idUser
        },
        { $push: { contacts: { contact: idContact } } },
        { upsert: true }
      );

      await Contact.findOneAndUpdate(
        {
          user: idContact
        },
        { $push: { contacts: { contact: idUser } } },
        { upsert: true }
      ).exec((err, foreignContact: any) => {
        const completedContact = {
          mainContact,
          foreignContact
        };

        res.status(201).json({
          completedContact,
          ok: true,
          message: 'Contacto creado correctamente'
        });
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear el Contacto', ok: false });
    }
  }

  // Delete Temporary a Row/Document From The Contacts Collection
  public async delete(req: Request, res: Response) {
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

  // Get All Rows/Documents From Contacts Collection
  public async getAll(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const userContacts = await Contact.find({
        user: id
      }).populate('contacts.contact');

      res.status(200).json({ userContacts, ok: true });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From Contacts Collection
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

  // Update One or More Rows/Documents From Contacts Collection
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

const contactController = new ContactController();
export default contactController;
