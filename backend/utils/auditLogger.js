const AuditLog = require('../models/AuditLog');

/**
 * Creates an audit log entry. This is a fire-and-forget operation.
 * @param {object} logData - The data for the audit log.
 * @param {string} logData.userId - The ID of the user performing the action.
 * @param {string} logData.userName - The name of the user.
 * @param {string} logData.action - The action being performed (e.g., 'CREATE_PATIENT').
 * @param {string} logData.entityId - The ID of the entity being acted upon.
 * @param {string} logData.companyId - The ID of the company.
 */
const logAction = async (logData) => {
  try {
    await AuditLog.create({ ...logData, entity: 'Patient' });
  } catch (error) {
    console.error('Failed to write to audit log:', error);
  }
};

module.exports = logAction;