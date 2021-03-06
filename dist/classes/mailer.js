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
exports.sendEmail = exports.generateMessageContent = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { MAILING_SERVICE_CLIENT_ID, MAILING_SERVICE_CLIENT_SECRET, MAILING_SERVICE_REDIRECT_URI, MAILING_SERVICE_REFRESH_TOKEN, SENDER_EMAIL_ADDRESS } = process.env;
const oAuth2Client = new google.auth.OAuth2(MAILING_SERVICE_CLIENT_ID, MAILING_SERVICE_CLIENT_SECRET, MAILING_SERVICE_REDIRECT_URI);
exports.generateMessageContent = (action, data) => {
    if (action === 'caseEvaluation' || action === 'lawyerContact') {
        return `
    <tbody>
      <tr>
        <td
          align="left"
          bgcolor="#fff"
          style="
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            border-radius: 3px;
            overflow: hidden;
            padding: 18px 25px;
            border: 1px solid #ededed;
          "
        >
          <table
            border="0"
            style="
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
            "
          >
            <tbody>
              <!-- Header Text -->
              <tr>
                <td
                  align="center"
                  bgcolor="#2e89ff"
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial,
                      sans-serif;
                    border-radius: 3px;
                    font-size: 14px;
                    line-height: 1.3;
                    overflow: hidden;
                    color: #ffffff;
                    padding: 10px;
                  "
                >
                  <table
                    border="0"
                    style="border-collapse: collapse; margin: 0 auto"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          valign="middle"
                          style="
                            font-family: 'Helvetica Neue', Helvetica,
                              Arial, sans-serif;
                            color: #ffffff;
                          "
                        >
                          <span>
                            ${action === 'caseEvaluation'
            ? 'Solicitud de evaluación de caso'
            : 'Formulario de contacto de Haizen-Abogados'}</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <!-- Spacer -->
              <tr>
                <td
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial,
                      sans-serif;
                    height: 18px;
                    font-size: 18px;
                    line-height: 18px;
                  "
                >
                  &nbsp;
                </td>
              </tr>
              <!-- Text Paragraph -->
              <tr>
                <td
                  align="center"
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial,
                      sans-serif;
                    line-height: 1.4;
                    overflow: hidden;
                    padding: 0 15px;
                  "
                >
                  <table
                    border="0"
                    style="border-collapse: collapse; width: 100%"
                  >
                    <tbody>
                      <tr style="width: 100%">
                        <td
                          align="center"
                          style="
                            font-family: 'Helvetica Neue', Helvetica,
                              Arial, sans-serif;
                            font-size: 15px;
                            line-height: 1.4;
                            color: #5a5a5a;
                            font-weight: 300;
                            margin: 0;
                            padding: 14px 0;
                            text-align: left;
                          "
                        >
                          <p>
                            Estimado(a) Lic:
                            <strong>${data.lawyerName.toUpperCase()}</strong>
                          </p>
                          <p>
                            ${action === 'caseEvaluation'
            ? 'Se ha registrado una nueva solicitud de evaluación de un caso. Los datos del solicitante son:'
            : 'Un nuevo usuario ha solicitado ponerse en contacto contigo. Los datos del solicitante son:'}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <!-- User Details Table  -->
              <tr>
                <td
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial,
                      sans-serif;
                    border-radius: 3px;
                    overflow: hidden;
                    padding: 0 15px;
                    border: 1px solid #ededed;
                  "
                >
                  <table
                    border="0"
                    style="width: 100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            font-family: 'Helvetica Neue', Helvetica,
                              Arial, sans-serif;
                            font-size: 15px;
                            line-height: 1.4;
                            color: #8c8c8c;
                            font-weight: 300;
                            margin: 0;
                            padding: 14px 0;
                          "
                        >
                          Nombre
                        </td>
                        <td
                          style="
                            font-family: 'Helvetica Neue', Helvetica,
                              Arial, sans-serif;
                            font-size: 15px;
                            line-height: 1.4;
                            color: #333333;
                            font-weight: 400;
                            width: 75%;
                            margin: 0;
                            padding: 14px 0 14px 5px;
                          "
                        >
                          ${data.nameContact}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            font-family: 'Helvetica Neue', Helvetica,
                              Arial, sans-serif;
                            font-size: 15px;
                            line-height: 1.4;
                            color: #8c8c8c;
                            font-weight: 300;
                            margin: 0;
                            padding: 14px 0;
                          "
                        >
                          Email
                        </td>
                        <td
                          style="
                            font-family: 'Helvetica Neue', Helvetica,
                              Arial, sans-serif;
                            font-size: 15px;
                            line-height: 1.4;
                            color: #333333;
                            font-weight: 400;
                            width: 75%;
                            margin: 0;
                            padding: 14px 0 14px 5px;
                          "
                        >
                          ${data.emailSender}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            font-family: 'Helvetica Neue', Helvetica,
                              Arial, sans-serif;
                            font-size: 15px;
                            line-height: 1.4;
                            color: #8c8c8c;
                            font-weight: 300;
                            border-top-width: 1px;
                            border-top-color: #ededed;
                            border-top-style: solid;
                            margin: 0;
                            padding: 14px 0;
                          "
                        >
                          Número
                        </td>
                        <td
                          style="
                            font-family: 'Helvetica Neue', Helvetica,
                              Arial, sans-serif;
                            font-size: 15px;
                            line-height: 1.4;
                            color: #333333;
                            font-weight: 400;
                            width: 75%;
                            border-top-width: 1px;
                            border-top-color: #ededed;
                            border-top-style: solid;
                            margin: 0;
                            padding: 14px 0 14px 5px;
                          "
                        >
                          <span
                            style="
                              color: #333333;
                              text-decoration: none;
                            "
                            >${data.phoneContact ? data.phoneContact : 'S/N'}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            font-family: 'Helvetica Neue', Helvetica,
                              Arial, sans-serif;
                            font-size: 15px;
                            line-height: 1.4;
                            color: #8c8c8c;
                            font-weight: 300;
                            border-top-width: 1px;
                            border-top-color: #ededed;
                            border-top-style: solid;
                            margin: 0;
                            padding: 14px 0;
                          "
                        >
                          ${action === 'caseEvaluation'
            ? 'Acerca del caso'
            : 'Mensaje'}
                        </td>
                        <td
                          style="
                            font-family: 'Helvetica Neue', Helvetica,
                              Arial, sans-serif;
                            font-size: 15px;
                            line-height: 1.4;
                            color: #333333;
                            font-weight: 400;
                            width: 75%;
                            border-top-width: 1px;
                            border-top-color: #ededed;
                            border-top-style: solid;
                            margin: 0;
                            padding: 14px 0 14px 5px;
                          "
                        >
                          ${data.messageContact}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
    `;
    }
    else {
        const SECRET = process.env.SECRET;
        const token = jsonwebtoken_1.sign({
            id: data.id,
            action
        }, SECRET, {
            expiresIn: process.env.CONFIRM_EMAIL_EXPIRATION
        });
        const emailData = () => {
            switch (action) {
                case 'confirmNewsLetter':
                    return {
                        title: 'Confirma tu suscripción del boletín de Haizen',
                        subtitle: 'Se el primero en informarte de las noticias, ofertas, actualizaciones y todo lo que estamos haciendo en Haizen Abogados.',
                        buttonText: 'Confirmar suscripción',
                        link: `${data.link}?token=${token}`
                    };
                case 'newsLetterConfirmed':
                    return {
                        title: 'Nueva suscripción al boletín de Haizen',
                        subtitle: `Un nuevo usuario se ha suscrito con el correo <span style="font-weight: 600;">${data.emailSender}</span>.`,
                        buttonText: 'Ver lista de correos',
                        link: `${data.link}?token=${token}`
                    };
                case 'recoverAccount':
                    return {
                        title: `Hola, ${data.nameContact}:`,
                        subtitle: ` 
            <p style="text-align: left; line-height: 24px">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de Haizen. 
            Utiliza el botón siguiente para hacerlo. Si no solicitaste restablecer la contraseña, puedes 
            ignorar este mensaje.</p>`,
                        buttonText: 'Restablece tu contraseña',
                        link: `${data.link}?token=${token}`
                    };
                default:
                    return {
                        title: '¡Gracias por registrarte en Haizen Abogados!',
                        subtitle: 'Para continuar, haz clic en el botón de abajo para verificar tu cuenta.',
                        buttonText: 'Verificar cuenta',
                        link: `${data.link}?token=${token}`
                    };
            }
        };
        return `
    <tbody>
      <tr>
        <td
          align="left"
          bgcolor="#ffffff"
          style="
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            border-radius: 3px;
            overflow: hidden;
            padding: 18px 25px;
            border: 1px solid #ededed;
          "
        >
          <table
            border="0"
            style="width: 100%; border-collapse: separate; border-spacing: 0"
          >
            <tbody>
              <tr>
                <td
                  align="center"
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    color: #333333;
                    font-size: 15px;
                    font-weight: 400;
                    line-height: 1.4;
                    padding: 15px 5px;
                  "
                >
                <h1
                  align="center"
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    color: #333333;
                    font-size: 18px;
                    font-weight: 400;
                    line-height: 1.4;
                    margin: 0;
                    padding: 0;
                  "
                >
                  ${emailData().title}
                </h1>
                  <p>
                  ${emailData().subtitle}
                  </p>
                  <p style="margin-top: 30px;">
                    <a
                      href="${emailData().link}"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-auth="NotApplicable"
                      style="color: white;
                      background-color: #2e89ff;
                      text-decoration: none;
                      padding: 10px 15px;
                      border-radius: 4px;"
                      data-linkindex="1"
                      >${emailData().buttonText}</a
                    >
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
    `;
    }
};
exports.sendEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    oAuth2Client.setCredentials({ refresh_token: MAILING_SERVICE_REFRESH_TOKEN });
    const accessToken = () => __awaiter(void 0, void 0, void 0, function* () { return yield oAuth2Client.getAccessToken(); });
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            // pass: 'wrvstyqevfigaiyh',
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken: accessToken()
        }
    });
    yield transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error en el token');
        }
        else {
            console.log(info);
        }
        transporter.close();
    });
});
