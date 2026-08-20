import { saveSubmission } from './_util.js';
export default (req, res) => saveSubmission('newsletter', req, res, { requireFields: ['email'] });
