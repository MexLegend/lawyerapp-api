import { Request, Response } from 'express';
import PostAnalytics from '../models/postAnalyticsMdl';
import { Types } from 'mongoose';

class PostAnalyticsController {
  // Get All Rows/Documents From PostAnalytics Collection
  public async get(req: Request, res: Response) {
    try {
      const postAnalytics = await PostAnalytics.find()
        .populate('comments.user')
        .populate('reactions.user');

      res.status(200).json({ ok: true, postAnalytics });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From PostAnalytics Collection
  public async getOne(req: Request, res: Response) {
    try {
      const { idArray } = req.params;
      let idPost: string;
      let idUser: string;
      let isUserLoggedIn: boolean = false;
      let currentUserAnalyticsReaction: any = null;

      if (idArray.includes('-')) {
        isUserLoggedIn = true;
        idPost = idArray.split('-')[0].toString();
        idUser = idArray.split('-')[1].toString();
      } else {
        isUserLoggedIn = false;
        idPost = idArray;
      }

      const postAnalytics: any = await PostAnalytics.findOne({
        post: idPost
      })
        .populate('comments.user')
        .populate('reactions.user');

      if (isUserLoggedIn) {
        currentUserAnalyticsReaction = postAnalytics.reactions
          .filter(
            (reactionItem: any) => reactionItem.user._id.toString() === idUser
          )
          .map((reactionItemObtained: any) => reactionItemObtained.reaction)
          .toString();
      }

      res
        .status(200)
        .json({ ok: true, postAnalytics, currentUserAnalyticsReaction });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Publish New Comment Into PostAnalytics Collection
  public async postComment(req: Request, res: Response) {
    try {
      const { idPost } = req.params;
      const { comment, user } = req.body;

      const postComment: any = await PostAnalytics.findOneAndUpdate(
        { post: idPost },
        {
          $push: {
            comments: {
              comment,
              user
            }
          }
        },
        { new: true }
      )
        .populate('comments.user')
        .populate('reactions.user');

      res.status(200).json({ ok: true, postComment });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Update One or More Rows/Documents From PostAnalytics Collection
  public async update(req: any, res: Response) {
    try {
      const { idPost } = req.params;
      const idUser = req.user._id;
      const { reaction, comment } = req.body;
      let reactions, comments, likes, dislikes: any;
      let isUpdating: boolean = false;

      const postAnalyticsBD: any = await PostAnalytics.findOne({
        post: idPost
      });

      // Validate If Current User Action Is A Reaction
      if (reaction !== null) {
        // Validate If There Are Reactions
        if (postAnalyticsBD.reactions.length > 0) {
          const isCurrentUserReacted = postAnalyticsBD.reactions.filter(
            (reactionItem: any) => {
              return reactionItem.user.toString() === idUser.toString();
            }
          );

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
              } else {
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
                } else {
                  (likes = postAnalyticsBD.likes),
                    (dislikes = postAnalyticsBD.dislikes += 1);
                }
              } else {
                if (reaction === 'like') {
                  (likes = postAnalyticsBD.likes += 1),
                    (dislikes =
                      postAnalyticsBD.dislikes === 0
                        ? 0
                        : (postAnalyticsBD.dislikes -= 1));
                } else {
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
            } else {
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
          } else {
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
        const isCurrentUserCommented = postAnalyticsBD.comments.reduce(
          (comment: any) => {
            return (
              Types.ObjectId(comment.user) === Types.ObjectId(req.user._id)
            );
          }
        );
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

      const updatedPostAnalytics: any = !isUpdating
        ? await PostAnalytics.findOneAndUpdate(
            { post: idPost },
            {
              $set: {
                comments,
                dislikes,
                likes,
                post: idPost
              },
              $push: { reactions: reactions }
            },
            {
              new: true
            }
          )
            .populate('comments.user')
            .populate('reactions.user')
        : await PostAnalytics.findOneAndUpdate(
            { post: idPost, 'reactions.user': idUser },
            {
              $set: {
                comments,
                dislikes,
                likes,
                'reactions.$': reactions,
                post: idPost
              }
            },
            {
              new: true
            }
          )
            .populate('comments.user')
            .populate('reactions.user');

      return res.json({
        updatedPostAnalytics,
        reactions,
        ok: true
      });
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar el articulo', ok: false });
    }
  }
}

const postAnalyticsController = new PostAnalyticsController();
export default postAnalyticsController;
