import { Response } from 'express';
import { verify, decode } from 'jsonwebtoken';
import NewsLetter from '../models/newsLetterMdl';
import User from '../models/userMdl';

class UtilitiesController {
  // Check Token Expiration
  public async checkToken(req: any, res: Response) {
    try {
      const { token } = req.params;
      let SECRET: any = process.env.SECRET;

      verify(token, SECRET, (err: any, decoded: any) => {
        if (err) {
          const decodedToken: any = decode(token);

          const responseData = async () => {
            if (decodedToken.action === 'confirmNewsLetter') {
              return await NewsLetter.findById({ _id: decodedToken.id });
            } else {
              return await User.findById({ _id: decodedToken.id });
            }
          };

          responseData().then((resp: any) =>
            res.json({
              err,
              ok: false,
              message: 'Token no válido',
              responseData: { ...resp._doc, action: decodedToken.action },
              tokenExpired: true
            })
          );
        } else {
          const responseData = async () => {
            switch (decoded.action) {
              case 'confirmAccount':
                return await User.findOneAndUpdate(
                  { _id: decoded.id },
                  { isConfirmed: true },
                  {
                    new: true
                  }
                );
              case 'confirmNewsLetter':
                return await NewsLetter.findOneAndUpdate(
                  { _id: decoded.id },
                  { isConfirmed: true },
                  {
                    new: true
                  }
                );
              default:
                return { id: decoded.id };
                break;
            }
          };

          responseData()
            .then((resp) => res.json({ ok: true, responseData: resp }))
            .catch(() => res.json({ ok: false, tokenExpired: false }));
        }
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'Ocurrió un error en el sistema',
        tokenExpired: false,
        ok: false
      });
    }
  }
}

const utilitiesController = new UtilitiesController();
export default utilitiesController;
