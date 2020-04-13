import fetch from "isomorphic-unfetch";

const WORLD_URL = "https://covid19.mathdro.id/api";

async function getWorldData() {
  const response = await fetch(WORLD_URL);

  return await response.json();
}

const createWorldData = async (data) => {
  const worldData = await getWorldData();

  return Object.assign({}, data, {
    confirmed: worldData.confirmed.value,
    recovered: worldData.recovered.value,
    deaths: worldData.deaths.value,
  });
};

export default createWorldData;
