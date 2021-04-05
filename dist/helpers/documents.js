"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Documents {
    constructor() {
        this.docs = [];
    }
    addDocument(doc) {
        this.docs.push(doc);
    }
    getDocs() {
        return this.docs;
    }
}
const documents = new Documents();
exports.default = documents;
