const asyncHandler = require('express-async-handler');

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findOneAndDelete({
      _id: req.params.id,
      company: req.company._id,
    });

    if (!doc) {
      res.status(404);
      throw new Error(`${Model.modelName} not found or not part of your company`);
    }

    res.status(200).json({ id: req.params.id });
  });

exports.createOne = (Model, requiredFields = []) =>
  asyncHandler(async (req, res, next) => {
    for (const field of requiredFields) {
      if (!req.body[field]) {
        res.status(400);
        throw new Error(`Please provide the required field: ${field}`);
      }
    }

    const doc = await Model.create({
      ...req.body,
      company: req.company._id,
    });

    res.status(201).json(doc);
  });

exports.getAll = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.find({ company: req.company._id });

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const docs = await query.sort({ createdAt: -1 });

    res.status(200).json(docs);
  });