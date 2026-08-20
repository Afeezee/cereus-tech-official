import { saveSubmission } from './_util.js';
export default (req, res) => saveSubmission('instructor', req, res, { requireFields: ['full_name', 'email', 'phone', 'location'] });
