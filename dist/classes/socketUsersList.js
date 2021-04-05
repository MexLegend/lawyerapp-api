"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class SocketUsersList {
    constructor() {
        this.usersList = [];
    }
    addUser(user) {
        this.usersList.push(user);
        return user;
    }
    addUserToRoom(client, room) {
        client.join(JSON.stringify(room));
    }
    deleteUser(client, id) {
        const tempUser = this.getConnectedUserById(id);
        this.usersList = this.usersList.filter((user) => user.socketId !== id);
        this.deleteUserFromRooms(client, tempUser.userRooms);
        return tempUser;
    }
    deleteUserFromRooms(client, rooms) {
        rooms.map((room) => client.leave(JSON.stringify(room)));
    }
    getConnectedUserById(id) {
        return this.usersList.find((user) => user.socketId === id);
    }
    getConnectedUserByPublicId(id) {
        return this.usersList.find((user) => JSON.stringify(user.publicId) === JSON.stringify(id));
    }
    getConnectedUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => resolve(this.usersList));
        });
    }
    getUsersFromRoom(roomToCompare) {
        return this.usersList.filter((user) => user.userRooms.filter((room) => room === roomToCompare));
    }
    updateClientData(client, id, publicId, name, role, rooms) {
        for (let user of this.usersList) {
            if (user.socketId === id) {
                user.publicId = publicId;
                user.client = client;
                user.name = name;
                this.addUserToRoom(client, role);
                user.userRooms.push({ room: role });
                if (rooms) {
                    rooms.map((room) => {
                        user.userRooms.push({ room: room.room });
                        this.addUserToRoom(client, room.room);
                    });
                }
                break;
            }
        }
    }
}
exports.default = SocketUsersList;
