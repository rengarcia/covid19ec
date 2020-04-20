import pipe from "../utils/pipe";
import ecuadorCities from "./ecuador-cities";
import ecuadorAgeGroup from "./ecuador-age-group";
import ecuadorGeoJson from "./ecuador-geojson";
import ecuadorData from "./ecuador-data";
import ecuadorDeathsProvinces from "./ecuador-deaths-provinces";
import ecuadorPatients from "./ecuador-patients";
import ecuadorSexCases from "./ecuador-sex-cases";
import ecuadorTimeline from "./ecuador-timeline";
import worldData from "./world-data";

const createEcuador = pipe(
  ecuadorCities,
  ecuadorGeoJson,
  ecuadorData,
  ecuadorDeathsProvinces,
  ecuadorTimeline,
  ecuadorPatients,
  ecuadorAgeGroup,
  ecuadorSexCases
);

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
