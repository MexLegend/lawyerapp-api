import { Request, Response } from 'express';

class WhatsappController {
  // Allows To Send A Email To The Lic. Fernando Romo Rodríguez
  public async send(req: any, res: Response) {
    try {
      const accountSid = process.env.ACCOUNT_SID;
      const authToken = process.env.AUTH_TOKEN;

      const client = require('twilio')(accountSid, authToken);

      client.messages
        .create({
          from: 'whatsapp:+14155238886',
          to: 'whatsapp:' + process.env.MY_PHONE_NUMBER,
          body: 'Hello Armando Sup!'
        })
        .then((messageR: any) => {
          return res.status(201).json({ ok: true, messageR });
        });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }
}

const whatsappController = new WhatsappController();
export default whatsappController;
