import { DateTime } from "luxon";

import schedule from "node-schedule";

import LiveLink from "../models/liveLinkModel.js";
import Module from "../models/moduleModel.js";
import transporter from "../utils/nodemailerTransporter.js";


export const createLiveLink = async (req, res) => {
    try {
        const { name, startsAt, endsAt, link, timezone, moduleId } = req.body;

        await LiveLink.findOneAndDelete({ moduleId });

        // Convert incoming datetime strings to actual Date objects in the selected timezone
        const start = DateTime.fromISO(startsAt, { zone: timezone });
        const end = DateTime.fromISO(endsAt, { zone: timezone });

        if (!start.isValid || !end.isValid) {
            return res.status(400).json({ message: "Invalid dates or timezone" });
        }

        // Convert to JS Date for MongoDB
        const startDate = start.toJSDate();
        const endDate = end.toJSDate();

        // * Get the selected module and deeply populate class/course and their enrolled students and only fetch email
        const selectedModule = await Module.findById(moduleId)
            .populate({
                path: "classId",
                populate: {
                    path: "enrolledUsers",
                    select: "email",
                }
            })
            .populate({
                path: "courseId",
                populate: {
                    path: "enrolledUsers",
                    select: "email",
                }
            });

        // Get emails of enrolled students
        const enrolledUsers = selectedModule.classId?.enrolledUsers || selectedModule.courseId?.enrolledUsers || [];
        const selectedModuleName = selectedModule.classId?.title || selectedModule.courseId?.title || "Your class";
        const selectedModuleType = selectedModule.classId ? "class" : "course";
        const studentEmails = enrolledUsers.map(user => user.email);

        // Email content builder
        const buildEmailTemplate = (time) => `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333;">Upcoming Live Session Reminder</h2>
                <p style="font-size: 16px; color: #555;">
                    Hello, <br><br>
                    This is a friendly reminder that you have an upcoming <strong>live session</strong> for the <strong>${selectedModuleType}</strong> "<strong>${selectedModuleName}</strong>".
                </p>
                <p><strong>Starts at:</strong> ${start.setZone(timezone).toFormat("fff")}</p>
                <p style="margin-top: 20px;">This reminder was sent ${time} before the session.</p>
                <p style="font-size: 14px; color: #777;">Best regards, <br>Future Insights Team</p>
            </div>
        `;

        // Schedule reminder 1 day before
        const oneDayBefore = start.minus({ days: 1 }).toJSDate();
        if (oneDayBefore > new Date()) {
            schedule.scheduleJob(oneDayBefore, async () => {
                for (const email of studentEmails) {
                    await transporter.sendMail({
                        from: process.env.SENDER_EMAIL,
                        to: email,
                        subject: `Reminder: Live session for ${selectedModuleName} in 1 day`,
                        html: buildEmailTemplate("1 day"),
                    });
                }
            });
        }

        // Schedule reminder 1 hour before
        const oneHourBefore = start.minus({ hours: 1 }).toJSDate();
        if (oneHourBefore > new Date()) {
            schedule.scheduleJob(oneHourBefore, async () => {
                for (const email of studentEmails) {
                    await transporter.sendMail({
                        from: process.env.SENDER_EMAIL,
                        to: email,
                        subject: `Reminder: Live session for ${selectedModuleName} in 1 hour`,
                        html: buildEmailTemplate("1 hour"),
                    });
                }
            });
        }


        // Create Live Link
        const liveLink = new LiveLink({
            name,
            startsAt: startDate,
            endsAt: endDate,
            link,
            timezone,
            moduleId
        });
        await liveLink.save();

        return res.status(201).json({
            payload: liveLink
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}


export const getLinksByModuleId = async (req, res) => {
    try {
        const { moduleId } = req.body;

        const liveLink = await LiveLink.findOne({ moduleId });

        return res.status(200).json({
            payload: liveLink
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}


export const deleteLiveLink = async (req, res) => {
    try {
        const { moduleId } = req.params;

        await LiveLink.findOneAndDelete({ moduleId });

        return res.status(200).json({
            message: `deleted live link for module: ${moduleId}`
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}


