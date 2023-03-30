import { Router } from 'express';
import bodyParser from 'body-parser';

import { loginClient } from '~/controllers/client/loginClient';
import { verifyClient } from '~/controllers/client/verifyClient';
import { setSelfie } from '~/controllers/client/setSelfie';

import { authMiddleware } from '~/middlewares/authMiddleware';
import multer from '~/middlewares/uploaderMidlleware';

const clientRouter = Router();

clientRouter.use(bodyParser.json());

clientRouter.post('/login', loginClient);
clientRouter.post('/verify', verifyClient);
clientRouter.put('/selfie', authMiddleware, multer.single('file'), setSelfie);

export default clientRouter;
