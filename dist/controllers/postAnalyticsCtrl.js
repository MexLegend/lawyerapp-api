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
const postAnalyticsMdl_1 = __importDefault(require("../models/postAnalyticsMdl"));
const mongoose_1 = require("mongoose");
class PostAnalyticsController {
    // Get All Rows/Documents From PostAnalytics Collection
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postAnalytics = yield postAnalyticsMdl_1.default.find()
                    .populate('comments.user')
                    .populate('reactions.user');
                res.status(200).json({ ok: true, postAnalytics });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get One Row/Document From PostAnalytics Collection
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idArray } = req.params;
                let idPost;
                let idUser;
                let isUserLoggedIn = false;
                let currentUserAnalyticsReaction = null;
                if (idArray.includes('-')) {
                    isUserLoggedIn = true;
                    idPost = idArray.split('-')[0].toString();
                    idUser = idArray.split('-')[1].toString();
                }
                else {
                    isUserLoggedIn = false;
                    idPost = idArray;
                }
                const postAnalytics = yield postAnalyticsMdl_1.default.findOne({
                    post: idPost
                })
                    .populate('comments.user')
                    .populate('reactions.user');
                if (isUserLoggedIn) {
                    currentUserAnalyticsReaction = postAnalytics.reactions
                        .filter((reactionItem) => reactionItem.user._id.toString() === idUser)
                        .map((reactionItemObtained) => reactionItemObtained.reaction)
                        .toString();
                }
                res
                    .status(200)
                    .json({ ok: true, postAnalytics, currentUserAnalyticsReaction });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Update One or More Rows/Documents From PostAnalytics Collection
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idPost } = req.params;
                const idUser = req.user._id;
                const { reaction, comment } = req.body;
                let reactions, comments, likes, dislikes;
                let isUpdating = false;
                const postAnalyticsBD = yield postAnalyticsMdl_1.default.findOne({
                    post: idPost
                });
                // Validate If Current User Action Is A Reaction
                if (reaction !== null) {
                    // Validate If There Are Reactions
                    if (postAnalyticsBD.reactions.length > 0) {
                        const isCurrentUserReacted = postAnalyticsBD.reactions.filter((reactionItem) => {
                            return reactionItem.user.toString() === idUser.toString();
                        });
                        comments = postAnalyticsBD.comments ? postAnalyticsBD.comments : [];
                        // Validate If Current User Has Been Reactioned Before
                        if (isCurrentUserReacted.length > 0) {
                            isUpdating = true;
                            // Validate If User Reaction Is Equal To Database One
                            if (isCurrentUserReacted[0].reaction === reaction) {
                                if (reaction === 'like') {
                                    (likes =
                                        postAnalyticsBD.likes === 0
                                            ? 0
                                            : (postAnalyticsBD.likes -= 1)),
                                        (dislikes = postAnalyticsBD.dislikes);
                                }
                                else {
                                    (likes = postAnalyticsBD.likes),
                                        (dislikes =
                                            postAnalyticsBD.dislikes === 0
                                                ? 0
                                                : (postAnalyticsBD.dislikes -= 1));
                                }
                                reactions = {
                                    reaction: null,
                                    user: req.user._id
                                };
                            }
                            // Validate If User Reaction Is Different To Database One
                            else {
                                // Validate If User Reaction From Database Is Null
                                if (isCurrentUserReacted[0].reaction === null) {
                                    if (reaction === 'like') {
                                        (likes = postAnalyticsBD.likes += 1),
                                            (dislikes = postAnalyticsBD.dislikes);
                                    }
                                    else {
                                        (likes = postAnalyticsBD.likes),
                                            (dislikes = postAnalyticsBD.dislikes += 1);
                                    }
                                }
                                else {
                                    if (reaction === 'like') {
                                        (likes = postAnalyticsBD.likes += 1),
                                            (dislikes =
                                                postAnalyticsBD.dislikes === 0
                                                    ? 0
                                                    : (postAnalyticsBD.dislikes -= 1));
                                    }
                                    else {
                                        (likes =
                                            postAnalyticsBD.likes === 0
                                                ? 0
                                                : (postAnalyticsBD.likes -= 1)),
                                            (dislikes = postAnalyticsBD.dislikes += 1);
                                    }
                                }
                                reactions = {
                                    reaction: reaction,
                                    user: req.user._id
                                };
                            }
                        }
                        // Validate If Current User Is Reactioning By First Time
                        else {
                            isUpdating = false;
                            if (reaction === 'like') {
                                likes = postAnalyticsBD.likes += 1;
                                dislikes = postAnalyticsBD.dislikes
                                    ? postAnalyticsBD.dislikes
                                    : 0;
                            }
                            else {
                                likes = postAnalyticsBD.likes ? postAnalyticsBD.likes : 0;
                                dislikes = postAnalyticsBD.dislikes += 1;
                            }
                            reactions = {
                                reaction: reaction,
                                user: req.user._id
                            };
                        }
                    }
                    // Validate If There Aren't Reactions
                    else {
                        comments = postAnalyticsBD.comments ? postAnalyticsBD.comments : [];
                        if (reaction === 'like') {
                            likes = postAnalyticsBD.likes += 1;
                            dislikes = postAnalyticsBD.dislikes ? postAnalyticsBD.dislikes : 0;
                        }
                        else {
                            likes = postAnalyticsBD.likes ? postAnalyticsBD.likes : 0;
                            dislikes = postAnalyticsBD.dislikes += 1;
                        }
                        reactions = {
                            reaction: reaction,
                            user: req.user._id
                        };
                    }
                }
                // Validate If Current User Action Is A Comment
                else {
                    // Validate If Current User Has Been Commented Before
                    const isCurrentUserCommented = postAnalyticsBD.comments.reduce((comment) => {
                        return (mongoose_1.Types.ObjectId(comment.user) === mongoose_1.Types.ObjectId(req.user._id));
                    });
                    likes = postAnalyticsBD.likes;
                    dislikes = postAnalyticsBD.dislikes;
                    comments =
                        Object.keys(isCurrentUserCommented).length > 0
                            ? {
                                $push: {
                                    comments: [
                                        {
                                            comment,
                                            user: req.user._id
                                        }
                                    ]
                                }
                            }
                            : [
                                {
                                    comment,
                                    user: req.user._id
                                }
                            ];
                    reactions = postAnalyticsBD.reactions;
                }
                const updatedPostAnalytics = !isUpdating
                    ? yield postAnalyticsMdl_1.default.findOneAndUpdate({ post: idPost }, {
                        $set: {
                            comments,
                            dislikes,
                            likes,
                            post: idPost
                        },
                        $push: { reactions: reactions }
                    }, {
                        new: true
                    })
                    : yield postAnalyticsMdl_1.default.findOneAndUpdate({ post: idPost, 'reactions.user': idUser }, {
                        $set: {
                            comments,
                            dislikes,
                            likes,
                            'reactions.$': reactions,
                            post: idPost
                        }
                    }, {
                        new: true
                    });
                return res.json({
                    updatedPostAnalytics,
                    reactions,
                    ok: true
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al actualizar el articulo', ok: false });
            }
        });
    }
}
const postAnalyticsController = new PostAnalyticsController();
exports.default = postAnalyticsController;
