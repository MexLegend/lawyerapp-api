"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');
const postMdl_1 = __importDefault(require("../models/postMdl"));
class PostController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            // return;
            try {
                const { content, external_sources, title } = req.body.post;
                const postN = new postMdl_1.default({
                    content,
                    external_sources,
                    img: req.body.img.url ? req.body.img.url : 'no_image',
                    public_id: req.body.img.public_id
                        ? req.body.img.public_id
                        : '',
                    title,
                    user: req.user._id,
                });
                const post = yield postMdl_1.default.create(postN);
                res.status(201).json({ message: 'Articulo creado correctamente', ok: true, post });
            }
            catch (err) {
                res.status(500).json({ err, message: 'Error al crear el articulo', ok: false });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const changeStatus = {
                    status: false
                };
                const post = yield postMdl_1.default.findOneAndUpdate({ _id: id }, changeStatus, {
                    new: true
                });
                if (!post) {
                    return res.status(404).json({
                        message: 'No se encontro al Articulo',
                        ok: false
                    });
                }
                return res.json({
                    message: `Articulo ${post.title} borrado`,
                    ok: true,
                    post
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'No se encontro el Articulo',
                    ok: false
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return console.log(req.body);
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, filterOpt = 'title', page = 1, perPage = 10, orderField, orderType, status } = req.query;
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    sort: {
                        title: 1
                    }
                };
                let filtroE = new RegExp(filter, 'i');
                const query = {
                    $and: [
                        {
                            [filterOpt]: filtroE
                        },
                        {
                            status
                        }
                    ]
                };
                if (orderField && orderType) {
                    options.sort = {
                        [orderField]: orderType
                    };
                }
                const posts = yield postMdl_1.default.paginate(query, options);
                return res.status(200).json({
                    posts,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postMdl_1.default.findOne({ _id: req.params.id }).populate('user');
                res.status(200).json({ ok: true, post });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { content, external_sources, title } = req.body.post;
                const postG = yield postMdl_1.default.findOne({ _id: id });
                if (req.body.img.url) {
                    if (postG.public_id && postG.public_id !== undefined && postG.public_id !== '') {
                        yield cloudinary.v2.uploader.destroy(postG.public_id);
                    }
                }
                const postU = {
                    content: (content !== undefined && content !== '') ? content : postG.content,
                    external_sources: (external_sources !== undefined && external_sources !== '') ? external_sources : postG.external_sources,
                    img: req.body.img.url ? req.body.img.url : postG.img,
                    public_id: req.body.img.public_id
                        ? req.body.img.public_id
                        : postG.public_id,
                    title: (title !== undefined && title !== '') ? title : postG.title
                };
                const post = yield postMdl_1.default.findOneAndUpdate({ _id: id }, postU, {
                    new: true
                });
                return res.json({ message: 'Articulo actualizado correctamente', ok: true, post });
            }
            catch (err) {
                res.status(500).json({ err, message: 'Error al actualizar el articulo', ok: false });
            }
        });
    }
}
const postController = new PostController();
exports.default = postController;
