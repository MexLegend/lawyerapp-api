import { Request, Response } from 'express';
import ChatMessage from '../models/chatMessage.Mdl';
import ChatRoom from '../models/chatRoomMdl';
import { connectedUsers } from '../sockets/socket';
import { Types } from 'mongoose';
import Server from '../classes/server';
import User from '../models/userMdl';

class ChatRoomController {
  // Insert a New Row/Document Into The ChatRooms Collection
  public async createRoom(req: any, res: Response) {
    try {
      const { roomData, messageData } = req.body;
      const server = Server.instance;

      const roomCreated: any = await ChatRoom.create(roomData);

      // Create Room In Users Collection
      await User.updateMany(
        {
          _id: { $in: roomCreated.members.map((member: any) => member.member) }
        },
        { $push: { rooms: { room: roomCreated._id, type: '' } } }
      );

      const messagesCreated: any = await ChatMessage.create({
        chat_room_id: roomCreated._id,
        messages: {
          author_id: roomData.creator_id,
          message: messageData.message
        }
      });

      const populatedMessage = await ChatMessage.findOne({
        _id: messagesCreated._id
      }).populate('messages.author_id');

      // Update Last Message Id, Populate Room Members And Send Message Notifications To Client
      await ChatRoom.findOne({
        _id: roomCreated._id
      })
        .populate('last_message_id')
        .populate('members.member')
        .exec((err, data: any) => {
          const chat = {
            roomData: data,
            messageData: populatedMessage,
            isCreating: true
          };

          // Validate If Clients Are Connected To Send Them The Message
          connectedUsers.getConnectedUsers().then((users) => {
            let clientsConnected: any = [];
            users.filter((user) => {
              data.members.filter((member: any) => {
                if (
                  JSON.stringify(member.member._id) ===
                  JSON.stringify(user.publicId)
                ) {
                  clientsConnected.push(user);
                  connectedUsers.addUserToRoom(user.client, roomCreated._id);
                } else return;
              });
            });

            // Emit Notification To All Connected Clients Including Sender
            if (clientsConnected.length > 0) {
              server.io
                .in(JSON.stringify(roomCreated._id))
                .emit('get-group-message-event', chat);
            }
          });

          return res.json({
            chat,
            message: 'Sala creada correctamente',
            ok: true
          });
        });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear la Sala', ok: false });
    }
  }

  // Insert a New Row/Document Into The ChatMessages Collection
  public async createMessage(req: any, res: Response) {
    try {
      const { roomId, messageData } = req.body;
      const server = Server.instance;

      const tempMessageData = {
        author_id: Types.ObjectId(messageData.creator_id),
        message: messageData.message,
        attachments: [],
        created_at: Date.now(),
        updated_at: Date.now()
      };

      await ChatMessage.findOneAndUpdate(
        {
          chat_room_id: Types.ObjectId(roomId)
        },
        {
          $push: {
            messages: tempMessageData
          }
        },
        {
          new: true,
          fields: { messages: { $slice: -1 } }
        }
      )
        .populate({
          path: 'chat_room_id',
          populate: [{ path: 'members.member' }]
        })
        .populate('messages.author_id')
        .exec((err, messageData: any) => {
          // Validate If Client Message Is Connected
          connectedUsers.getConnectedUsers().then((users) => {
            let clientsConnected: any = [];
            users.filter((user) => {
              messageData.chat_room_id.members.filter((member: any) => {
                if (
                  JSON.stringify(member.member._id) ===
                  JSON.stringify(user.publicId)
                ) {
                  clientsConnected.push(user);
                } else return;
              });
            });

            // Emit Notification To All Connected Clients Including Sender
            if (clientsConnected.length > 0) {
              server.io
                .in(JSON.stringify(messageData.chat_room_id._id))
                .emit('get-group-message-event', {
                  messageData,
                  isCreating: false
                });
            }
          });

          return res.json({
            message: messageData,
            ok: true
          });
        });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear el mensaje', ok: false });
    }
  }

  // Get All Rows/Documents From ChatRooms Collection
  public async getRooms(req: any, res: Response) {
    try {
      const idUser = req.params.id;

      const rooms: any = await ChatRoom.find({
        members: { $elemMatch: { member: { $in: [Types.ObjectId(idUser)] } } }
      });

      const completeRooms = await ChatMessage.find(
        {
          chat_room_id: { $in: rooms.map((room: any) => room._id) }
        },
        {
          messages: { $slice: -1 }
        }
      )
        .populate('messages.author_id')
        .populate({
          path: 'chat_room_id',
          populate: [{ path: 'members.member' }]
        });

      return res.status(200).json({
        completeRooms,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get All Rows/Documents From ChatMessages Collection
  public async getMessages(req: any, res: Response) {
    try {
      const idRoom = req.params.id;

      const messages = await ChatMessage.find({
        chat_room_id: Types.ObjectId(idRoom)
      }).populate('messages.author_id');

      return res.status(200).json({
        messages,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get Last Row/Document From ChatMessages Collection
  public async getLastMessage(req: any, res: Response) {
    try {
      const idRoom = req.params;

      const lastMessage = await ChatMessage.findOne(
        {
          chat_room_id: Types.ObjectId(idRoom)
        },
        {
          new: true,
          fields: { messages: { $slice: -1 } }
        }
      ).populate('messages.author_id');

      return res.status(200).json({
        ok: true,
        message: lastMessage
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From ChatRooms Collection
  public async getOneRoom(req: any, res: Response) {
    try {
      const { id } = req.params;

      return res.status(200).json({
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From ChatMessages Collection
  public async getOneMessage(req: any, res: Response) {
    try {
      const { id } = req.params;

      return res.status(200).json({
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Update One or More Rows/Documents From ChatRooms Collection
  public async updateRoom(req: any, res: Response) {
    try {
      return res.json({
        message: 'Nota actualizada correctamente',
        ok: true
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar la Evidencia', ok: false });
    }
  }

  // Delete Temporary a Row/Document From The ChatRooms Collection
  public async deleteRoom(req: any, res: Response) {
    try {
      const { idCase, idNote } = req.params;

      return res.json({
        message: 'Nota actualizada correctamente',
        ok: true
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar la Evidencia', ok: false });
    }
  }

  // Delete Permanently a Row/Document From The Cases Collection
  public async deleteMessage(req: any, res: Response) {
    try {
      const { idCase, idNote } = req.params;

      return res.json({
        message: 'Nota actualizada correctamente',
        ok: true
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar la Evidencia', ok: false });
    }
  }
}

const chatRoomController = new ChatRoomController();
export default chatRoomController;
