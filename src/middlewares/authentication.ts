import { verify } from 'jsonwebtoken';

export const AUTH = {
  verifyToken(req: any, res: any, next: any) {
    let token = req.get('token');
    let SECRET: any = process.env.SECRET;

    verify(token, SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          err,
          message: 'Token no válido',
          ok: false
        });
      }

      req.user = decoded.user;

      next();
    });
  },
  verifyAdmin(req: any, res: any, next: any) {
    let user = req.user;

    if (user.role === 'ADMIN') {
      next();
    } else {
      return res.status(401).json({
        message: 'El user no es ADMIN',
        ok: false
      });
    }
  },
  verifyAdminAssociated(req: any, res: any, next: any) {
    let user = req.user;

    if (user.role === 'ADMIN' || user.role === 'ASSOCIATED') {
      next();
    } else {
      return res.status(401).json({
        message: 'El usuario no es Administrador o Asociado',
        ok: false
      });
    }
  },
  verifyAdminSameUser(req: any, res: any, next: any) {
    const user = req.user;
    const id = req.params.id;

    if (user.role === 'ADMIN' || user._id === id) {
      next();
      return;
    } else {
      return res.status(401).json({
        message: 'Token incorrecto - No es ADMIN o el USUARIO LOGUEADO',
        ok: false
      });
    }
  },
  verifyTokenImg(req: any, res: any, next: any) {
    let token = req.query.token;
    let SECRET: any = process.env.SECRET;

    verify(token, SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          err,
          message: 'Token no válido',
          ok: false
        });
      }

      req.user = decoded.user;

      next();
    });
  }
};
