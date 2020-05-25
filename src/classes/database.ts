import mongoose from 'mongoose';

export default class Database {
  private static _instance: Database;
  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  start(): void {
    const db: any = process.env.DB;
    console.log(process.env.DB);
    mongoose.Promise = global.Promise;
    mongoose.set('useCreateIndex', true);
    mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(() => {
        console.log('DB is connect');
      })
      .catch((err: any) => console.log(err));
  }
}
