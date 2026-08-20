import { saveSubmission } from './_util.js';
export default (req, res) => saveSubmission('career', req, res, { requireFields: ['name', 'email', 'role_applying_for'] });
