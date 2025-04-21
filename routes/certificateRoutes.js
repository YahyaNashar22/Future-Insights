import express from "express";
import { createCertification, getAllCertificationsByUserId, getCertificationBySlug, getClassCertification, getCourseCertification } from "../controllers/certificateControllers.js";


const certificateRouter = new express.Router();

certificateRouter.post("/create", createCertification);
certificateRouter.post("/get-user-certifications", getAllCertificationsByUserId);
certificateRouter.get("/get/:slug", getCertificationBySlug);
certificateRouter.post("/get-course-certification", getCourseCertification);
certificateRouter.post("/get-class-certification", getClassCertification);




export default certificateRouter;