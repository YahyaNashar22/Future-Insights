import express from 'express';
import { assignUsersToCohort, createCohort, deleteCohort, editCohort, getCohortById, getCohorts } from '../controllers/cohortController.js';

const cohortRouter = new express.Router();

cohortRouter.post('/create', createCohort);
cohortRouter.patch('/edit/:id', editCohort);
cohortRouter.patch('/assign-users/:id', assignUsersToCohort);
cohortRouter.delete('/delete/:id', deleteCohort);
cohortRouter.get('/cohort/:id', getCohortById);
cohortRouter.get('/class-cohorts/:classId', getCohorts);


export default cohortRouter;