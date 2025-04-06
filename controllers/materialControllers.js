import Material from "../models/materialModel.js";

export const createMaterial = async (req, res) => {
    try {
        const { name, moduleId } = req.body;

        const content = req.file?.filename;

        const material = new Material({
            name, content, moduleId
        });

        await material.save();

        return res.status(201).json({
            payload: material
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}


export const getMaterialByModuleId = async (req, res) => {
    try {
        const { moduleId } = req.body;

        const material = await Material.find({ moduleId });

        return res.status(200).json({
            payload: material
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}

