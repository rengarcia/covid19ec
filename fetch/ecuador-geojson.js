import fetch from "isomorphic-unfetch";

const ECUADOR_GEOJSON_URL =
  "https://4ndresg17.carto.com:443/api/v2/sql?format=geojson&q=select * from public.provincias_reshape";

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
