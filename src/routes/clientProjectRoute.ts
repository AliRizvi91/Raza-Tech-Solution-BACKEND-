import express, { Router } from 'express';
import {
    getAllClientProjects,
    getClientProject,
    addClientProject,
    updateClientProjectsOfArray,
    updateClientProject,
    deleteClientProject
} from '../controllers/clientProjectController'

const ClientProjectRouter: Router = express.Router();

ClientProjectRouter.route('/')
    .get(getAllClientProjects)
    .post(addClientProject)
    .put(updateClientProjectsOfArray);

ClientProjectRouter.route('/:id')
    .get(getClientProject)
    .put(updateClientProject)
    .delete(deleteClientProject);


export default ClientProjectRouter;