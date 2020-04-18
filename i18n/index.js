import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        confirmed: "Confirmed",
        deaths: "Deaths",
        recovered: "Recovered",
        labSamples: "Lab samples",
        searchProvinces: "Search provinces",
        search: "Search…",
        share: "Share",
        noResults: "No results…",
        moreInfo: "More information",
        deselectProvince: "Deselect province",
        lastUpdate: "Last update",
        ecuador: "Ecuador",
        world: "World",
        province: "Province",
        casesByProvince: "Cases by province",
      },
    },
    es: {
      translation: {
        confirmed: "Confirmados",
        deaths: "Fallecidos",
        recovered: "Recuperados",
        labSamples: "Muestras",
        searchProvinces: "Buscar provincias",
        search: "Buscar…",
        share: "Compartir",
        noResults: "No results…",
        moreInfo: "Más información",
        deselectProvince: "Deseleccionar provincia",
        lastUpdate: "Última actualización",
        ecuador: "Ecuador",
        world: "Mundo",
        province: "Provincia",
        casesByProvince: "Casos por provincia",
      },
    },
  },
  lng: "es",
});

export default i18n;
