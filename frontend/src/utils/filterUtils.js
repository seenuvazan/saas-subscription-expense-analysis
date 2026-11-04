export function filterItems(items, searchTerm, searchKeys = ['name']) {
  if (!searchTerm || !searchTerm.trim()) return items;
  const query = searchTerm.toLowerCase().trim();
  return items.filter(item =>
    searchKeys.some(key => {
      const val = item[key];
      return val && String(val).toLowerCase().includes(query);
    })
  );
}

export function filterByDepartment(items, department) {
  if (!department || department === 'ALL') return items;
  return items.filter(item => item.department === department);
}
