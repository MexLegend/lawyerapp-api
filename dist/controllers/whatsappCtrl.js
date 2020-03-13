"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class WhatsappController {
    send(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('yeyey')
                console.log(req.body.message);
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
                    .then((messageR) => {
                    console.log(messageR);
                    return res.status(201).json({ ok: true, messageR });
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
}
const whatsappController = new WhatsappController();
exports.default = whatsappController;
