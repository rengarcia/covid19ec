import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        confirmed: "Confirmed cases",
        deaths: "Deaths",
        recovered: "Recovered",
        labSamples: "Lab samples",
        searchProvinces: "Search provinces",
        search: "Search…",
        share: "Share",
        moreInfo: "More information",
        deselectProvince: "Deselect province",
        lastUpdate: "Last update",
        ecuador: "🇪🇨 Ecuador",
        world: "🌎 World"
      },
    },
    es: {
      translation: {
        confirmed: "Casos confirmados",
        deaths: "Fallecidos",
        recovered: "Recuperados",
        labSamples: "Muestras",
        searchProvinces: "Buscar provincias",
        search: "Buscar…",
        share: "Compartir",
        moreInfo: "Más información",
        deselectProvince: "Deseleccionar provincia",
        lastUpdate: "Última actualización",
        ecuador: "🇪🇨 Ecuador",
        world: "🌎 Mundo"
      },
    },
  },
  lng: "es",
});

export default i18n;
