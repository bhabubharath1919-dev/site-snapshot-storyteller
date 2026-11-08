import { z } from "zod";
import { NB_SIZES, PRESSURE_CLASSES, BODY_MATERIALS, END_CONNECTIONS } from "./specs";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const PRODUCT_TYPE_OPTIONS = [
  "Rotor / Rotary",
  "Flapper",
  "Plain / Full View",
  "Drip Tube",
] as const;

export const rfqSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  company: z.string().trim().min(2, "Enter your company name").max(150),
  email: z.string().trim().email("Enter a valid business email").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a phone number")
    .max(30)
    .regex(/^[+()\-\s\d]+$/, "Use digits, spaces, +, - or ( )"),
  productType: z.enum(PRODUCT_TYPE_OPTIONS, { errorMap: () => ({ message: "Select a product type" }) }),
  nbSize: z
    .string()
    .refine((v) => NB_SIZES.map(String).includes(v), { message: "Select an NB size" }),
  pressureClass: z.enum(PRESSURE_CLASSES, { errorMap: () => ({ message: "Select a pressure class" }) }),
  bodyMaterial: z.enum(BODY_MATERIALS, { errorMap: () => ({ message: "Select a body material" }) }),
  endConnection: z.enum(END_CONNECTIONS, { errorMap: () => ({ message: "Select an end connection" }) }),
  fluid: z.string().trim().min(2, "Describe the fluid / media").max(200),
  operatingPressure: z.string().trim().max(60).optional().or(z.literal("")),
  operatingTemperature: z.string().trim().max(60).optional().or(z.literal("")),
  quantity: z.coerce.number({ invalid_type_error: "Enter a quantity" }).int().min(1, "Minimum 1").max(100000),
  deliveryLocation: z.string().trim().min(2, "Enter the delivery location").max(200),
  requirements: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type RfqValues = z.infer<typeof rfqSchema>;

export function validateAttachment(file: File | null | undefined): string | null {
  if (!file) return null;
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Upload a PDF file";
  }
  if (file.size > MAX_UPLOAD_BYTES) return "PDF must be 10 MB or smaller";
  return null;
}

export type RfqSubmission = RfqValues & {
  configuration?: Record<string, string>;
  attachmentName?: string;
};

export type RfqResult = { reference: string; delivered: false };

/**
 * Submission boundary. Today this prepares the request locally and returns a reference —
 * nothing is transmitted. Swap the body for a server function / email integration later
 * without touching the form.
 */
export async function submitRfq(payload: RfqSubmission): Promise<RfqResult> {
  const reference = `SFI-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  void payload;
  return { reference, delivered: false };
}
