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
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const postMdl_1 = __importDefault(require("../models/postMdl"));
const postAnalyticsMdl_1 = __importDefault(require("../models/postAnalyticsMdl"));
class PostController {
    // Insert a New Row/Document Into The Posts Collection
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postImage: { url: postImage = null, public_id = null } = {}, postData } = req.body;
                const post = yield postMdl_1.default.create(Object.assign(Object.assign(Object.assign({}, (postImage ? { postImage } : {})), (public_id ? { public_id } : {})), postData));
                const postAnalyticN = new postAnalyticsMdl_1.default({
                    comments: [],
                    dislikes: 0,
                    likes: 0,
                    reactions: [],
                    post: post._id
                });
                yield postAnalyticsMdl_1.default.create(postAnalyticN);
                res
                    .status(201)
                    .json({ message: 'Articulo creado correctamente', ok: true, post });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al crear el articulo', ok: false });
            }
        });
    }
    // Delete Temporary a Row/Document From The Posts Collection
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
                    message: `Articulo ${post.postTitle} borrado`,
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
    // Get All Rows/Documents From Posts Collection
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, filterOpt = 'postTitle', page = 1, perPage = 10, orderField, orderType, status, processState } = req.query;
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    populate: [
                        {
                            path: 'user'
                        },
                        {
                            path: 'postCategories.category'
                        }
                    ],
                    sort: {
                        created_at: -1
                    }
                };
                let filtroE = new RegExp(filter, 'i');
                let processStateQuery = processState
                    ? [
                        {
                            [filterOpt]: filtroE
                        },
                        {
                            status
                        },
                        {
                            processState: 'PUBLISH'
                        }
                    ]
                    : [
                        {
                            [filterOpt]: filtroE
                        },
                        {
                            status
                        }
                    ];
                const query = {
                    $and: processStateQuery
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
    // Get All Rows/Documents Of Lawyer From Posts Collection
    getByLawyer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, filterOpt = 'postTitle', page = 1, perPage = 10, orderField, orderType, status, lawyerId } = req.query;
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    populate: [
                        {
                            path: 'user'
                        },
                        {
                            path: 'postCategories.category'
                        }
                    ],
                    sort: {
                        created_at: -1
                    }
                };
                let filtroE = new RegExp(filter, 'i');
                let roleQuery = [
                    {
                        [filterOpt]: filtroE
                    },
                    {
                        processState: 'PUBLISH'
                    },
                    {
                        status
                    },
                    {
                        user: lawyerId
                    }
                ];
                const query = {
                    $and: roleQuery
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
    // Get All Rows/Documents From Posts Collection With Rol Condition
    getByRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, filterOpt = 'postTitle', page = 1, perPage = 10, orderField, orderType, status, user } = req.query;
                const parsedUserData = JSON.parse(user);
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    populate: [
                        {
                            path: 'user'
                        },
                        {
                            path: 'postCategories.category'
                        }
                    ],
                    sort: {
                        created_at: -1
                    }
                };
                let filtroE = new RegExp(filter, 'i');
                let roleQuery = parsedUserData.role === 'ADMIN'
                    ? [
                        {
                            [filterOpt]: filtroE
                        },
                        {
                            status
                        }
                    ]
                    : [
                        {
                            [filterOpt]: filtroE
                        },
                        {
                            status
                        },
                        {
                            user: parsedUserData._id
                        }
                    ];
                const query = {
                    $and: roleQuery
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
    // Get One Row/Document From Posts Collection
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postMdl_1.default.findOne({ _id: req.params.id })
                    .populate('user')
                    .populate('postCategories.category');
                res.status(200).json({ ok: true, post });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Update One or More Rows/Documents From Posts Collection
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { postImage: { url: postImage = null, public_id = null } = {}, postData, cloudinaryItemsArray } = req.body;
                // Remove Cloudinary Post Main Image And Update It If Request Data Has Image Value
                if (postImage) {
                    const postRequestData = yield postMdl_1.default.findById({ _id: id });
                    if (postRequestData.public_id &&
                        postRequestData.public_id !== undefined &&
                        postRequestData.public_id !== '')
                        yield cloudinary.v2.uploader.destroy(postRequestData.public_id);
                }
                // Remove Cloudinary Post Attached Files Or Images
                if (cloudinaryItemsArray.length > 0)
                    cloudinaryItemsArray.map((item) => __awaiter(this, void 0, void 0, function* () { return yield cloudinary.v2.uploader.destroy(item); }));
                const post = yield postMdl_1.default.findByIdAndUpdate({ _id: id }, Object.assign(Object.assign(Object.assign({}, (postImage ? { postImage } : {})), (public_id ? { public_id } : {})), postData), {
                    new: true
                });
                return res.json({
                    message: 'Articulo actualizado correctamente',
                    ok: true,
                    post
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al actualizar el articulo', ok: false });
            }
        });
    }
    // Change The State To Publish Or Rejected From One Row/Document Of Posts Collection
    updateState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const changeStatus = {
                    processState: req.body.processState
                };
                const state = req.body.processState === 'REVIEWING'
                    ? 'En revisión'
                    : req.body.processState === 'PUBLISH'
                        ? 'Publicado'
                        : 'Rechazado';
                const postDB = yield postMdl_1.default.findOneAndUpdate({ _id: id }, changeStatus, {
                    new: true
                }).populate('user');
                if (!postDB) {
                    return res.status(404).json({
                        message: 'No se encontro el Artículo',
                        ok: false
                    });
                }
                return res.json({
                    post: postDB,
                    message: `Artículo ${postDB.postTitle} ${state}.`,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'No se encontro el Artículo',
                    ok: false
                });
            }
        });
    }
}
const postController = new PostController();
exports.default = postController;
