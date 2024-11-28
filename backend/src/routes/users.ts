import express from 'express';
import * as userController from '../controllers/userController';
import { auth, requireRole } from '../middleware/auth';

const router = express.Router();

// Routes protégées nécessitant le rôle Administrateur
router.use(auth);
router.use(requireRole(['Administrateur']));

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/:id/reset-password', userController.resetUserPassword);

export default router;
