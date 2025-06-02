import {
    getLatestMeasurements,
    getMeasurementHistory,
    addWeightMeasurement,
    addHeightMeasurement,
    addBodyFatMeasurement
} from '@/services/userService';
import { Controller } from '@/types';
import { User } from '@shared';

/**
 * Retrieves the latest measurements for the authenticated user
 * @param req Express request object containing authenticated user details
 * @param res Express response object
 * @returns Latest measurements data if successful
 * @throws 401 if user is not authenticated
 * @throws 500 if server encounters an error
 */
export const handleGetLatestMeasurements: Controller<User.SimpleMeasurements> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return
        }

        const userId = req.user.id;
        const measurements = await getLatestMeasurements(userId);

        res.status(200).json({
            success: true,
            message: 'Latest measurements retrieved successfully',
            data: measurements
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve measurements'
        });
    }
};

/**
 * Retrieves measurement history for the authenticated user
 * @param req Express request object with optional limit query parameter
 * @param res Express response object
 * @returns Measurement history data if successful
 * @throws 401 if user is not authenticated
 * @throws 500 if server encounters an error
 */
export const handleGetMeasurementHistory: Controller<User.Measurements> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return
        }

        const userId = req.user.id;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

        const history = await getMeasurementHistory(
            userId,
            limit
        );

        res.status(200).json({
            success: true,
            message: 'Measurement history retrieved successfully',
            data: history
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve measurement history'
        });
    }
};

/**
 * Adds a new weight measurement for the authenticated user
 * @param req Express request object with weight value in body
 * @param res Express response object
 * @returns Created measurement data if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if weight value is invalid
 * @throws 500 if server encounters an error
 */
export const handleAddWeightMeasurement: Controller<User.MeasurementData> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return
        }

        const { value } = req.body;
        const userId = req.user.id;

        // Validate weight value
        if (value === undefined || typeof value !== 'number' || value <= 0) {
            res.status(400).json({
                success: false,
                error: 'Valid weight value is required'
            });
            return
        }

        const measurement = await addWeightMeasurement(userId, value);

        res.status(201).json({
            success: true,
            message: 'Weight measurement added successfully',
            data: measurement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to add weight measurement'
        });
    }
};

/**
 * Adds a new height measurement for the authenticated user
 * @param req Express request object with height value in body
 * @param res Express response object
 * @returns Created measurement data if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if height value is invalid
 * @throws 500 if server encounters an error
 */
export const handleAddHeightMeasurement: Controller<User.MeasurementData> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return
        }

        const { value } = req.body;
        const userId = req.user.id;

        // Validate height value
        if (value === undefined || typeof value !== 'number' || value <= 0) {
            res.status(400).json({
                success: false,
                error: 'Valid height value is required'
            });
            return
        }

        const measurement = await addHeightMeasurement(userId, value);
        res.status(201).json({
            success: true,
            message: 'Height measurement added successfully',
            data: measurement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to add height measurement'
        });
    }
};

/**
 * Adds a new body fat measurement for the authenticated user
 * @param req Express request object with body fat percentage value in body
 * @param res Express response object
 * @returns Created measurement data if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if body fat value is invalid
 * @throws 500 if server encounters an error
 */
export const handleAddBodyFatMeasurement: Controller<User.MeasurementData> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return
        }

        const { value } = req.body;
        const userId = req.user.id;

        // Validate body fat value
        if (value === undefined || typeof value !== 'number' || value < 0 || value > 100) {
            res.status(400).json({
                success: false,
                error: 'Valid body fat percentage (0-100) is required'
            });
            return
        }

        const measurement = await addBodyFatMeasurement(userId, value);

        res.status(201).json({
            success: true,
            message: 'Body fat measurement added successfully',
            data: measurement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Failed to add body fat measurement'
        });
    }
};