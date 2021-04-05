import { Socket } from 'socket.io';

export default class SocketUser {
  public publicId: string;
  public socketId: string;
  public client: Socket;
  public name: string;
  public userRooms: any[];

  public constructor(socketId: string) {
    this.publicId = 'Sin-identificador';
    this.socketId = socketId;
    this.client = {} as Socket;
    this.name = 'Sin-nombre';
    this.userRooms = [];
  }
}
