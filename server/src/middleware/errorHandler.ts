import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Unhandled Error:', err);

  // Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid ID format: ${err.value}`
    });
    return;
  }

  // Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    const errorDetails = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message
    }));
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorDetails
    });
    return;
  }

  // MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(409).json({
      success: false,
      message: `A lead with this ${field} already exists`
    });
    return;
  }

  // Default server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
}
