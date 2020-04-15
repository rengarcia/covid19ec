import React, { useEffect, useRef, useState } from "react";
import MapGL, { Source, Layer } from "react-map-gl";
import styled, { css } from "styled-components";
import getConfig from "next/config";

import { useGlobalState } from "../state-context";
import useMediaQuery from "../hooks/use-media-query";
import useGeoJsonCities from "../hooks/use-geojson-cities";
import useDataLayer from "../hooks/use-data-layer";
import useViewport from "../hooks/use-viewport";
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

  @media (min-width: ${TABLET}px) {
    & > div {
      margin-top: 8rem;
      padding-bottom: 8rem;
    }
  }

  @media (max-width: ${TABLET}px) {
    & > div {
      padding-bottom: 12.5rem;
    }
  }
`;

const TooltipContainer = styled.div`
  position: absolute;
  margin: 8px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  max-width: 280px;
  font-size: 10px;
  z-index: 9;
  pointer-events: none;
  ${({ leftPosition }) =>
    leftPosition &&
    css`
      transform: translateX(-100%);
    `}
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
  const [leftPosition, setLeftPosition] = useState(false);
  const tooltipRef = useRef(null);
  const { feature, x, y } = data;
  const { dpa_despro, dpa_descan, confirmed } = feature.properties;

  useEffect(() => {
    if (tooltipRef.current) {
      const { width } = tooltipRef.current.getBoundingClientRect();

      if (width + x > window.innerWidth) {
        setLeftPosition(true);
      } else {
        setLeftPosition(false);
      }
    }
  }, [x]);

  return (
    <TooltipContainer
      leftPosition={leftPosition}
      ref={tooltipRef}
      style={{ left: x, top: y }}
    >
      <Cases>
        <Province>{dpa_despro}</Province>
        <City>{dpa_descan}</City>
        <Confirmed>
          <span>Confirmados</span>
          <strong>{confirmed}</strong>
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

  const mapData = {
    ...geoJson,
    features: [
      ...geoJson.features,
      ...(geoJsonCities ? geoJsonCities.features : []),
    ],
  };

  const [viewport, setViewport] = useViewport(
    geoJson.features,
    selectedProvince
  );

  const [hoveredFeature, setHoveredFeature] = useState({
    feature: null,
    x: 0,
    y: 0,
  });

  const handleClick = (event) => {
    const feature = event.features.find(
      ({ properties }) => properties.dpa_prov && !properties.dpa_canton
    );
    if (feature) {
      dispatch({
        type: SET_SELECTED_PROVINCE,
        payload: feature.properties.dpa_prov,
      });
    }
  };

  const handleHover = (event) => {
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = event;
    const feature =
      features && features.find(({ properties }) => properties.dpa_prov);

    setHoveredFeature({ feature, x: offsetX, y: offsetY });
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
        onHover={handleHover}
        mapboxApiAccessToken={mapboxToken}
        key={isTablet}
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
