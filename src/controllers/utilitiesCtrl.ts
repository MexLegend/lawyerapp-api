import { Response } from 'express';
import { verify, decode } from 'jsonwebtoken';
import NewsLetter from '../models/newsLetterMdl';
import Post from '../models/postMdl';
import Rate from '../models/rateMdl';
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
  // Get Rating Data From One Lawyer / Post
  public async getAllRateData(req: any, res: Response) {
    try {
      const { id } = req.params;

      const ratingData = await Rate.findById({ data_id: id });

      res.status(201).json({ ok: true, ratingData });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'Ocurrió un error en el sistema',
        ok: false
      });
    }
  }
  // Get Rating Data From One User
  public async getRateDataFromOneUser(req: any, res: Response) {
    try {
      const { id, user } = req.params;

      const ratingData = await Rate.findOne({
        data_id: id,
        user_id: user
      });

      // const ratingData = await Rate.findOne({
      //   data_id: id
      // }).select({ rate: { $elemMatch: { user_id: user } } });

      res.status(201).json({ ok: true, ratingData });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'Ocurrió un error en el sistema',
        ok: false
      });
    }
  }
  // Rate Data
  public async rateData(req: any, res: Response) {
    try {
      const { id, user_id, rate, rateComment = null, dataType } = req.body;

      const rateData = {
        rating: rate,
        ...(rateComment && { comment: rateComment }),
        externalModelType: dataType,
        data_id: id,
        user_id
      };

      // Insert New Row Into Rate Collection
      const rateResponse = await Rate.create(rateData);

      // Insert Rating Field Into Respective User Collection
      const user = await User.findOneAndUpdate(
        {
          _id: user_id
        },
        {
          $push: { ratings: rateResponse._id }
        },
        { new: true }
      ).populate('ratings');

      res.status(201).json({ ok: true, user, rateResponse });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'Ocurrió un error en el sistema',
        ok: false
      });
    }
  }
  // Update Rated Data
  public async updateRatedData(req: any, res: Response) {
    try {
      const { id, rate, rateComment = null } = req.body;

      const rateData = {
        rating: rate,
        ...(rateComment && { comment: rateComment })
      };

      // Update Rating Row From Rate Collection
      const rateResponse = await Rate.findByIdAndUpdate({ _id: id }, rateData, {
        new: true
      });

      res.status(201).json({ ok: true, rateResponse });
    } catch (err) {
      res.status(500).json({
        err,
        message: 'Ocurrió un error en el sistema',
        ok: false
      });
    }
  }
}

const utilitiesController = new UtilitiesController();
export default utilitiesController;
