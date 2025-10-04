import { Request, Response } from 'express';
import LevelInfoModel from '../models/LevelInfoModel';
import type { ILevelInfo } from '../models/LevelInfoModel';
import { translateData } from '../services/translations/translationCode';


//___---- Get All Levels ----___
export const getAllLevels = async (req: Request, res: Response): Promise<Response> => {
    try {
        const lang = (req.query.lang as string) || 'en';

        const levels = await LevelInfoModel.find();

        // Translate only if not English
        const results = await Promise.all(levels.map(level => translateData(level, lang)));

        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to get all levels" });
    }
};


//___---- Get Level by Id ----___
export const getLevel = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const lang = (req.query.lang as string) || 'en';

        const level = await LevelInfoModel.findById(id);

        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }

        // Translate only if not English
        const result = await translateData(level, lang);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to get level by ID" });
    }
};


//___---- Create Level ----___
export const addLevel = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, description,Pages, functionalities }: ILevelInfo = req.body;

        const newLevel = await LevelInfoModel.create({
            name,
            description,
            Pages,
            functionalities
        });

        res.header("location", `${req.originalUrl}/${newLevel._id}`);
        return res.status(201).json(newLevel);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create level" });
    }
};


//___---- Update Level ----___
export const updateLevel = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updateData: Partial<ILevelInfo> = req.body;

        const updatedLevel = await LevelInfoModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedLevel) {
            return res.status(404).json({ message: "Level not found" });
        }
        return res.status(200).json(updatedLevel);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update level" });
    }
};


//___---- Delete Level ----___
export const deleteLevel = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deletedLevel = await LevelInfoModel.findByIdAndDelete(id);

        if (!deletedLevel) {
            return res.status(404).json({ message: "Level not found" });
        }
        return res.status(200).json(deletedLevel);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to delete level" });
    }
};
                             