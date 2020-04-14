import React from "react";
import styled from "styled-components";

import createData from "../fetch/create-data";
import Drawer from "../components/drawer";
import Head from "../components/head";
import Header from "../components/header";
import MapGeoJson from "../components/map-geojson";
import StatsHeader from "../components/stats-header";
import stop from "../utils/stop";
import useMediaQuery from "../hooks/use-media-query";
import { TABLET } from "../utils/breakpoints";

const Container = styled.main`
  height: 100vh;
  position: relative;
`;

function updateProvinceFeature(feature, confirmedByProvince) {
  const confirmed = confirmedByProvince[feature.properties.dpa_prov] || 0;

  return {
    ...feature,
    properties: {
      ...feature.properties,
      confirmed,
      stop: stop(confirmed),
    },
  };
}

function Index({ ecuador, world }) {
  const isTablet = useMediaQuery(`(min-width: ${TABLET}px)`);
  const { provinces, confirmedByProvince, geoJson } = ecuador;

  const data = {
    ecuador: {
      ...ecuador,
      provinces: Object.keys(provinces)
        .sort()
        .reduce(
          (acc, key) => ({
            ...acc,
            [key]: provinces[key],
          }),
          {}
        ),
      geoJson: {
        type: "FeatureCollection",
        features: geoJson.features.map((feature) =>
          updateProvinceFeature(feature, confirmedByProvince)
        ),
      },
    },
    world,
  };

  return (
    <>
      <Head />
      <Container>
        <Header lastUpdate={data.ecuador.lastUpdate} />
        {isTablet && <StatsHeader data={data} />}
        <MapGeoJson
          geoJson={data.ecuador.geoJson}
          confirmedByCity={data.ecuador.confirmedByCity}
        />
        {!isTablet && <Drawer data={data} />}
      </Container>
    </>
  );
}

Index.getInitialProps = async () => {
  return createData();
};

export default Index;
