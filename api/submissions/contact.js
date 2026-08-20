import { saveSubmission } from './_util.js';
export default (req, res) => saveSubmission('contact', req, res, { requireFields: ['name', 'email', 'message'] });
