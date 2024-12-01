import { format } from "date-fns";

export const filterBySearch = (
  list: Record<string, string>[],
  search: string,
): any => {
  let filteredList: Record<string, string>[] = [];

  list.forEach((item) => {
    const isMatch = Object.values(item).some((item) =>
      item.toLowerCase().includes(search.toLowerCase()),
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

export const formatDate = (date: string | Date, dateFormat: string) => {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    // Return an empty string if the date is invalid
    return "";
  }
  return format(parsedDate, dateFormat);
};
