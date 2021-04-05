// Se importa el módulo de mongoose para realizar la conexión con MongoDB
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
    // Se indica que la conexión será mediante Promesas
    mongoose.Promise = global.Promise;
    mongoose.set('useCreateIndex', true);
    // Se establece la conexión a la base de datos mediande el método connect
    mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(() => {
        //   Si la conexión es exitosa se emite el siguiente mensaje
        console.log('DB is connect');
      })
      //   Si la conexión es fallida se muestra el error
      .catch((err: any) => console.log(err));
  }
}
