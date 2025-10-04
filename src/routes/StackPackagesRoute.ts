import express, { Router } from 'express';
import {
    getAllStackPackages,
    getStackPackage,
    addStackPackage,
    updateStackPackage,
    deleteStackPackage
} from '../controllers/StackPackagesController'

const StackPackageRouter: Router = express.Router();

StackPackageRouter.route('/')
    .get(getAllStackPackages)
    .post(addStackPackage)

StackPackageRouter.route('/:id')
    .get(getStackPackage)
    .put(updateStackPackage)
    .delete(deleteStackPackage);


export default StackPackageRouter;