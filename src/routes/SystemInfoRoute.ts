import express, { Router } from 'express';
import {
    SystemInfo
} from '../controllers/SystemInformation'

const SystemInfoRouter: Router = express.Router();

SystemInfoRouter.route('/')
    .post(SystemInfo)


export default SystemInfoRouter;