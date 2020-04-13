import pipe from "../utils/pipe";
import ecuadorCities from "./ecuador-cities";
import ecuadorGeoJson from "./ecuador-geojson";
import ecuadorData from "./ecuador-data";
import worldData from "./world-data";

const createEcuador = pipe(ecuadorCities, ecuadorGeoJson, ecuadorData);

const createData = async () => {
  try {
    const ecuador = await createEcuador({});
    const world = await worldData({});
    return { ecuador, world };
  } catch (err) {
    console.error(err);
  }
};

export default createData;
