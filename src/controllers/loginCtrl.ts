import { compareSync } from 'bcryptjs';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';

import User from '../models/userMdl';

export default {
  // Allow Users To Loggin In The System
  async login(req: any, res: Response) {
    try {
      const userData = req.body;

      const user: any = await User.findOne({
        email: userData.email
      });

      // Emails Doesn't Exist
      if (!user) {
        return res.json({
          type: 'notExist',
          ok: false
        });
      }

      // Wrong Credentials
      if (!compareSync(userData.password, user.password)) {
        return res.json({
          type: 'wrongCredentials',
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
