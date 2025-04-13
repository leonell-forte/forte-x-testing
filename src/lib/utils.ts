import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

import { IOption } from "components/ui/dropdown";
import { StatusVariant } from "components/ui/status";

import { IBeneficiaries } from "./types/beneficiaries";
import { InvoiceStatus } from "./types/invoices";
import { EvidenceStatus, MilestoneStatus } from "./types/milestones";

export const filterBySearch = (
  list: Record<string, string>[],
  search: string
): any => {
  let filteredList: Record<string, string>[] = [];

  list.forEach((item) => {
    const isMatch = Object.values(item).some((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );

    if (isMatch) {
      filteredList.push(item);
    }
  });

  return filteredList;
};

export type IODataObject = Record<
  string,
  {
    value: string | string[];
    exact: boolean;
    isSearch?: boolean;
    isDate?: boolean;
  }
>;

export const generateODataQuery = (obj: IODataObject): string => {
  // Separate search and non-search fields
  const searchParts: string[] = [];
  const nonSearchParts: string[] = [];

  Object.keys(obj).forEach((key) => {
    const { value, exact, isSearch, isDate } = obj[key];

    // Skip if the value is empty (null, undefined, or empty string/array)
    if (
      value == null ||
      (Array.isArray(value) && value.length === 0) ||
      value === ""
    ) {
      return;
    }

    let condition: string | null = null;

    if (isDate) {
      // Handle date values
      if (typeof value === "string") {
        condition = `'${key}' ge '${value}'`;
      } else {
        console.warn(`Invalid date value for key: ${key}`);
        return;
      }
    } else if (Array.isArray(value)) {
      // Handle array values
      const formattedValues = value
        .map((v) => `'${v}'`) // Wrap each value in quotes
        .join(", "); // Join values with commas

      condition = `${key} in (${formattedValues})`;
    } else {
      // Handle single string values
      if (exact) {
        condition = `'${key}' eq '${value}'`;
      } else {
        condition = `contains('${key}', '${value}')`;
      }
    }

    // Add condition to the appropriate group
    if (isSearch) {
      searchParts.push(condition);
    } else {
      nonSearchParts.push(condition);
    }
  });

  // Combine search parts with 'or' and non-search parts with 'and'
  const searchQuery =
    searchParts.length > 0 ? `(${searchParts.join(" or ")})` : "";
  const nonSearchQuery = nonSearchParts.join(" and ");

  // Combine both groups with 'and' if both exist
  if (searchQuery && nonSearchQuery) {
    return `${searchQuery} and ${nonSearchQuery}`;
  }

  // Return the appropriate query part
  return searchQuery || nonSearchQuery || "";
};

export const formatDate = (date: string | Date, dateFormat?: string) => {
  const parsedDate = new Date(date);

  if (!date || isNaN(parsedDate.getTime())) {
    // Return an empty string if the date is invalid
    return "-";
  }
  return format(parsedDate, dateFormat || "dd MMMM yyy");
};

export const findLabelFromOptions = (
  options: IOption[],

  value: string
) => {
  const label = options.find(
    (item) => item.value?.toString() === value?.toString()
  )?.label;

  return label;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatErrorMessage(input: string) {
  // Remove leading and trailing quotes if present
  if (!input) return "";

  const unescapedInput = input.replace(/^"|"$/g, "");

  // Split the string into parts using unescaped quotes
  const parts = unescapedInput.split('"');
  if (parts.length < 2) return input; // Return original input if not formatted as expected

  let quotedWord = parts[0]; // Extract the quoted word
  let rest = parts[1]; // Extract the rest of the sentence

  // Separate PascalCase words with spaces
  quotedWord = quotedWord.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Capitalize the quoted word and the rest of the sentence
  const capitalizedQuotedWord = `${quotedWord.charAt(0).toUpperCase()}${quotedWord.slice(1).toLowerCase()}`;
  const capitalizedRest = rest.charAt(0).toUpperCase() + rest.slice(1);

  return `${capitalizedQuotedWord} ${capitalizedRest}`;
}

export function removeFirstTwoAndEquals(input: string) {
  // Ensure input is a string before processing
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }
  // Remove the first two characters and the '=' sign
  return input.slice(2).replace("=", "");
}

export const formatInvitationCode = (input: string) => {
  if (input.startsWith("3D")) {
    input = input.slice(2); // Remove "3D" from the beginning
  }
  return input.replace(/[ =]/g, ""); // Remove spaces and "="
};

export function separateCamelCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export const sortOptions = (options: IOption[]) => {
  return options.sort((a, b) => a.label.localeCompare(b.label));
};

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}
export function parseNumber<T>(
  str: string | number,
  defaultValue?: T
): T | string | number | undefined {
  const v = parseFloat(`${str}`.replace(/,/g, ""));
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(v)) return typeof defaultValue !== "boolean" ? defaultValue : str;
  return v;
}

export const formatNumber = (v: number | string, decimal = 2) => {
  try {
    const n = parseNumber(v) as number;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(n)) return v;
    return n.toLocaleString(undefined, {
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    });
  } catch (err) {
    console.error(err);
    return v;
  }
};

export const getStatusVariant = (
  status:
    | InvoiceStatus
    | MilestoneStatus
    | EvidenceStatus
    | IBeneficiaries["status"]
): StatusVariant => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "neutral";
    case "pending":
      return "warning";
    case "cancelled":
      return "danger";
    case "achieved":
      return "warning";
    case "open":
      return "primary";
    case "approved":
      return "success";
    case "pending Review":
      return "warning";
    case "more information requested":
      return "warning";
    case "invoiced":
      return "success";
    case "rejected":
      return "danger";
    case "draft":
      return "warning";
    case "settled":
      return "neutral";
    default:
      return "primary";
  }
};

export const shouldHref = (href: string, current: string) => {
  if (href === current) return undefined;
  return href;
};
