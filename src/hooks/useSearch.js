import { useState, useMemo } from 'react';

/**
 * Hook para buscar en un array de items
 * @param {Array} items - Array de items a buscar
 * @param {Array} searchableFields - Campos en los que buscar (ej: ["name", "type"])
 * @returns {Object} { searchTerm, setSearchTerm, filteredItems }
 */
export const useSearch = (items = [], searchableFields = []) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm || searchableFields.length === 0) {
      return items;
    }

    return items.filter((item) =>
      searchableFields.some((field) =>
        String(item[field])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [items, searchTerm, searchableFields]);

  return { searchTerm, setSearchTerm, filteredItems };
};
