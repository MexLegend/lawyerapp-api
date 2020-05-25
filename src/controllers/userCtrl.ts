import { compareSync, hashSync } from 'bcryptjs';
import { Request, Response } from 'express';

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

import User from '../models/userMdl';

class UserController {
  public async checkEmail(req: any, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (user !== null) {
        return res.json({
          ok: true,
          exist: true,
          message: 'El email ya esta en uso',
          user
        });
      } else {
        return res.json({ ok: true, exist: false });
      }
    } catch (err) {
      res
        .status(500)
        .json({ err, ok: false, message: 'Error al encontrar usuario' });
    }
  }

  public async create(req: any, res: Response) {
    // console.log(req.body)
    // return;

    try {
      const {
        address,
        cellPhone,
        email,
        firstName,
        lastName,
        password
      } = req.body.user;

      const userN: any = new User({
        address,
        cellPhone,
        email,
        firstName,
        img: req.body.img ? req.body.img.url : 'no_image',
        lastName,
        password: hashSync(password, 10),
        public_id: req.body.img ? req.body.img.public_id : ''
      });

      if (req.body.lawyer) {
        userN.lawyer = req.body.lawyer;
      }
      const user = await User.create(userN);

      res
        .status(201)
        .json({ ok: true, user, message: 'Usuario creado correctamente' });
    } catch (err) {
      res
        .status(500)
        .json({ err, ok: false, message: 'Error al crear el usuario' });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const changeStatus = {
        status: false
      };
      const user: any = await User.findOneAndUpdate({ _id: id }, changeStatus, {
        new: true
      });

      if (!user) {
        return res.status(404).json({
          message: 'No se encontro al Usuario',
          ok: false
        });
      }

      return res.json({
        message: `Usuario ${user.firstName} borrado`,
        ok: true,
        user
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'No se encontro al Usuario',
        ok: false
      });
    }
  }

  public async get(req: any, res: Response) {
    try {
      const {
        filter,
        filterOpt = 'firstName',
        page = 1,
        perPage = 10,
        orderField,
        orderType,
        status
      } = req.query;
      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        sort: {
          firstName: 1
        }
      };

      let filtroE = new RegExp(filter, 'i');

      const query = {
        [filterOpt]: filtroE,
        status,
        role: 'USER',
        $or: [
          {
            lawyer: req.user._id
          }
        ]
      };

      if (orderField && orderType) {
        options.sort = {
          [orderField]: orderType
        };
      }

      const users = await User.paginate(query, options);

      return res.status(200).json({
        users,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });

      res.status(200).json({ ok: true, user });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async update(req: any, res: Response) {
    try {
      const { id } = req.params;
      const { address, cellPhone, email, firstName, lastName } = req.body.user;
      const userG: any = await User.findOne({ _id: id });

      if (req.body.img.url) {
        if (
          userG.public_id &&
          userG.public_id !== undefined &&
          userG.public_id !== ''
        ) {
          await cloudinary.v2.uploader.destroy(userG.public_id);
        }
      }

      const userU = {
        address:
          address !== undefined && address !== '' ? address : userG.address,
        cellPhone:
          cellPhone !== undefined && cellPhone !== ''
            ? cellPhone
            : userG.cellPhone,
        email: email !== undefined && email !== '' ? email : userG.email,
        firstName:
          firstName !== undefined && firstName !== ''
            ? firstName
            : userG.firstName,
        img: req.body.img.url ? req.body.img.url : userG.img,
        lastName:
          lastName !== undefined && lastName !== '' ? lastName : userG.lastName,
        public_id: req.body.img.public_id
          ? req.body.img.public_id
          : userG.public_id
      };

      const user = await User.findOneAndUpdate({ _id: id }, userU, {
        new: true
      });

      return res.json({
        ok: true,
        message: 'Datos actualizados correctamente',
        user
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, ok: false, message: 'Error al actualizar el Usuario' });
    }
  }

  public async updatePass(req: any, res: Response) {
    try {
      const { id } = req.params;
      const { passAct, passNew, passNewR } = req.body;
      const passHash = hashSync(passNew, 10);
      const user: any = await User.findOne({
        _id: id
      });

      if (passAct !== '' && passNew !== '' && passNewR !== '') {
        if (compareSync(passAct, user.password)) {
          if (passNew === passNewR) {
            if (passNew.length > 8) {
              const user = await User.findOneAndUpdate(
                { _id: id },
                { password: passHash },
                {
                  new: true
                }
              );

              return res.json({
                message: 'Contraseña actualizada correctamente',
                ok: true,
                user
              });
            } else {
              return res.json({
                message: 'La contraseña debe tener al menos 9 caracteres',
                ok: false
              });
            }
          } else {
            return res.json({
              message: 'Las contraseñas no coinciden',
              ok: false
            });
          }
        } else {
          return res.json({
            message: 'Contraseña actual incorrecta',
            ok: false
          });
        }
      } else {
        return res.json({
          message: 'Todos los campos son obligatorios',
          ok: false
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Ocurrió un error en el sistema', ok: false });
    }
  }
}

const userController = new UserController();
export default userController;
