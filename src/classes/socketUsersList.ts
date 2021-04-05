import SocketUser from './socketUser';
import { Socket } from 'socket.io';

export default class SocketUsersList {
  private usersList: SocketUser[] = [];

  public constructor() {}

  public addUser(user: SocketUser): SocketUser {
    this.usersList.push(user);

    return user;
  }

  public addUserToRoom(client: Socket, room: string) {
    client.join(JSON.stringify(room));
  }

  public deleteUser(client: Socket, id: string): any {
    const tempUser: SocketUser = this.getConnectedUserById(id);

    this.usersList = this.usersList.filter((user) => user.socketId !== id);
    this.deleteUserFromRooms(client, tempUser.userRooms);

    return tempUser;
  }

  public deleteUserFromRooms(client: Socket, rooms: string[]) {
    rooms.map((room) => client.leave(JSON.stringify(room)));
  }

  public getConnectedUserById(id: string): any {
    return this.usersList.find((user) => user.socketId === id);
  }

  public getConnectedUserByPublicId(id: string): any {
    return this.usersList.find(
      (user) => JSON.stringify(user.publicId) === JSON.stringify(id)
    );
  }

  public async getConnectedUsers(): Promise<SocketUser[]> {
    return await new Promise((resolve, reject) => resolve(this.usersList));
  }

  public getUsersFromRoom(roomToCompare: string): any {
    return this.usersList.filter((user) =>
      user.userRooms.filter((room) => room === roomToCompare)
    );
  }

  public updateClientData(
    client: Socket,
    id: string,
    publicId: string,
    name: string,
    role: any,
    rooms: any
  ) {
    for (let user of this.usersList) {
      if (user.socketId === id) {
        user.publicId = publicId;
        user.client = client;
        user.name = name;
        this.addUserToRoom(client, role);
        user.userRooms.push({ room: role });
        if (rooms) {
          rooms.map((room: any) => {
            user.userRooms.push({ room: room.room });
            this.addUserToRoom(client, room.room);
          });
        }
        break;
      }
    }
  }
}
