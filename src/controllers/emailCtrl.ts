import { Response } from 'express';
let api_key = 'cbcd76121bde25517e4dcb5960ee617a-816b23ef-e8fa4a3e';
let domain = 'sandbox5237fba630bf4507ae9e9fe187a4adf4.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });


class EmailController {
    public async send(req: any, res: Response) {
        try {

            // return console.log(req.body)

            const { cityContact, emailContact, messageContact, nameContact, phoneContact } = req.body;

            const contentHTML = `
                <h1>Informacion de Usuario</h1>
                <ul>
                    <li>Nombre y Apellidos: ${ nameContact }</li>
                    <li>Contacto: ${ emailContact }</li>
                    <li>Telefono: ${ phoneContact }</li>
                    <li>Ciudad: ${ cityContact }</li>
                </ul>
                <p>${ messageContact }</p>
            `;

            const data = {
                from: emailContact,
                to: 'turbinarest@gmail.com',
                subject: 'Formulario de Contacto',
                html: contentHTML
            };

            mailgun.messages().send(data, function (error: any, body: any) {
                if (error) {
                    console.log(error);
                }
                console.log(body);
            });
            // // return console.log(body)

            // const postN = new Post({
            //     author: body.author,
            //     content: body.content,
            //     title: body.title,
            //     user: req.user._id
            // });
            // const post = await Post.create(postN);
            return res.status(201).json({ ok: true, nameContact, messageContact, emailContact });
        } catch (err) {
            res.status(500).json({ err, ok: false });
        }
    }
}

const emailController = new EmailController();
export default emailController;
