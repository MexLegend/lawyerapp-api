import { Request, Response, request } from 'express';
import { setVapidDetails, sendNotification } from 'web-push';

import Notification from '../models/notificationMdl';

class NotificationController {
  public async create(req: any, res: Response) {
    console.log(req.body)
    const sub = req.body;
    res.set('Content-Type', 'application/json')
    
    setVapidDetails(
      'mailto:example@yourdomain.com',
      'BDrqtmJ0LDNmKOZ_FueB6Qf9qs3Peh6s5NdcsTrpHhPpsRKElfXdWuPrZM1bbUT9gVHx89wUC8-MVFPJbcPB9Oo',
      'ldMrew1LrHU_FPpG7cWRQM28H0zj1GjTO2S0XxivsKg'
    );

    const payload = JSON.stringify({
        notification: {
          title: 'Notifications are cool',
          body: 'Know how to send notifications through Angular with this article!',
          icon: 'https://www.shareicon.net/data/256x256/2015/10/02/110808_blog_512x512.png',
          vibrate: [100, 50, 100],
          data: {
            url: 'https://medium.com/@arjenbrandenburgh/angulars-pwa-swpush-and-swupdate-15a7e5c154ac'
          }
        }
    });

    Promise.resolve(sendNotification(sub, payload))
      .then(() => res.status(200).json({
        message : 'Notification Sent'
      }))
      .catch(e => console.log(e))
    
        
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const changeStatus = {
        status: false
      };

      const notification: any = await Notification.findOneAndUpdate({ _id: id }, changeStatus, {
        new: true
      });
      if (!notification) {
        return res.status(404).json({
          message: `No se encontro al notification con id: ${id}`,
          ok: false
        });
      }

      return res.json({
        message: `Notification ${notification.title} borrado`,
        ok: true,
        notification
      });
    } catch (err) {
      res.status(500).json({
        err,
        message: `No se encontro al notification con id: ${id}`,
        ok: false
      });
    }
  }

  public async getAll(req: Request, res: Response) {
    return console.log(req.body);
  }

  public async get(req: Request, res: Response) {
    try {
      const {
        page = 1,
        perPage = 10,
        filter,
        orderField,
        orderType,
        filterOpt = 'title',
        status
      } = req.query;
      const options: any = {
        page: parseInt(page, 10),
        limit: parseInt(perPage, 10),
        sort: {
          title: 1
        }
      };

      let filtroE = new RegExp(filter, 'i');

      const query = {
        $and: [
          {
            [filterOpt]: filtroE
          },
          {
            status
          }
        ]
      };

      if (orderField && orderType) {
        options.sort = {
          [orderField]: orderType
        };
      }

      const notifications = await Notification.paginate(query, options);
      return res.status(200).json({
        notifications,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const notification = await Notification.findOne({ _id: req.params.id });
      res.status(200).json({ ok: true, notification });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const notification = await Notification.findOneAndUpdate({ _id: id }, req.body, {
        new: true
      });
      return res.json({ ok: true, notification });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }
}

const notificationController = new NotificationController();
export default notificationController;
