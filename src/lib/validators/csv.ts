 import { format, isValid, parse } from "date-fns";
import { isPhoneValid } from "lib/isPhoneValid";

export const selectOptions: { [key: string]: string[] } = {
    "disability status": ["Yes", "No"],
    gender: ["Male", "Female", "Non-binary", "Other"],
    "highest education level": [
      "Less than High School",
      "High School Graduate",
      "Some College",
      "Bachelor’s Degree",
      "Postgraduate Degree",
    ],
    "risk level": ["Low", "Medium", "High"],
  };

 
export const validateEmail = (email: string): boolean => {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
const phoneRegex = /^\+?[\d\s-]{10,}$/;
return phoneRegex.test(phone);
};

export const validateDate = (date: string): boolean => {
const dateObj = parse(date, "yyyy-MM-dd", new Date());
return isValid(dateObj);
};

const nonEmptyColumns = ["first name", "last name", "contract id", "email"];

export const validateField = (value: string, columnName: string): string | null => {

  columnName = columnName.toLowerCase();

  if (nonEmptyColumns.includes(columnName) && (!value || value.trim() === "")) {
    return "This field cannot be empty.";
  }

  if (["start date", "end date", "date of birth"].includes(columnName)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) && value.toLowerCase() !== "") {
      return "Date must be in yyyy-MM-dd format.";
    }
  }

  if (columnName === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.toLowerCase() !== "") {
      return "Invalid email format.";
    }
  }

  if (columnName === "phone number") {
    if (!isPhoneValid(value) && value.toLowerCase() !== "") {
      return "Phone number is invalid.";
    }
  }

  if (columnName === "gender") {
    const allowedGenders = selectOptions.gender;
    if (!allowedGenders.includes(value) && value.toLowerCase() !== "") {
      return "Gender must be one of: Male, Female, Non-binary, Other.";
    }
  }


  if (columnName === "highest education level") {
    const allowedLevels = selectOptions["highest education level"];
    if (!allowedLevels.includes(value) && value.toLowerCase() !== "") {
      return "Invalid education level.";
    }
  }

  if (columnName === "risk level") {
    const allowedRiskLevels = selectOptions["risk level"];
    if (!allowedRiskLevels.includes(value) && value.toLowerCase() !== "") {
      return "Invalid risk level.";
    }
  }

  if (columnName === "disability status") {
    const allowedDisabilityStatus = selectOptions["disability status"];
    if (!allowedDisabilityStatus.includes(value) && value.toLowerCase() !== "") {
      return "Disability status must be one of: Yes, No.";
    }
  }

  return null;
};

export function excelDateToFormattedDate(excelDate: number | string): string | null {
  if (typeof excelDate !== 'number' || isNaN(excelDate)) {
    return "";
  }

 
  if (excelDate < 1 || excelDate > 2958465) {
    return "";
  }

  try {
    const daysFromEpoch = excelDate - 25569;
    const milliseconds = daysFromEpoch * 24 * 60 * 60 * 1000;
    const jsDate = new Date(milliseconds);

    if (isNaN(jsDate.getTime())) {
      return "";
    }

    return format(jsDate, "yyyy-MM-dd");
  } catch (error) {
    return "";
  }
}