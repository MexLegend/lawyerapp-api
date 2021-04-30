import { Request, Response } from 'express';
import { transporter, generateMessageContent } from '../classes/mailer';
import NewsLetter from '../models/newsLetterMdl';
import User from '../models/userMdl';

class EmailController {
  public async newsLetterConfirmed(req: Request, res: Response) {
    try {
      const { idEmail } = req.params;

      const emailConfirmed = await NewsLetter.findByIdAndUpdate(
        { _id: idEmail },
        { isConfirmed: true },
        {
          new: true
        }
      );

      res.status(201).json({ ok: true, emailConfirmed });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async newsLetterUnsubscribe(req: Request, res: Response) {
    try {
      const { idEmail } = req.body;

      const emailUnsubscribed = await NewsLetter.findByIdAndUpdate(
        { _id: idEmail },
        { status: false },
        {
          new: true
        }
      );

      res.status(201).json({ ok: true, emailUnsubscribed });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async send(req: Request, res: Response) {
    try {
      const {
        action,
        emailSender,
        emailReceiver,
        lawyerName,
        link,
        messageContact,
        nameContact,
        phoneContact,
        subject
      } = req.body;

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
                  ${generateMessageContent(action, {
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
        from: `Haizen Abogados <armandolarae97@gmail.com>`, // sender address
        to: emailSender, // list of receivers
        subject: subject, // Subject line
        html: contentHTML
      };

      // Insert a New Row/Document Into The NewsLetter Collection
      if (action === 'confirmNewsLetter')
        await NewsLetter.create({ email: emailSender });

      await transporter.sendMail(mailOptions, function (e: any, r: any) {
        if (e) {
          console.log(e);
        } else {
          console.log(r);
        }
        transporter.close();
      });

      res
        .status(201)
        .json({ ok: true, nameContact, messageContact, emailSender });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async userAccountConfirmed(req: Request, res: Response) {
    try {
      const { idUser } = req.params;

      const accountConfirmed = await User.findByIdAndUpdate(
        { _id: idUser },
        { isConfirmed: true },
        {
          new: true
        }
      );

      res.status(201).json({ ok: true, accountConfirmed });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }
}

const emailController = new EmailController();
export default emailController;
