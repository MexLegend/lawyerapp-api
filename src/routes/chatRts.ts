import { Router } from 'express';

import chatRoom from '../controllers/chatRoomCtrl';
import { AUTH } from '../middlewares/authentication';

class ChatRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    // Rooms
    this.router.post('/', [AUTH.verifyToken], chatRoom.createRoom);
    this.router.get('/all/:id', [AUTH.verifyToken], chatRoom.getRooms);
    this.router.get('/one/:id', [AUTH.verifyToken], chatRoom.getOneRoom);
    this.router.put('/:id', [AUTH.verifyToken], chatRoom.updateRoom);
    this.router.delete('/:id', [AUTH.verifyToken], chatRoom.deleteRoom);
    // Messages
    this.router.post('/message', [AUTH.verifyToken], chatRoom.createMessage);
    this.router.get(
      '/message/all/:id',
      [AUTH.verifyToken],
      chatRoom.getMessages
    );
    this.router.get(
      '/message/one/:id',
      [AUTH.verifyToken],
      chatRoom.getOneMessage
    );
    this.router.get(
      '/message/last/:id',
      [AUTH.verifyToken],
      chatRoom.getLastMessage
    );
    this.router.delete(
      '/message/:id',
      [AUTH.verifyToken],
      chatRoom.deleteMessage
    );
  }
}

const chatRoutes = new ChatRoutes();
export default chatRoutes.router;
