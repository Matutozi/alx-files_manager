import { Router } from 'express';

import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import UtilController from '../controllers/UtilController';

const router = Router();

// Middleware to check authorization for specific routes
const checkAuthorization = (paths, headerKey) => (req, res, next) => {
  if (!paths.includes(req.path)) {
    return next();
  }
  if (!req.headers[headerKey]) {
    return res.status(401).json({ error: 'Unauthorized' }).end();
  }
  next();
};

// Authorization checks
router.use(checkAuthorization(['/connect'], 'authorization'));
router.use(checkAuthorization(['/disconnect', '/users/me', '/files'], 'x-token'));

// Route definitions
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', UtilController.token, FilesController.putPublish);
router.put('/files/:id/unpublish', UtilController.token, FilesController.putUnpublish);

export default router;

