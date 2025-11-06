// src/form/schemas/laptopDetailsSchema.ts
import { z } from 'zod';

const numericString = z
  .string()
  .min(1, 'Please enter a valid numeric value')
  .refine((value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed);
  }, 'Please enter a valid numeric value');

const requiredString = z.string().min(1, 'This field is required').max(200, 'Value is too long');

export const laptopDetailsSchema = z.object({
  serialNumber: z.string().min(1, 'Please enter Serial Number'),
  dealer: requiredString,
  brand: z.string().min(1, 'Please enter Brand'),
  model: z.string().min(1, 'Please enter Model'),
  price: numericString,
  warrantyInYear: z.number().int().min(0).max(10),
  processor: requiredString,
  processorBrand: requiredString,
  ram: requiredString,
  storage: requiredString,
  colour: requiredString,
  screenSize: requiredString,
  memoryType: requiredString,
  battery: requiredString,
  batteryLife: requiredString,
  graphicsCard: requiredString,
  graphicBrand: requiredString,
  weight: requiredString,
  manufacturer: requiredString,
  usbPorts: z
    .string()
    .min(1, 'Please enter number of USB ports')
    .refine((value) => {
      return /^\d+$/.test(value.trim());
    }, 'Please enter a numeric value'),
});

export type LaptopDetailsFormValues = z.infer<typeof laptopDetailsSchema>;

export const getDefaultLaptopDetailsValues = (): LaptopDetailsFormValues => ({
  serialNumber: '',
  dealer: '',
  brand: '',
  model: '',
  price: '',
  warrantyInYear: 0,
  processor: '',
  processorBrand: '',
  ram: '',
  storage: '',
  colour: '',
  screenSize: '',
  memoryType: '',
  battery: '',
  batteryLife: '',
  graphicsCard: '',
  graphicBrand: '',
  weight: '',
  manufacturer: '',
  usbPorts: '',
});