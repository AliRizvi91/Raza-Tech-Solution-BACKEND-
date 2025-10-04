import { Request, Response } from 'express';
import OptimizationInfoModel from '../models/OPtimizationInfoModel';
import type { IOptimizationInfo } from '../models/OPtimizationInfoModel';
import { translateData } from '../services/translations/translationCode';


//___---- Get All Optimization Infos ----___
export const getAllOptimizationInfos = async (req: Request, res: Response): Promise<Response> => {
    try {
        const lang = (req.query.lang as string) || 'en';

        const infos = await OptimizationInfoModel.find();

        // Translate only if not English
        const results = await Promise.all(infos.map(info => translateData(info, lang)));

        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to get all optimization infos" });
    }
};


//___---- Get Optimization Info by Id ----___
export const getOptimizationInfo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const lang = (req.query.lang as string) || 'en';

        const info = await OptimizationInfoModel.findById(id);

        if (!info) {
            return res.status(404).json({ message: "Optimization info not found" });
        }

        // Translate only if not English
        const result = await translateData(info, lang);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to get optimization info by ID" });
    }
};


//___---- Create Optimization Info ----___
export const addOptimizationInfo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { title, description }: IOptimizationInfo = req.body;

        const newInfo = await OptimizationInfoModel.create({
            title,
            description
        });

        res.header("location", `${req.originalUrl}/${newInfo._id}`);
        return res.status(201).json(newInfo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create optimization info" });
    }
};


//___---- Update Optimization Info ----___
export const updateOptimizationInfo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updateData: Partial<IOptimizationInfo> = req.body;

        const updatedInfo = await OptimizationInfoModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedInfo) {
            return res.status(404).json({ message: "Optimization info not found" });
        }
        return res.status(200).json(updatedInfo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update optimization info" });
    }
};


//___---- Delete Optimization Info ----___
export const deleteOptimizationInfo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deletedInfo = await OptimizationInfoModel.findByIdAndDelete(id);

        if (!deletedInfo) {
            return res.status(404).json({ message: "Optimization info not found" });
        }
        return res.status(200).json(deletedInfo);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to delete optimization info" });
    }
};
