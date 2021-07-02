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
const caseMdl_1 = __importDefault(require("../models/caseMdl"));
const volumeMdl_1 = __importDefault(require("../models/volumeMdl"));
const trackingMdl_1 = __importDefault(require("../models/trackingMdl"));
const mongoose_1 = require("mongoose");
class TrackingController {
    changeTemp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // return;
            try {
                const { idTrack } = req.params;
                let { status } = req.body;
                const tracking = yield trackingMdl_1.default.findOneAndUpdate({ _id: idTrack }, { status: status }, {
                    new: true
                });
                if (!tracking) {
                    return res.status(404).json({
                        message: 'No se encontro el seguimiento',
                        ok: false
                    });
                }
                return res.json({
                    ok: true,
                    tracking
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'No se encontro el evento',
                    ok: false
                });
            }
        });
    }
    // Insert a New Row/Document Into The Trackings Collection
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // return;
            try {
                const { idVolume } = req.params;
                const trackings = yield trackingMdl_1.default.find({ volume: idVolume });
                const volumes = yield volumeMdl_1.default.aggregate([
                    {
                        $match: {
                            _id: idVolume
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
                                            $and: [{ $eq: ['$volume', '$$idFile'] }]
                                        }
                                    }
                                }
                            ],
                            as: 'tracks'
                        }
                    }
                ]);
                const trackingN = new trackingMdl_1.default({
                    message: req.body.message ? req.body.message : '',
                    // Validate If Obtained NoteID Its Not Null
                    noteId: req.body.noteId ? req.body.noteId : null,
                    trackingNotes: [],
                    // Validate If Obtained EvidenceID Its Not Null
                    evidenceId: req.body.evidenceId ? req.body.evidenceId : null,
                    trackingEvidences: [],
                    volume: idVolume
                });
                // Validate If Obtained Notes Array Its Not Empty
                if (req.body.notes.length > 0) {
                    req.body.notes.forEach((note) => {
                        trackingN.trackingNotes.push({
                            note
                        });
                    });
                }
                // Validate If Obtained Evidences Array Its Not Empty
                if (req.body.evidences.length > 0) {
                    req.body.evidences.forEach((evidence) => {
                        trackingN.trackingEvidences.push({
                            evidence
                        });
                    });
                }
                // Returned Tracking Data After Have Been Creating
                const creatingTracking = yield trackingMdl_1.default.create(trackingN);
                // Returned Tracking With Complete Data
                const tracking = yield trackingMdl_1.default.aggregate([
                    {
                        $match: { _id: mongoose_1.Types.ObjectId(creatingTracking.toJSON()._id) }
                    },
                    {
                        $lookup: {
                            from: 'evidences',
                            let: {
                                trackingCaseEvidenceId: '$evidenceId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$_id', '$$trackingCaseEvidenceId']
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        evidences: '$evidences'
                                    }
                                }
                            ],
                            as: 'evidences'
                        }
                    },
                    {
                        $unwind: {
                            path: '$evidences',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: 'notes',
                            let: {
                                trackingCaseNoteId: '$noteId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$_id', '$$trackingCaseNoteId']
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        notes: '$notes'
                                    }
                                }
                            ],
                            as: 'notes'
                        }
                    },
                    {
                        $unwind: {
                            path: '$notes',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            _id: '$_id',
                            volume: '$volume',
                            status: '$status',
                            date: '$date',
                            message: '$message',
                            noteId: '$noteId',
                            trackingNotes: {
                                $filter: {
                                    input: '$notes.notes',
                                    as: 'notesList',
                                    cond: {
                                        $in: ['$$notesList._id', '$trackingNotes.note']
                                    }
                                }
                            },
                            evidenceId: '$evidenceId',
                            trackingEvidences: {
                                $filter: {
                                    input: '$evidences.evidences',
                                    as: 'evidencesList',
                                    cond: {
                                        $in: ['$$evidencesList._id', '$trackingEvidences.evidence']
                                    }
                                }
                            }
                        }
                    }
                ]);
                return res.json({
                    volumes,
                    tracking,
                    message: 'Seguimiento creado correctamente',
                    ok: true
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al crear el Seguimiento', ok: false });
            }
        });
    }
    // Delete Temporary a Row/Document From The Trackings Collection
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tracking = yield trackingMdl_1.default.findOneAndDelete({
                    _id: id
                });
                res.status(200).json({ tracking, ok: true });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get All Rows/Documents From Trackings Collection
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, filterOpt = 'track', page = 1, perPage = 10, orderField, orderType } = req.query;
                const { idVolume } = req.params;
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
                    status: 'SENT',
                    $or: [
                        {
                            volume: idVolume
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
    // Get All Rows/Documents From Trackings Collection With Rol Condition
    getByClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // return;
            try {
                const { idCase, idClient } = req.params;
                let match = idCase !== 'undefined'
                    ? {
                        $and: [
                            {
                                _id: mongoose_1.Types.ObjectId(idCase)
                            },
                            {
                                assigned_client: mongoose_1.Types.ObjectId(idClient)
                            }
                        ]
                    }
                    : {
                        user: mongoose_1.Types.ObjectId(req.user._id)
                    };
                const cases = yield caseMdl_1.default.aggregate([
                    {
                        $match: match
                    },
                    { $sort: { affair: 1 } },
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
                    },
                    {
                        $lookup: {
                            from: 'volumes',
                            let: { idCase: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [{ $eq: ['$case', '$$idCase'] }]
                                        }
                                    }
                                }
                            ],
                            as: 'volumes'
                        }
                    },
                    {
                        $lookup: {
                            from: 'trackings',
                            let: { volD: '$volumes._id', caseId: '$volumes.case' },
                            pipeline: [
                                {
                                    $match: {
                                        $and: [
                                            {
                                                $expr: {
                                                    $in: ['$volume', '$$volD']
                                                }
                                            },
                                            {
                                                status: {
                                                    $not: { $eq: 'DELETED' }
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'evidences',
                                        let: {
                                            trackingCaseEvidenceId: '$evidenceId'
                                        },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $eq: ['$_id', '$$trackingCaseEvidenceId']
                                                    }
                                                }
                                            },
                                            {
                                                $project: {
                                                    evidences: '$evidences'
                                                }
                                            }
                                        ],
                                        as: 'evidences'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: '$evidences',
                                        preserveNullAndEmptyArrays: true
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'notes',
                                        let: {
                                            trackingCaseNoteId: '$noteId'
                                        },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $eq: ['$_id', '$$trackingCaseNoteId']
                                                    }
                                                }
                                            },
                                            {
                                                $project: {
                                                    notes: '$notes'
                                                }
                                            }
                                        ],
                                        as: 'notes'
                                    }
                                },
                                { $unwind: { path: '$notes', preserveNullAndEmptyArrays: true } },
                                {
                                    $project: {
                                        date: '$date',
                                        message: '$message',
                                        noteId: '$noteId',
                                        trackingNotes: {
                                            $filter: {
                                                input: '$notes.notes',
                                                as: 'notesList',
                                                cond: {
                                                    $in: ['$$notesList._id', '$trackingNotes.note']
                                                }
                                            }
                                        },
                                        evidenceId: '$evidenceId',
                                        trackingEvidences: {
                                            $filter: {
                                                input: '$evidences.evidences',
                                                as: 'evidencesList',
                                                cond: {
                                                    $in: [
                                                        '$$evidencesList._id',
                                                        '$trackingEvidences.evidence'
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                },
                                { $sort: { date: -1 } }
                            ],
                            as: 'tracks'
                        }
                    }
                ]);
                res.status(200).json({ cases, ok: true });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get One Row/Document From Trackings Collection
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tracking = yield trackingMdl_1.default.findOne({ _id: req.params.id }).populate('file');
                res.status(200).json({ ok: true, tracking });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Update One or More Rows/Documents From Trackings Collection
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idTracking } = req.params;
                const parsedIdTracking = JSON.parse(idTracking);
                const trackingBD = yield trackingMdl_1.default.findOne({
                    _id: parsedIdTracking
                });
                let trackingU = {};
                trackingU = {
                    message: req.body.message ? req.body.message : trackingBD.message,
                    // Validate If Obtained NoteID Its Not Null
                    noteId: req.body.noteId ? req.body.noteId : trackingBD.noteId,
                    trackingNotes: [],
                    // Validate If Obtained EvidenceID Its Not Null
                    evidenceId: req.body.evidenceId
                        ? req.body.evidenceId
                        : trackingBD.evidenceId,
                    trackingEvidences: []
                };
                // Validate If Obtained Notes Array Its Not Empty
                if (req.body.notes.length > 0) {
                    req.body.notes.forEach((note) => {
                        trackingU.trackingNotes.push({
                            note
                        });
                    });
                }
                // Validate If Obtained Evidences Array Its Not Empty
                if (req.body.evidences.length > 0) {
                    req.body.evidences.forEach((evidence) => {
                        trackingU.trackingEvidences.push({
                            evidence
                        });
                    });
                }
                // Returned Tracking Data After Updating
                const updatingTracking = yield trackingMdl_1.default.findOneAndUpdate({ _id: parsedIdTracking }, {
                    $set: {
                        message: trackingU.message,
                        trackingNotes: trackingU.trackingNotes,
                        trackingEvidences: trackingU.trackingEvidences,
                        evidenceId: trackingU.evidenceId,
                        noteId: trackingU.noteId
                    }
                }, {
                    new: true
                });
                // Returned Tracking With Complete Data
                const tracking = yield trackingMdl_1.default.aggregate([
                    {
                        $match: { _id: mongoose_1.Types.ObjectId(updatingTracking.toJSON()._id) }
                    },
                    {
                        $lookup: {
                            from: 'evidences',
                            let: {
                                trackingCaseEvidenceId: '$evidenceId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$_id', '$$trackingCaseEvidenceId']
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        evidences: '$evidences'
                                    }
                                }
                            ],
                            as: 'evidences'
                        }
                    },
                    {
                        $unwind: {
                            path: '$evidences',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: 'notes',
                            let: {
                                trackingCaseNoteId: '$noteId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$_id', '$$trackingCaseNoteId']
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        notes: '$notes'
                                    }
                                }
                            ],
                            as: 'notes'
                        }
                    },
                    {
                        $unwind: {
                            path: '$notes',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            _id: '$_id',
                            volume: '$volume',
                            status: '$status',
                            date: '$date',
                            message: '$message',
                            noteId: '$noteId',
                            trackingNotes: {
                                $filter: {
                                    input: '$notes.notes',
                                    as: 'notesList',
                                    cond: {
                                        $in: ['$$notesList._id', '$trackingNotes.note']
                                    }
                                }
                            },
                            evidenceId: '$evidenceId',
                            trackingEvidences: {
                                $filter: {
                                    input: '$evidences.evidences',
                                    as: 'evidencesList',
                                    cond: {
                                        $in: ['$$evidencesList._id', '$trackingEvidences.evidence']
                                    }
                                }
                            }
                        }
                    }
                ]);
                return res.json({
                    tracking,
                    message: 'Archivos agregados correctamente',
                    ok: true
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al actualizar el Evento', ok: false });
            }
        });
    }
    deleteDoc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                res.status(200).json({ tracking: trackingU, ok: true });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    getByLowyer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // return;
            try {
                const { idVolume } = req.params;
                const { volumes } = req.body;
                const cases = yield caseMdl_1.default.aggregate([
                    {
                        $match: {
                            user: mongoose_1.Types.ObjectId(req.user._id)
                        }
                    },
                    { $sort: { affair: 1 } },
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
                    },
                    {
                        $lookup: {
                            from: 'volumes',
                            let: { idCase: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [{ $eq: ['$case', '$$idCase'] }]
                                        }
                                    }
                                }
                            ],
                            as: 'volumes'
                        }
                    },
                    {
                        $lookup: {
                            from: 'trackings',
                            let: { volD: '$volumes._id' },
                            pipeline: [
                                {
                                    $match: {
                                        $and: [
                                            {
                                                $expr: {
                                                    $in: ['$volume', '$$volD']
                                                }
                                            },
                                            {
                                                status: {
                                                    $not: { $eq: 'DELETED' }
                                                }
                                            }
                                        ]
                                    }
                                },
                                { $sort: { date: -1 } }
                            ],
                            as: 'tracks'
                        }
                    },
                    {
                        $lookup: {
                            from: 'evidences',
                            let: { track: '$tracks.fileId' },
                            pipeline: [{ $match: { $expr: { $in: ['$_id', '$$track'] } } }],
                            as: 'evidences'
                        }
                    }
                ]);
                res.status(200).json({ cases, ok: true });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
}
const trackingController = new TrackingController();
exports.default = trackingController;
