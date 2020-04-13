import React, { useState } from "react";
import MapGL, {
  Source,
  Layer,
  WebMercatorViewport,
  FlyToInterpolator,
} from "react-map-gl";
import styled from "styled-components";
import getConfig from "next/config";
import bbox from "@turf/bbox";

import { useGlobalState } from "../state-context";
import useMediaQuery from "../hooks/use-media-query";
import useGeoJsonCities from "../hooks/use-geojson-cities";
import useDataLayer from "../hooks/use-data-layer";
import { TABLET } from "../utils/breakpoints";
import { SET_SELECTED_PROVINCE } from "../state-context/reducer";

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

const TooltipContainer = styled.div`
  position: absolute;
  margin: 8px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  max-width: 300px;
  font-size: 10px;
  z-index: 9;
  pointer-events: none;
`;

const Cases = styled.div`
  display: grid;
  font-family: "Proxima Nova";
  font-size: 1rem;
  gap: 0.25rem;
  padding: 0.375rem;
`;

const Province = styled.h3`
  font-size: 0.875rem;
  margin: 0;
`;

const City = styled.h4`
  font-size: 1rem;
  margin: 0;
`;

const Confirmed = styled.h4`
  display: grid;
  grid-template-columns: auto max-content;
  gap: 1.5rem;
  margin: 0;

  span {
    font-weight: normal;
  }
`;

function Tooltip({ data }) {
  const { feature, x, y } = data;
  const { dpa_despro, dpa_descan, confirmed } = feature.properties;
  return (
    <TooltipContainer style={{ left: x, top: y }}>
      <Cases>
        <Province>{dpa_despro}</Province>
        <City>{dpa_descan}</City>
        <Confirmed>
          <span>Confirmados</span>
          <strong>{feature.properties.confirmed}</strong>
        </Confirmed>
      </Cases>
    </TooltipContainer>
  );
}

function Map({ geoJson, confirmedByCity }) {
  const [{ selectedProvince }, dispatch] = useGlobalState();
  const [geoJsonCities] = useGeoJsonCities(selectedProvince, confirmedByCity);
  const isProvinceActive =
    selectedProvince != null && geoJsonCities.features.length > 0;
  const dataLayer = useDataLayer(isProvinceActive);

  const isTablet = useMediaQuery(`(min-width: ${TABLET}px)`);
  const getZoom = () => (isTablet ? 6 : 5);

  const mapData = {
    ...geoJson,
    features: [
      ...geoJson.features,
      ...(geoJsonCities ? geoJsonCities.features : []),
    ],
  };

  const [viewport, setViewport] = useState({
    latitude: -1.5395,
    longitude: -78.23037,
    zoom: getZoom(),
    bearing: 0,
    pitch: 0,
  });

  const [hoveredFeature, setHoveredFeature] = useState({
    feature: null,
    x: 0,
    y: 0,
  });

  const handleClick = (event) => {
    const feature = event.features.find(
      ({ properties }) => properties.dpa_provin && !properties.dpa_canton
    );
    if (feature) {
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);
      const wmViewport = new WebMercatorViewport(viewport);
      const { longitude, latitude, zoom } = wmViewport.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 50,
        }
      );

      setViewport({
        ...viewport,
        longitude,
        latitude,
        zoom,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
        transitionDuration: "auto",
      });

      dispatch({
        type: SET_SELECTED_PROVINCE,
        payload: feature.properties.dpa_provin,
      });
    }
  };

  const handleHover = (event) => {
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = event;
    const feature =
      features && features.find(({ properties }) => properties.dpa_provin);
    setHoveredFeature({ feature, x: offsetX, y: offsetY });
  };

  return (
    <MapContainer>
      <MapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 12rem)"
        mapStyle={mapStyle}
        onViewportChange={(newViewport) => setViewport(newViewport)}
        onClick={handleClick}
        onHover={handleHover}
        mapboxApiAccessToken={mapboxToken}
      >
        <Source type="geojson" data={mapData}>
          <Layer {...dataLayer.fill} />
          <Layer {...dataLayer.line} />
        </Source>
        {hoveredFeature.feature && <Tooltip data={hoveredFeature} />}
      </MapGL>
    </MapContainer>
  );
}

export default Map;
