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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = require("../classes/mailer");
const newsLetterMdl_1 = __importDefault(require("../models/newsLetterMdl"));
const userMdl_1 = __importDefault(require("../models/userMdl"));
class EmailController {
    newsLetterConfirmed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idEmail } = req.params;
                const emailConfirmed = yield newsLetterMdl_1.default.findByIdAndUpdate({ _id: idEmail }, { isConfirmed: true }, {
                    new: true
                });
                res.status(201).json({ ok: true, emailConfirmed });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    newsLetterUnsubscribe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idEmail } = req.body;
                const emailUnsubscribed = yield newsLetterMdl_1.default.findByIdAndUpdate({ _id: idEmail }, { status: false }, {
                    new: true
                });
                res.status(201).json({ ok: true, emailUnsubscribed });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    send(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { action, emailSender, emailReceiver, lawyerName, link, messageContact, nameContact, phoneContact, subject } = req.body;
                console.log(link);
                const contentHTML = `
      <div
        style="
          text-align: center;
          min-width: 640px;
          width: 100%;
          height: 100%;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #fafafa;
        "
      >
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          id="x_body"
          bgcolor="#fafafa"
          style="
            text-align: center;
            min-width: 640px;
            width: 100%;
            margin: 0;
            padding: 0;
          "
        >
          <tbody>
            <tr class="x_line">
              <td
                bgcolor="#2e89ff"
                style="
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  height: 4px;
                  font-size: 4px;
                  line-height: 4px;
                "
              ></td>
            </tr>
            <tr class="x_header">
              <td
                style="
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  font-size: 13px;
                  line-height: 1.6;
                  color: #5c5c5c;
                  padding: 25px 0;
                "
              >
                <img
                  src="https://res.cloudinary.com/devmexsoft/image/upload/v1619318517/SiteImages/Logotipo_Escudo_Haizen_2_yku6aq.png"
                  alt="Haizen"
                  width="80"
                  height="66"
                />
              </td>
            </tr>
            <tr>
              <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif">
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="x_wrapper"
                  style="
                    width: 640px;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin: 0 auto;
                  "
                >
                  ${mailer_1.generateMessageContent(action, {
                    emailSender,
                    lawyerName,
                    link,
                    messageContact,
                    nameContact,
                    phoneContact
                })}
                </table>
              </td>
            </tr>
            <tr class="x_footer">
              <td
                style="
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  font-size: 13px;
                  line-height: 1.6;
                  color: #5c5c5c;
                  padding: 25px 0;
                "
              >
                <img
                  src="https://res.cloudinary.com/devmexsoft/image/upload/v1619303278/SiteImages/logo_dark_eooqwr.png"
                  alt="Haizen"
                  height="33"
                  width="90"
                  style="display: block; margin: 0 auto 1em"
                />
                <div>
                  Estás recibiendo este correo electrónico debido a tu cuenta de
                  Haizen-Abogados.
                  <a
                    href="https://lawyerapp2020.web.app/#/profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-auth="NotApplicable"
                    class="x_mng-notif-link"
                    style="color: #3777b0; text-decoration: none"
                    data-linkindex="2"
                    >Gestionar las notificaciones</a
                  >
                  ·
                  <a
                    href="https://gitlab.com/help"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-auth="NotApplicable"
                    class="x_help-link"
                    style="color: #3777b0; text-decoration: none"
                    data-linkindex="3"
                    >Ayuda</a
                  >
                </div>
              </td>
            </tr>
            <tr>
              <td
                class="x_footer-message"
                style="
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  font-size: 13px;
                  line-height: 1.6;
                  color: #5c5c5c;
                  padding: 25px 0;
                "
              ></td>
            </tr>
          </tbody>
        </table>
      </div>
      `;
                let mailOptions = {
                    from: `Haizen Abogados <armandolarae97@gmail.com>`,
                    to: 'armandoskate2011@hotmail.com',
                    subject: subject,
                    html: contentHTML
                };
                // Insert a New Row/Document Into The NewsLetter Collection
                if (action === 'confirmNewsLetter')
                    yield newsLetterMdl_1.default.create({ email: emailSender });
                yield mailer_1.transporter.sendMail(mailOptions, function (e, r) {
                    if (e) {
                        console.log(e);
                    }
                    else {
                        console.log(r);
                    }
                    mailer_1.transporter.close();
                });
                res
                    .status(201)
                    .json({ ok: true, nameContact, messageContact, emailSender });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    userAccountConfirmed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req.params;
                const accountConfirmed = yield userMdl_1.default.findByIdAndUpdate({ _id: idUser }, { isConfirmed: true }, {
                    new: true
                });
                res.status(201).json({ ok: true, accountConfirmed });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
}
const emailController = new EmailController();
exports.default = emailController;
