import React, { useState } from "react";
import MapGL, { Source, Layer } from "react-map-gl";
import styled from "styled-components";
import getConfig from "next/config";

import useMediaQuery from "../hooks/use-media-query";
import { TABLET } from "../utils/breakpoints";

const {
  publicRuntimeConfig: { mapboxToken, mapStyle },
} = getConfig();

const MapContainer = styled.div`
  & > div {
    bottom: 0;
    left: 0;
    position: fixed !important;
    right: 0;
    top: 0;
  }
`;

const fillDataLayer = {
  id: "fill",
  type: "fill",
  paint: {
    "fill-color": {
      property: "stop",
      stops: [
        [0, "#fed7d7"],
        [1, "#feb2b2"],
        [2, "#fc8181"],
        [3, "#f56565"],
        [4, "#e53e3e"],
      ],
    },
    "fill-opacity": 0.8,
  },
};

const lineDataLayer = {
  id: "line",
  type: "line",
  paint: {
    "line-color": "#e53e3e",
  },
};

function Map({ geoJson }) {
  const isTablet = useMediaQuery(`(min-width: ${TABLET}px)`);
  const getZoom = () => (isTablet ? 6 : 5);
  const [viewport, setViewport] = useState({
    latitude: -1.5395,
    longitude: -78.23037,
    zoom: getZoom(),
    bearing: 0,
    pitch: 0,
  });

  const handleClick = (e) => {
    const feature = e.features[0];
    if (feature) {
      console.log(feature);
    }
  };

  return (
    <MapContainer>
      <MapGL
        {...viewport}
        width="100%"
        height="100vh"
        mapStyle={mapStyle}
        onViewportChange={(newViewport) => setViewport(newViewport)}
        onClick={handleClick}
        mapboxApiAccessToken={mapboxToken}
      >
        <Source type="geojson" data={geoJson}>
          <Layer {...fillDataLayer} />
          <Layer {...lineDataLayer} />
        </Source>
      </MapGL>
    </MapContainer>
  );
}

export default Map;
