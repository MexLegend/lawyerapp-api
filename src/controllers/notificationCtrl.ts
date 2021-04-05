import { Request, Response } from 'express';
import { Types } from 'mongoose';

import Notification from '../models/notificationMdl';
import usersNotifications from '../models/usersNotificationsMdl';
import Server from '../classes/server';
import { connectedUsers } from '../sockets/socket';

class NotificationController {
  // Insert a New Row/Document Into The Notifications Collection
  public async create(req: any, res: Response) {
    try {
      const notificationData: any = {
        image_user: req.body.image_user ? req.body.image_user : null,
        image_post: req.body.image_post ? req.body.image_post : null,
        show_buttons: req.body.show_buttons ? req.body.show_buttons : false,
        title: req.body.title,
        type: req.body.type,
        url_path: req.body.url_path,
        user_actor: Types.ObjectId(req.body.user_actor),
        user_actor_role: req.body.user_actor_role
      };

      const server = Server.instance;
      const notificationCreated: any = await Notification.create(
        notificationData
      );

      const notificationCreatedCompleted: any = await Notification.findById(
        notificationCreated._id
      ).populate([{ path: 'image_user' }, { path: 'image_post' }]);

      const userNotificationData = new usersNotifications({
        allowed_roles: req.body.allowed_roles ? req.body.allowed_roles : [],
        notification_id: notificationCreated._id,
        user_receiver: req.body.user_receiver
          ? Types.ObjectId(req.body.user_receiver)
          : null,
        users_viewed: req.body.users_viewed ? req.body.users_viewed : []
      });

      await usersNotifications.create(userNotificationData).then(() => {
        const notificationCompleted = {
          ...notificationCreatedCompleted._doc,
          user_actor: req.body.user_actor_name,
          allowed_roles: req.body.allowed_roles
            ? JSON.stringify(req.body.allowed_roles)
            : [],
          user_receiver: req.body.user_receiver
            ? Types.ObjectId(req.body.user_receiver)
            : null
        };

        // Send Notification To Client By His Socket ID
        connectedUsers.getConnectedUsers().then((users) => {
          // Get Receiver Id
          const clientConnected = users.find(
            (user) => user.publicId === req.body.user_receiver
          );

          // Get Sender Id
          const sender = connectedUsers.getConnectedUserByPublicId(
            req.body.user_actor
          );

          // Emit Notification To Especific Client Excluding Sender
          if (clientConnected) {
            server.io
              .in(clientConnected.socketId)
              .emit(
                'get-private-socket-event-notification',
                notificationCompleted
              );
          } else {
            // Validate If Notification Is For A Group Of Clients
            if (req.body.allowed_roles) {
              const clientRoom = req.body.allowed_roles.find((role: any) =>
                users.find((user) =>
                  role === 'ALL'
                    ? true
                    : user.userRooms.filter((room) => room === role)
                )
              );
              // Validate If Client Is In Especified Room
              if (clientRoom) {
                // Emit Notification To All Connected Clients Excluding Sender
                if (clientRoom === 'ALL') {
                  // Validate If Sender Is Connected
                  if (sender) {
                    sender.client.broadcast.emit(
                      'get-public-socket-event-notification',
                      notificationCompleted
                    );
                  } else {
                    server.io.emit(
                      'get-public-socket-event-notification',
                      notificationCompleted
                    );
                  }
                }
                // Emit Notification To A Group Of Connected Clients Excluding Sender
                else {
                  sender.client.broadcast
                    .to(JSON.stringify(clientRoom))
                    .emit(
                      'get-group-socket-event-notification',
                      notificationCompleted
                    );
                }
              }
            }
          }

          return res.json({
            notification: notificationCompleted,
            ok: true
          });
        });
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear la notificación', ok: false });
    }
  }

  // Delete Temporary One Row/Document From Notifications Collection
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const changeStatus = {
        status: false
      };

      const notification: any = await Notification.findOneAndUpdate(
        { _id: id },
        changeStatus,
        {
          new: true
        }
      );
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

  // Get All Rows/Documents From Notifications Collection
  public async get(req: Request, res: Response) {
    try {
      const { id, role } = req.params;

      const userNotifications: any = await usersNotifications
        .find({
          $or: [
            { user_receiver: id },
            { allowed_roles: { $in: [role] } },
            { allowed_roles: { $in: ['ALL'] } }
          ]
        })
        .populate({
          path: 'notification_id',
          populate: [
            { path: 'user_actor' },
            { path: 'image_user' },
            { path: 'image_post' }
          ]
        });

      return res.json({
        notification: userNotifications,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From Notifications Collection
  public async getOne(req: Request, res: Response) {
    try {
      const notification = await Notification.findOne({ _id: req.params.id });
      res.status(200).json({ ok: true, notification });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Update One or More Rows/Documents From Notifications Collection
  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const notification = await Notification.findOneAndUpdate(
        { _id: id },
        req.body,
        {
          new: true
        }
      );
      return res.json({ ok: true, notification });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }
}

const notificationController = new NotificationController();
export default notificationController;
