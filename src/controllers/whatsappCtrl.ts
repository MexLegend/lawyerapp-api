import { Request, Response } from 'express';

class WhatsappController {
    public async send(req: any, res: Response) {
        try {
            // console.log('yeyey')

            console.log(req.body.message)

            // const { message } = req.body;

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
                console.log(messageR)
                return res.status(201).json({ ok: true, messageR });
              });

        } catch (err) {
            res.status(500).json({ err, ok: false });
        }
    }
}

const whatsappController = new WhatsappController();
export default whatsappController;
