import LiveLink from "../models/liveLinkModel.js";


export const createLiveLink = async (req, res) => {
    try {
        const { name, startsAt, endsAt, link, moduleId } = req.body;

        await LiveLink.findOneAndDelete({ moduleId });

        const liveLink = new LiveLink({
            name, startsAt, endsAt, link, moduleId
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

