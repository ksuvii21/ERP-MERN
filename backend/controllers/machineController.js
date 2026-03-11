const Machine = require('../models/Machine');
const factory = require('../utils/handlerFactory');

exports.getMachines = factory.getAll(Machine);
exports.createMachine = factory.createOne(Machine, ['name', 'status']);
exports.getMachine = factory.getOne(Machine);
exports.updateMachine = factory.updateOne(Machine);
exports.deleteMachine = factory.deleteOne(Machine);