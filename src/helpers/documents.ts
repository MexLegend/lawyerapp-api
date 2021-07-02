class Documents {

    docs: any[] = [];

    constructor() {

    }

    public addDocument(doc: any) {
        this.docs.push(doc);
    }

    public getDocs() {
        return this.docs;
    }
}

const documents = new Documents();
export default documents;