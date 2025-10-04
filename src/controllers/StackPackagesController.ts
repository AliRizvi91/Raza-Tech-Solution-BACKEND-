import { Request, Response } from 'express';
import StackPackagesModel from '../models/StackPackagesModel';
import type { IStackPackages } from '../models/StackPackagesModel';
import { translateData } from '../services/translations/translationCode';


//___---- Get All Stack Packages ----___
export const getAllStackPackages = async (req: Request, res: Response): Promise<Response> => {
    try {
        const lang = (req.query.lang as string) || 'en';

        const packages = await StackPackagesModel.find();

        // Translate only if not English
        const results = await Promise.all(packages.map(pkg => translateData(pkg, lang)));

        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to get all stack packages" });
    }
};


//___---- Get Stack Package by Id ----___
export const getStackPackage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const lang = (req.query.lang as string) || 'en';

        const stackPackage = await StackPackagesModel.findById(id);

        if (!stackPackage) {
            return res.status(404).json({ message: "Stack package not found" });
        }

        // Translate only if not English
        const result = await translateData(stackPackage, lang);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to get stack package by ID" });
    }
};


//___---- Create Stack Package ----___
export const addStackPackage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, column1, column2, column3 }: IStackPackages = req.body;

        const newPackage = await StackPackagesModel.create({
            name,
            column1,
            column2,
            column3
        });

        res.header("location", `${req.originalUrl}/${newPackage._id}`);
        return res.status(201).json(newPackage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create stack package" });
    }
};


//___---- Update Stack Package ----___
export const updateStackPackage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updateData: Partial<IStackPackages> = req.body;

        const updatedPackage = await StackPackagesModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({ message: "Stack package not found" });
        }
        return res.status(200).json(updatedPackage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update stack package" });
    }
};


//___---- Delete Stack Package ----___
export const deleteStackPackage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deletedPackage = await StackPackagesModel.findByIdAndDelete(id);

        if (!deletedPackage) {
            return res.status(404).json({ message: "Stack package not found" });
        }
        return res.status(200).json(deletedPackage);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to delete stack package" });
    }
};
