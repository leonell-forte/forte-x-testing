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
