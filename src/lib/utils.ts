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

export type IODataObject = Record<string, { value: string; exact: boolean }>;

export const generateODataQuery = (obj: IODataObject) => {
  const queryParts = Object.keys(obj).map((key) => {
    const { value, exact } = obj[key]; // Destructure to get value and exact

    // If 'exact' is true, use 'eq'; if false, use 'contains'
    if (exact) {
      return `'${key}' eq '${value}'`;
    } else {
      const fieldName = key.replace(/\./g, "."); // Adjust the format if necessary

      return `contains('${fieldName}', '${value}')`;
    }
  });

  return queryParts.join(" and "); // Combine all parts with 'and'
};
