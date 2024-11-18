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
  { value: string | string[]; exact: boolean }
>;

export const generateODataQuery = (obj: IODataObject): string => {
  const queryParts = Object.keys(obj)
    .map((key) => {
      const { value, exact } = obj[key];

      // Skip this key if the value is empty (null, undefined, or empty string/array)
      if (
        value == null ||
        (Array.isArray(value) && value.length === 0) ||
        value === ""
      ) {
        return null;
      }

      // Handle array values
      if (Array.isArray(value)) {
        if (exact) {
          // Generate 'or' conditions for exact matching
          return value.map((v) => `'${key}' eq '${v}'`).join(" or ");
        } else {
          // Generate 'or' conditions for partial matching
          return value.map((v) => `contains('${key}', '${v}')`).join(" or ");
        }
      }

      // Handle single string values
      if (exact) {
        return `'${key}' eq '${value}'`;
      } else {
        return `contains('${key}', '${value}')`;
      }
    })
    .filter((part) => part !== null); // Filter out null entries

  const parts = queryParts.join(" or ");

  return parts; // Combine all parts with 'or'
};
