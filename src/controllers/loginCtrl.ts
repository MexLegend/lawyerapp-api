import { compareSync } from 'bcryptjs';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';

import User from '../models/userMdl';

export default {
  // Allows Users To Loggin In The System
  async login(req: any, res: Response) {
    try {
      const body = req.body;

      const user: any = await User.findOne({
        email: body.email
      });

      if (!user) {
        return res.status(400).json({
          message: '(Usuario) o contraseña incorrecto',
          ok: false
        });
      }

      if (!compareSync(body.password, user.password)) {
        return res.status(404).json({
          message: 'Usuario o (contraseña) incorrecto',
          ok: false
        });
      }

      const SECRET: any = process.env.SECRET;

      let token = sign(
        {
          user
        },
        SECRET,
        {
          expiresIn: process.env.EXPIRATION
        }
      );

      res.json({
        ok: true,
        token,
        user
      });
    } catch (err) {
      return res.status(500).json({
        err,
        ok: false
      });
    }
  }
};
