import React, { useEffect, useRef, useState } from "react";
import MapGL, { Source, Layer } from "react-map-gl";
import styled, { css } from "styled-components";
import getConfig from "next/config";
import { FaRegTimesCircle } from "react-icons/fa";

import { useGlobalState } from "../state-context";
import useMediaQuery from "../hooks/use-media-query";
import useGeoJsonCities from "../hooks/use-geojson-cities";
import useDataLayer from "../hooks/use-data-layer";
import useViewport from "../hooks/use-viewport";
import { TABLET, DESKTOP } from "../utils/breakpoints";
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

  @media (min-width: ${DESKTOP}px) {
    & > div {
      margin-left: 22rem;
      margin-right: 22rem;
      max-width: calc(100% - 44rem);
    }
  }
`;

const TooltipContainer = styled.div`
  position: absolute;
  margin: 8px;
  padding: 4px;
  background: ${({ theme }) => theme.colors.blacktransparent};
  color: ${({ theme }) => theme.colors.white};
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

const ClearProvince = styled.span`
  align-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.surface()};
  border-radius: 0.5rem;
  color: inherit;
  display: grid;
  font-weight: bold;
  grid-template-columns: auto 1.5rem;
  height: 2.375rem;
  left: 50%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  position: absolute;
  top: 1rem;
  transform: translateX(-50%);
  transition: 250ms;
  width: 300px;
  z-index: 314160;

  :hover {
    cursor: pointer;
  }

  button {
    align-items: center;
    appearance: none;
    background-color: ${({ theme }) => theme.colors.white};
    color: inherit;
    border: 0;
    display: flex;
    padding: 0;

    &:hover {
      cursor: pointer;
    }
  }

  svg {
    height: 1.625rem;
    width: 1.625rem;
  }

  ${({ isHidden }) =>
    isHidden &&
    css`
      opacity: 0;
      visibility: hidden;

      svg {
        display: none;
      }
    `}
`;

function useHoveredFeature(selectedProvince) {
  const [hoveredFeatured, setHoveredFeatured] = useState({
    feature: null,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    setHoveredFeatured({ feature: null, x: 0, y: 0 });
  }, [selectedProvince]);

  return [hoveredFeatured, setHoveredFeatured];
}

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

function Map({ geoJson, confirmedByCity, provincesKeys }) {
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

  const [hoveredFeature, setHoveredFeature] = useHoveredFeature(
    selectedProvince
  );

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
        getCursor={() => "pointer"}
        key={isTablet}
      >
        <Source type="geojson" data={mapData}>
          <Layer {...dataLayer.fill} />
          <Layer {...dataLayer.line} />
        </Source>
        {hoveredFeature.feature && <Tooltip data={hoveredFeature} />}
      </MapGL>
      <ClearProvince isHidden={!selectedProvince}>
        {provincesKeys[selectedProvince]}
        <button
          onClick={() =>
            dispatch({
              type: SET_SELECTED_PROVINCE,
              payload: null,
            })
          }
        >
          <FaRegTimesCircle
            aria-hidden="true"
            aria-label="Deseleccionar provincia"
          />
        </button>
      </ClearProvince>
    </MapContainer>
  );
}

export default Map;
