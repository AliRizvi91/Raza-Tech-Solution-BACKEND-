import express, { Router } from 'express';
import {
    getAllOptimizationInfos,
    getOptimizationInfo,
    addOptimizationInfo,
    updateOptimizationInfo,
    deleteOptimizationInfo
} from '../controllers/OptimizationInfoController'

const OptimizationInfoRouter: Router = express.Router();

OptimizationInfoRouter.route('/')
    .get(getAllOptimizationInfos)
    .post(addOptimizationInfo)

OptimizationInfoRouter.route('/:id')
    .get(getOptimizationInfo)
    .put(updateOptimizationInfo)
    .delete(deleteOptimizationInfo);


export default OptimizationInfoRouter;