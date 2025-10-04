import express, { Router } from 'express';
import {
    getAllLevels,
    getLevel,
    addLevel,
    updateLevel,
    deleteLevel
} from '../controllers/LevelInfoController'

const LevelRouter: Router = express.Router();

LevelRouter.route('/')
    .get(getAllLevels)
    .post(addLevel)

LevelRouter.route('/:id')
    .get(getLevel)
    .put(updateLevel)
    .delete(deleteLevel);


export default LevelRouter;