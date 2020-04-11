import { useMemo, useState } from "react";

const removeDiacritics = (string) =>
  string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalizeString = (string) => removeDiacritics(string).toLowerCase();

function useProvincesSearch(provinces, query) {
  const [filteredProvinces, setFilteredProvinces] = useState(provinces);

  useMemo(() => {
    const matches = Object.keys(provinces)
      .filter((key) =>
        normalizeString(key).includes(normalizeString(query).trim())
      )
      .reduce((obj, key) => {
        obj[key] = provinces[key];

        return obj;
      }, {});

    setFilteredProvinces(matches);
  }, [query]);

  return filteredProvinces;
}

export default useProvincesSearch;
