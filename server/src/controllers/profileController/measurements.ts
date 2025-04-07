import { Request, Response } from 'express';
import {
    getLatestMeasurements,
    getMeasurementHistory,
    addWeightMeasurement,
    addHeightMeasurement,
    addBodyFatMeasurement
} from '../../services/profileService';

// Get latest measurements
export const getLatestMeasurementData = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const measurements = await getLatestMeasurements(userId);

        res.json({
            message: 'Latest measurements retrieved successfully',
            measurements
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve measurements' });
    }
};

// Get measurement history for a specific type
export const getMeasurementHistoryData = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { type } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

        // Validate measurement type
        if (!['weight', 'height', 'bodyFat'].includes(type)) {
            res.status(400).json({ error: 'Invalid measurement type' });
            return
        }

        const history = await getMeasurementHistory(
            userId,
            type as 'weight' | 'height' | 'bodyFat',
            limit
        );

        res.json({
            message: `${type} measurement history retrieved successfully`,
            history
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve measurement history' });
    }
};

// Add a weight measurement
export const addWeight = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { value, date } = req.body;

        // Validate weight value
        if (value === undefined || typeof value !== 'number' || value <= 0) {
            res.status(400).json({ error: 'Valid weight value is required' });
            return
        }

        // Parse date if provided
        let measurementDate: Date | undefined = undefined;
        if (date) {
            measurementDate = new Date(date);
            if (isNaN(measurementDate.getTime())) {
                res.status(400).json({ error: 'Invalid date format' });
                return
            }
        }

        const measurement = await addWeightMeasurement(userId, value, measurementDate);

        res.status(201).json({
            message: 'Weight measurement added successfully',
            measurement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add weight measurement' });
    }
};

// Add a height measurement
export const addHeight = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { value, date } = req.body;

        // Validate height value
        if (value === undefined || typeof value !== 'number' || value <= 0) {
            res.status(400).json({ error: 'Valid height value is required' });
            return
        }

        // Parse date if provided
        let measurementDate: Date | undefined = undefined;
        if (date) {
            measurementDate = new Date(date);
            if (isNaN(measurementDate.getTime())) {
                res.status(400).json({ error: 'Invalid date format' });
                return
            }
        }

        const measurement = await addHeightMeasurement(userId, value, measurementDate);

        res.status(201).json({
            message: 'Height measurement added successfully',
            measurement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add height measurement' });
    }
};

// Add a body fat measurement
export const addBodyFat = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { value, date } = req.body;

        // Validate body fat value
        if (value === undefined || typeof value !== 'number' || value < 0 || value > 100) {
            res.status(400).json({ error: 'Body fat must be between 0 and 100' });
            return
        }

        // Parse date if provided
        let measurementDate: Date | undefined = undefined;
        if (date) {
            measurementDate = new Date(date);
            if (isNaN(measurementDate.getTime())) {
                res.status(400).json({ error: 'Invalid date format' });
                return
            }
        }

        const measurement = await addBodyFatMeasurement(userId, value, measurementDate);

        res.status(201).json({
            message: 'Body fat measurement added successfully',
            measurement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add body fat measurement' });
    }
};