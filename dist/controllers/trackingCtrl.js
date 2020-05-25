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
const fileMdl_1 = __importDefault(require("../models/fileMdl"));
const trackingMdl_1 = __importDefault(require("../models/trackingMdl"));
const mongoose_1 = require("mongoose");
class TrackingController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            console.log(req.files);
            console.log(req.files.length >= 1);
            // console.log(req.params)
            //   return;
            try {
                const { id } = req.params;
                const trackings = yield trackingMdl_1.default.find({ file: id });
                console.log(trackings.length);
                //   return;
                const totalT = Number(trackings.length) + 1;
                if (req.body.comment) {
                    console.log('COMMENT---');
                    const trackingN = new trackingMdl_1.default({
                        comments: [
                            {
                                comment: req.body.comment,
                                numV: 1
                            }
                        ],
                        documents: [],
                        file: id,
                        status: 'OPEN',
                        track: totalT,
                        volumes: [
                            {
                                num: 1
                            }
                        ]
                    });
                    const tracking = yield trackingMdl_1.default.create(trackingN);
                    return res.json({
                        tracking,
                        message: 'Seguimiento creado correctamente',
                        ok: true
                    });
                }
                else if (req.files && req.files.length >= 1) {
                    console.log(req.files);
                    console.log('FILES---');
                    const trackingN = new trackingMdl_1.default({
                        comments: [],
                        documents: [],
                        file: id,
                        status: 'OPEN',
                        track: totalT,
                        volumes: [
                            {
                                num: 1
                            }
                        ]
                    });
                    req.files.forEach((elem) => {
                        let filePath = `${req.hostname}:3000/ftp/uploads/${elem.originalname}`;
                        trackingN.documents.push({
                            document: filePath,
                            numV: 1
                        });
                    });
                    const tracking = yield trackingMdl_1.default.create(trackingN);
                    return res.json({
                        tracking,
                        message: 'Seguimiento creado correctamente',
                        ok: true
                    });
                }
                else if (req.body.status) {
                    //    console.log(req.body.status);
                    //    console.log('STATUS---');
                    //    return;
                    const trackingN = new trackingMdl_1.default({
                        comments: [],
                        documents: [],
                        file: id,
                        status: req.body.status,
                        track: totalT,
                        volumes: [
                            {
                                num: 1
                            }
                        ]
                    });
                    const tracking = yield trackingMdl_1.default.create(trackingN);
                    return res.json({
                        tracking,
                        message: 'Seguimiento creado correctamente',
                        ok: true
                    });
                }
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al crear el Seguimiento', ok: false });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.params)
            // return;
            try {
                const { id, idDoc } = req.params;
                const tracking = yield trackingMdl_1.default.findOne({
                    _id: id
                });
                let newDocs = [];
                newDocs = tracking.documents.filter((doc) => {
                    return doc._id.toString() !== idDoc.toString();
                });
                const trackingU = yield trackingMdl_1.default.findOneAndUpdate({
                    _id: id
                }, {
                    $set: { documents: newDocs }
                }, {
                    new: true
                });
                console.log('NEWDOCS>>', newDocs);
                res.status(200).json({ tracking: trackingU, ok: true });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    getByLowyer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.user._id);
                // const files: any = await File.aggregate([
                //   {
                //     $match: {
                //       user: req.user._id,
                //     },
                //   },
                //   {
                //     $lookup: {
                //       from: 'trackings',
                //       localField: '_id',
                //       foreignField: 'file',
                //       as: 'tracks',
                //     },
                //   },
                // ])
                const files = yield fileMdl_1.default.aggregate([
                    {
                        $match: {
                            user: mongoose_1.Types.ObjectId(req.user._id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'trackings',
                            let: { idFile: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [{ $eq: ['$file', '$$idFile'] }]
                                        }
                                    }
                                }
                            ],
                            as: 'tracks'
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            let: { client: '$assigned_client' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$_id', '$$client']
                                        }
                                    }
                                }
                            ],
                            as: 'assigned_client'
                        }
                    }
                ]);
                res.status(200).json({ files, ok: true });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, filterOpt = 'track', page = 1, perPage = 10, orderField, orderType, status } = req.query;
                const { id } = req.params;
                console.log(id);
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    populate: [
                        {
                            path: 'file'
                        }
                    ],
                    sort: {
                        track: 1
                    }
                };
                let filtroE = new RegExp(filter, 'i');
                const query = {
                    status: 'OPEN',
                    $or: [
                        {
                            file: id
                        }
                    ]
                };
                if (orderField && orderType) {
                    options.sort = {
                        [orderField]: orderType
                    };
                }
                const trackings = yield trackingMdl_1.default.paginate(query, options);
                return res.status(200).json({
                    trackings,
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
                const file = yield trackingMdl_1.default.findOne({ _id: req.params.id }).populate('assigned_client');
                res.status(200).json({ ok: true, file });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            // console.log(req.files);
            // console.log(req.params)
            // return;
            try {
                const { id } = req.params;
                if (req.body.comment) {
                    const newComment = {
                        comment: req.body.comment,
                        numV: 1
                    };
                    // let fileV: any = await Tracking.findOne({ _id: id });
                    // console.log(fileV.volumes.length)
                    // return;
                    // let num = 0;
                    // num += Number(fileV.volumes.length) + 1;
                    // const newVolume = {
                    //   num,
                    //   volume: 'hahahah/20/04'
                    // }
                    // const newKey = {
                    //   num,
                    //   intKey: 'hahahah/20/04'
                    // }
                    console.log(newComment);
                    // return;
                    const tracking = yield trackingMdl_1.default.findOneAndUpdate({ _id: id }, {
                        $push: {
                            comments: newComment
                        }
                    }, {
                        new: true
                    });
                    return res.json({
                        tracking,
                        message: 'Comentarios agregados',
                        ok: true
                    });
                }
                else if (req.files && req.body.tracking) {
                    console.log(req.files);
                    let documents = [];
                    req.files.forEach((elem) => {
                        let filePath = `${req.hostname}:3000/ftp/uploads/${elem.originalname}`;
                        documents.push({
                            document: filePath,
                            numV: 1
                        });
                    });
                    console.log(documents);
                    // return;
                    const tracking = yield trackingMdl_1.default.findOneAndUpdate({ _id: id }, {
                        $push: {
                            documents
                        }
                    }, {
                        new: true
                    });
                    return res.json({
                        tracking,
                        message: 'Archivos agregados correctamente',
                        ok: true
                    });
                }
                else {
                    const tracking = yield trackingMdl_1.default.findOneAndUpdate({ _id: id }, req.body, {
                        new: true
                    });
                    return res.json({
                        tracking,
                        message: 'Expediente actualizado correctamente',
                        ok: true
                    });
                }
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al actualizar el Expediente', ok: false });
            }
        });
    }
}
const trackingController = new TrackingController();
exports.default = trackingController;
