import fetch from "isomorphic-unfetch";

const ECUADOR_GEOJSON_URL =
  "https://4ndresg17.carto.com/api/v2/sql?format=geojson&q=select * from public.provinciasf";

async function getEcuadorGeoJson() {
  const response = await fetch(ECUADOR_GEOJSON_URL);

  return await response.json();
}

const createEcuadorGeoJson = async (data) => {
  const geoJson = await getEcuadorGeoJson();

  return Object.assign({}, data, {
    geoJson,
  });
};

export default createEcuadorGeoJson;
