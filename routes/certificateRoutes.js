import express from "express";
import bodyParser from 'body-parser';

import { certificationWebhook, createCertification, getAllCertificationsByUserId, getCertificationBySlug, getClassCertification, getCourseCertification } from "../controllers/certificateControllers.js";



const certificateRouter = new express.Router();

// ✅ This collects raw body for signature verification
// const rawBodySaver = (req, res, buf) => {
//     if (buf && buf.length) {
//         req.rawBody = buf.toString('utf8');
//     }
// };

// ✅ Webhook needs raw body, apply middleware only here
// certificateRouter.post("/webhook", bodyParser.json({ verify: rawBodySaver }), certificationWebhook);

// Regular routes can use standard JSON parsing
// certificateRouter.use(bodyParser.json());

certificateRouter.post("/create", createCertification);
certificateRouter.post("/get-user-certifications", getAllCertificationsByUserId);
certificateRouter.get("/get/:slug", getCertificationBySlug);
certificateRouter.post("/get-course-certification", getCourseCertification);
certificateRouter.post("/get-class-certification", getClassCertification);





export default certificateRouter;