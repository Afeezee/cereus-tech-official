import { saveSubmission } from './_util.js';
export default (req, res) => saveSubmission('student', req, res, { requireFields: ['full_name', 'email', 'phone'] });
