import express from "express";
import { createCertification, getAllCertificationsByUserId, getCertificationBySlug, getCourseCertification } from "../controllers/certificateControllers.js";


const certificateRouter = new express.Router();

certificateRouter.post("/create", createCertification);
certificateRouter.post("/get-user-certifications", getAllCertificationsByUserId);
certificateRouter.post("/get/:slug", getCertificationBySlug);
certificateRouter.post("/get-course-certification", getCourseCertification);



export default certificateRouter;