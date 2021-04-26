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
exports.generateMessageContent = exports.transporter = void 0;
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const CLIENT_ID = '783095484543-0m8et20nutqgpn6gv5ohhhjjt1vc9dvm.apps.googleusercontent.com';
const CLIENT_SECRET = 'yUJ6ewqa6NV6dh3Ao1ZircGR';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04piBd1fZzXMACgYIARAAGAQSNwF-L9Irr2PBfbU6QX9KELAc1v4RZBw3nS-hVlb-89_05BR5E54P5FsdoeMTG_Lm3Vw7gfLgd3M';
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const accessToken = () => __awaiter(void 0, void 0, void 0, function* () { return yield oAuth2Client.getAccessToken(); });
// create reusable transporter object using the default SMTP transport
exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'armandolarae97@gmail.com',
        // pass: 'wrvstyqevfigaiyh',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken()
    }
});
exports.transporter.verify().then(() => {
    console.log('Ready for send emails');
});
exports.generateMessageContent = (action, data) => {
    if (action !== 'newsLetter') {
        return `
    <tbody>
      <tr>
        <td
          class="x_wrapper-cell"
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
            cellpadding="0"
            cellspacing="0"
            class="x_content"
            style="
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
            "
          >
            <tbody>
              <!-- Header Text -->
              <tr class="x_alert">
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
                    cellpadding="0"
                    cellspacing="0"
                    class="x_img"
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
              <tr class="x_spacer">
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
              <tr class="x_section">
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
                    cellpadding="0"
                    cellspacing="0"
                    class="x_img"
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
                            Se ha registrado una nueva solicitud de
                            evaluación de un caso. Los datos del
                            solicitante son:
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <!-- User Details Table  -->
              <tr class="x_section">
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
                    cellpadding="0"
                    cellspacing="0"
                    class="x_info"
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
                          ${data.emailContact}
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
                            class="x_muted"
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
        return `
    <tbody>
      <tr>
        <td
          class="x_wrapper-cell"
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
            cellpadding="0"
            cellspacing="0"
            class="x_content"
            style="width: 100%; border-collapse: separate; border-spacing: 0"
          >
            <tbody>
              <tr>
                <td
                  class="x_text-content"
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
                  Nueva suscripción al boletín de Haizen
                </h1>
                  <p>
                    Un nuevo usuario se ha suscrito con el correo
                    <span
                      style="
                        color: #3777b0;
                        text-decoration: none;
                        font-weight: 600;
                      "
                      >${data.emailContact}</span
                    >.
                  </p>
                  <p>
                    <a
                      href="http://localhost:4200/#/inicio"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-auth="NotApplicable"
                      style="color: #3777b0; text-decoration: none"
                      data-linkindex="1"
                      >Ver lista de correos</a
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
