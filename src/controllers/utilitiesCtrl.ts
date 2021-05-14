import { Response } from 'express';
import { decode, verify } from 'jsonwebtoken';

class UtilitiesController {
  // Check Token Expiration
  public async checkToken(req: any, res: Response) {
    try {
      const { token } = req.params;
      let SECRET: any = process.env.SECRET;

      verify(token, SECRET, (err: any, decoded: any) => {
        if (err) {
          return res.json({
            err,
            message: 'Token no válido',
            ok: false
          });
        } else {
          return res.json({ ok: true, decoded });
        }
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }
}

const utilitiesController = new UtilitiesController();
export default utilitiesController;
