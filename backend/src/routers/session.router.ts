import express from 'express';
import { initateSession, fillDetails, finalize, downloadRoadmap } from '@controllers/session.controller';
import { authenticate } from "@middlewares/auth.middleware";

const router = express.Router();

// Initiate session
router.post('/initiate', authenticate, initateSession);

// Fill session details
router.post('/fill-details', authenticate, fillDetails);

// Finalize session
router.post('/finalize', authenticate, finalize);

// Download roadmap
router.get('/download-roadmap', authenticate, downloadRoadmap);

export default router;
