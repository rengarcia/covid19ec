import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import stop from "../utils/stop";

const CITIES_URL =
  "https://4ndresg17.carto.com:443/api/v2/sql?format=geojson&q=select * from public.cantones_reshape";

function updateCityFeature(feature, confirmedByCity) {
  const confirmed = confirmedByCity[feature.properties.dpa_canton] || 0;

  return {
    ...feature,
    properties: {
      ...feature.properties,
      confirmed,
      stop: stop(confirmed, 10),
    },
  };
}

const initialState = {
  type: "FeatureCollection",
  features: [],
};

// TODO: Should I make ajax calls here?
function useGeoJsonCities(provinceId, confirmedByCity) {
  const [geoJsonCities, setGeoJsonCities] = useState(initialState);
  useEffect(() => {
    if (provinceId) {
      async function getCities() {
        const URL = `${CITIES_URL} where dpa_prov = '${provinceId}'`;
        const response = await fetch(URL);
        const data = await response.json();

        const geoJson = {
          type: "FeatureCollection",
          features: data.features.map((feature) =>
            updateCityFeature(feature, confirmedByCity)
          ),
        };

        setGeoJsonCities(geoJson);
      }
      getCities();
    } else {
      setGeoJsonCities(initialState);
    }
  }, [provinceId, confirmedByCity]);

  return [geoJsonCities, setGeoJsonCities];
}

export default useGeoJsonCities;
