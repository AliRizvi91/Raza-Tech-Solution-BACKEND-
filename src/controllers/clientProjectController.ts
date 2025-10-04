import { Request, Response } from 'express';
import ClientProjectModel from '../models/clientProjectModel';
import type { IClientProject } from '../models/clientProjectModel';
import { translateData } from '../services/translations/translationCode';



//___---- Get All Client Projects ----___
export const getAllClientProjects = async (req: Request, res: Response): Promise<Response> => {
    try {
        const lang = (req.query.lang as string) || 'en';
        
        const projects = await ClientProjectModel.find();

        // Always run translation, even for English
        const results = await Promise.all(
            projects.map(b => translateData(b, lang))
        );

        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to get all client projects" });
    }
};



//___---- Get Client Project by Id ----___
export const getClientProject = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const lang = (req.query.lang as string) || 'en';

        const project = await ClientProjectModel.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Client project not found" });
        }

        // Translate only if not English
        const result = await translateData(project, lang);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to get client project by ID" });
    }
};


//___---- Create Client Project ----___
export const addClientProject = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, type, year, link }: IClientProject = req.body;

        const newProject = await ClientProjectModel.create({
            name,
            type,
            year,
            link
        });

        res.header("location", `${req.originalUrl}/${newProject._id}`);
        return res.status(201).json(newProject);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create client project" });
    }
};

//___---- Update Client Project ----___
export const updateClientProject = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updateData: Partial<IClientProject> = req.body;

        const updatedProject = await ClientProjectModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Client project not found" });
        }
        return res.status(200).json(updatedProject);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update client project" });
    }
};

//___---- Update Multiple Client Projects ----___
export const updateClientProjectsOfArray = async (req: Request, res: Response): Promise<Response> => {
    try {
        const projectIds: string[] = req.body;
        const year = new Date().getFullYear().toString();

        if (!Array.isArray(projectIds) || projectIds.length === 0) {
            return res.status(400).json({ message: "Invalid project IDs provided" });
        }

        const result = await ClientProjectModel.updateMany(
            { _id: { $in: projectIds } },
            { $set: { year } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "No client projects were updated" });
        }

        return res.status(200).json({
            message: `Successfully updated ${result.modifiedCount} client projects`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update client projects" });
    }
};

//___---- Delete Client Project ----___
export const deleteClientProject = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deletedProject = await ClientProjectModel.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ message: "Client project not found" });
        }
        return res.status(200).json(deletedProject);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to delete client project" });
    }
};
