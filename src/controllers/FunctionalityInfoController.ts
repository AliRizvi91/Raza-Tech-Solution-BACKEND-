import { Request, Response } from 'express';
import FunctionalityInfoModel from '../models/FunctionalityInfoModel';
import type { IFunctionalityInfo } from '../models/FunctionalityInfoModel';
import { translateData } from '../services/translations/translationCode';
import { uploadOnCloudinary } from '../services/cloudinary/cloudinary';


//___---- Get All Functionalities ----___
export const getAllFunctionalities = async (req: Request, res: Response): Promise<Response> => {
    try {
        const lang = (req.query.lang as string) || 'en';

        const functionalities = await FunctionalityInfoModel.find();

        // Translate only if not English
        const results = await Promise.all(functionalities.map(fn => translateData(fn, lang)));

        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to get all functionalities" });
    }
};


//___---- Get Functionality by Id ----___
export const getFunctionality = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const lang = (req.query.lang as string) || 'en';

        const functionality = await FunctionalityInfoModel.findById(id);

        if (!functionality) {
            return res.status(404).json({ message: "Functionality not found" });
        }

        // Translate only if not English
        const result = await translateData(functionality, lang);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to get functionality by ID" });
    }
};


//___---- Create Functionality ----___
export const addFunctionality = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { title, description, icon }: IFunctionalityInfo = req.body;
        const imageLocalPath = req.file?.path;

        let imageUrl; // Default image

        // Upload image to Cloudinary if exists
        if (imageLocalPath) {
            const uploadedImage = await uploadOnCloudinary(imageLocalPath);
            if (uploadedImage) {
                imageUrl = uploadedImage;
            }
        }


        const newFunctionality = await FunctionalityInfoModel.create({
            title,
            description,
            icon: imageUrl
        });

        res.header("location", `${req.originalUrl}/${newFunctionality._id}`);
        return res.status(201).json(newFunctionality);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create functionality" });
    }
};


//___---- Update Functionality ----___
export const updateFunctionality = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updateData: Partial<IFunctionalityInfo> = req.body;

        const updatedFunctionality = await FunctionalityInfoModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedFunctionality) {
            return res.status(404).json({ message: "Functionality not found" });
        }
        return res.status(200).json(updatedFunctionality);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update functionality" });
    }
};


//___---- Delete Functionality ----___
export const deleteFunctionality = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deletedFunctionality = await FunctionalityInfoModel.findByIdAndDelete(id);

        if (!deletedFunctionality) {
            return res.status(404).json({ message: "Functionality not found" });
        }
        return res.status(200).json(deletedFunctionality);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to delete functionality" });
    }
};
