import { type ClassValue, clsx } from "clsx";
import { PhoneNumberUtil } from "google-libphonenumber";
import { twMerge } from "tailwind-merge";

const phoneUtil = PhoneNumberUtil.getInstance();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isPhoneValid = (phone: string) => {
  if (!phone) return false;
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    console.error(error);
    return false;
  }
};
