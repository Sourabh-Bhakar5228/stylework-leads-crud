import mongoose, { Document, Schema } from 'mongoose';
import { ILead, LEAD_STATUSES, LeadStatus } from '../types/lead.types';

export interface ILeadDocument extends Omit<ILead, '_id'>, Document {}

const LeadSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ],
      index: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [5, 'Phone number must be at least 5 characters'],
      maxlength: [25, 'Phone number cannot exceed 25 characters']
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: LEAD_STATUSES,
        message: '{VALUE} is not a supported lead status'
      },
      default: 'New',
      index: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound index for optimal search performance
LeadSchema.index({ name: 'text', email: 'text', phone: 'text' });
LeadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model<ILeadDocument>('Lead', LeadSchema);
