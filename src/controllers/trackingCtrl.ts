import { Request, Response } from 'express';

import Case from '../models/caseMdl';
import Volume from '../models/volumeMdl';
import Tracking from '../models/trackingMdl';
import { Types } from 'mongoose';

class TrackingController {
  public async changeTemp(req: Request, res: Response) {
    // return;
    try {
      const { idTrack } = req.params;
      let { status } = req.body;
      const tracking = await Tracking.findOneAndUpdate(
        { _id: idTrack },
        { status: status },
        {
          new: true
        }
      );

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
    } catch (err) {
      res.status(500).json({
        err,
        message: 'No se encontro el evento',
        ok: false
      });
    }
  }

  // Insert a New Row/Document Into The Trackings Collection
  public async create(req: any, res: Response) {
    // return;
    try {
      const { idVolume } = req.params;
      const trackings = await Tracking.find({ volume: idVolume });
      const volumes: any = await Volume.aggregate([
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

      const trackingN: any = new Tracking({
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
        req.body.notes.forEach((note: any) => {
          trackingN.trackingNotes.push({
            note
          });
        });
      }

      // Validate If Obtained Evidences Array Its Not Empty
      if (req.body.evidences.length > 0) {
        req.body.evidences.forEach((evidence: any) => {
          trackingN.trackingEvidences.push({
            evidence
          });
        });
      }

      // Returned Tracking Data After Have Been Creating
      const creatingTracking = await Tracking.create(trackingN);

      // Returned Tracking With Complete Data
      const tracking = await Tracking.aggregate([
        {
          $match: { _id: Types.ObjectId(creatingTracking!.toJSON()._id) }
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
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al crear el Seguimiento', ok: false });
    }
  }

  // Delete Temporary a Row/Document From The Trackings Collection
  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tracking: any = await Tracking.findOneAndDelete({
        _id: id
      });

      res.status(200).json({ tracking, ok: true });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get All Rows/Documents From Trackings Collection
  public async get(req: any, res: Response) {
    try {
      const {
        filter,
        filterOpt = 'track',
        page = 1,
        perPage = 10,
        orderField,
        orderType
      } = req.query;
      const { idVolume } = req.params;

      const options: any = {
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

      const trackings = await Tracking.paginate(query, options);

      return res.status(200).json({
        trackings,
        ok: true
      });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get All Rows/Documents From Trackings Collection With Rol Condition
  public async getByClient(req: any, res: Response) {
    // return;
    try {
      const { idCase, idClient } = req.params;

      let match =
        idCase !== 'undefined'
          ? {
              $and: [
                {
                  _id: Types.ObjectId(idCase)
                },
                {
                  assigned_client: Types.ObjectId(idClient)
                }
              ]
            }
          : {
              user: Types.ObjectId(req.user._id)
            };

      const cases: any = await Case.aggregate([
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
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Get One Row/Document From Trackings Collection
  public async getOne(req: Request, res: Response) {
    try {
      const tracking = await Tracking.findOne({ _id: req.params.id }).populate(
        'file'
      );

      res.status(200).json({ ok: true, tracking });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  // Update One or More Rows/Documents From Trackings Collection
  public async update(req: any, res: Response) {
    try {
      const { idTracking } = req.params;
      const parsedIdTracking = JSON.parse(idTracking);
      const trackingBD: any = await Tracking.findOne({
        _id: parsedIdTracking
      });

      let trackingU: any = {};

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
        req.body.notes.forEach((note: any) => {
          trackingU.trackingNotes.push({
            note
          });
        });
      }

      // Validate If Obtained Evidences Array Its Not Empty
      if (req.body.evidences.length > 0) {
        req.body.evidences.forEach((evidence: any) => {
          trackingU.trackingEvidences.push({
            evidence
          });
        });
      }

      // Returned Tracking Data After Updating
      const updatingTracking = await Tracking.findOneAndUpdate(
        { _id: parsedIdTracking },
        {
          $set: {
            message: trackingU.message,
            trackingNotes: trackingU.trackingNotes,
            trackingEvidences: trackingU.trackingEvidences,
            evidenceId: trackingU.evidenceId,
            noteId: trackingU.noteId
          }
        },
        {
          new: true
        }
      );

      // Returned Tracking With Complete Data
      const tracking = await Tracking.aggregate([
        {
          $match: { _id: Types.ObjectId(updatingTracking!.toJSON()._id) }
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
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'Error al actualizar el Evento', ok: false });
    }
  }

  public async deleteDoc(req: Request, res: Response) {
    try {
      const { id, idDoc } = req.params;
      const tracking: any = await Tracking.findOne({
        _id: id
      });

      let newDocs: any = [];

      newDocs = tracking.documents.filter((doc: any) => {
        return doc._id.toString() !== idDoc.toString();
      });

      const trackingU: any = await Tracking.findOneAndUpdate(
        {
          _id: id
        },
        {
          $set: { documents: newDocs }
        },
        {
          new: true
        }
      );

      res.status(200).json({ tracking: trackingU, ok: true });
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }

  public async getByLowyer(req: any, res: Response) {
    // return;
    try {
      const { idVolume } = req.params;
      const { volumes } = req.body;
      const cases: any = await Case.aggregate([
        {
          $match: {
            user: Types.ObjectId(req.user._id)
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
    } catch (err) {
      res.status(500).json({ err, ok: false });
    }
  }
}

const trackingController = new TrackingController();
export default trackingController;
