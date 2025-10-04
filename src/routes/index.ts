import { Router } from 'express';
import SystemInfoRoutes from './SystemInfoRoute'; 
import LevelInfoRoutes from './LevelInfoRoute'; 
import FunctionalityInfoRoutes from './FunctionalityInfoRoute';
import StackPackagesRoutes from './StackPackagesRoute';
import ClientProjectRoutes from './clientProjectRoute';
import OptimizationinfoRoutes from './OptimizationinfoRoute';
import userRoutes from './userRoutes';

const router = Router();

router.use('/api/RTS/systemInfo', SystemInfoRoutes);
router.use('/api/RTS/level', LevelInfoRoutes);
router.use('/api/RTS/functionality', FunctionalityInfoRoutes);
router.use('/api/RTS/stackPackages', StackPackagesRoutes);
router.use('/api/RTS/optimizationinfo', OptimizationinfoRoutes);
router.use('/api/RTS/clientProject', ClientProjectRoutes);
router.use('/api/RTS/user', userRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Root route
router.get('/', (_req, res) => {
  res.json({ 
    message: "Welcome to Raza Tech Solution API",
    status: 'operational'
  });
});

export default router;