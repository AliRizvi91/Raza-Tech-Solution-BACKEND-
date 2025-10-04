import express, { Router } from 'express';
import {
    getAllFunctionalities,
    getFunctionality,
    addFunctionality,
    updateFunctionality,
    deleteFunctionality
} from '../controllers/FunctionalityInfoController'
import { upload } from '../middlewares/multerMddleware';

const FunctionalityRouter: Router = express.Router();

FunctionalityRouter.route('/')
    .get(getAllFunctionalities)
    .post(upload.single('icon'), addFunctionality)

FunctionalityRouter.route('/:id')
    .get(getFunctionality)
    .put(updateFunctionality)
    .delete(deleteFunctionality);


export default FunctionalityRouter;