import express from "express";
import bodyParser from 'body-parser';

import { certificationWebhook, createCertification, getAllCertificationsByUserId, getCertificationBySlug, getClassCertification, getCourseCertification } from "../controllers/certificateControllers.js";


const rawBodySaver = (req, res, buf) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString('utf8');
    }
};

const certificateRouter = new express.Router();

certificateRouter.post("/create", createCertification);
certificateRouter.post("/get-user-certifications", getAllCertificationsByUserId);
certificateRouter.get("/get/:slug", getCertificationBySlug);
certificateRouter.post("/get-course-certification", getCourseCertification);
certificateRouter.post("/get-class-certification", getClassCertification);
certificateRouter.post("/webhook", bodyParser.json({ verify: rawBodySaver }),
    certificationWebhook);





export default certificateRouter;