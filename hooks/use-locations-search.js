import { useMemo, useState } from "react";

const removeDiacritics = (string) =>
  string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalizeString = (string) => removeDiacritics(string).toLowerCase();

function useLocationsSearch(locations, query) {
  const [filteredLocations, setFilteredLocations] = useState(locations);

  useMemo(() => {
    const matches = Object.keys(locations)
      .filter((key) =>
        normalizeString(key).includes(normalizeString(query).trim())
      )
      .reduce((obj, key) => {
        obj[key] = locations[key];

        return obj;
      }, {});

    setFilteredLocations(matches);
  }, [query]);

  return filteredLocations;
}

export default useLocationsSearch;
