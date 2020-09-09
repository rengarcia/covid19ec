import React, { useEffect, useRef, useState } from "react";
import MapGL, { Source, Layer } from "react-map-gl";
import styled, { css } from "styled-components";
import getConfig from "next/config";

import ProvincesList from "./provinces-list";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../state-context";
import { TABLET, DESKTOP } from "../utils/breakpoints";
import { SET_SELECTED_PROVINCE } from "../state-context/reducer";
import useMediaQuery from "../hooks/use-media-query";
import useGeoJsonCities from "../hooks/use-geojson-cities";
import useDataLayer from "../hooks/use-data-layer";
import useViewport from "../hooks/use-viewport";

const {
  publicRuntimeConfig: { mapboxToken, mapStyle },
} = getConfig();

const MapContainer = styled.div`
  & > div {
    bottom: 0;
    left: 0;
    margin-top: 2.75rem;
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

  @media (max-width: ${DESKTOP - 1}px) {
    & > div {
      padding-bottom: 10.25rem;
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

const CasesCategory = styled.h4`
  display: grid;
  grid-template-columns: auto max-content;
  gap: 1.5rem;
  margin: 0;

  span {
    font-weight: normal;
  }
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

function getMapData(geoJson, geoJsonCities) {
  return {
    ...geoJson,
    features: [
      ...geoJson.features.map((f) => mapFeature(f, false)),
      ...geoJsonCities.features.map((f) => mapFeature(f, false)),
    ],
  };
}

function mapFeature(feature, hovered) {
  return {
    ...feature,
    properties: {
      ...feature.properties,
      hovered: hovered ? 1 : 0,
    },
  };
}

function useMapData(hoveredFeature, geoJson, geoJsonCities) {
  const [mapData, setMapData] = useState(getMapData(geoJson, geoJsonCities));
  let featureId;

  if (hoveredFeature.feature) {
    featureId = hoveredFeature.feature.properties.cartodb_id;
  }

  useEffect(() => {
    let newMapData = getMapData(geoJson, geoJsonCities);
    const index = newMapData.features.findIndex(
      (f) => f.properties.cartodb_id === featureId
    );
    if (index >= 0) {
      const feature = newMapData.features[index];
      const newFeature = mapFeature(feature, true);
      newMapData = {
        ...newMapData,
        features: [
          ...newMapData.features.slice(0, index),
          newFeature,
          ...newMapData.features.slice(index + 1),
        ],
      };
    }
    setMapData(newMapData);
  }, [featureId, geoJson, geoJsonCities]);

  return [mapData, setMapData];
}

function Tooltip({ data }) {
  const [leftPosition, setLeftPosition] = useState(false);
  const { t } = useTranslation();
  const tooltipRef = useRef(null);
  const { feature, x, y } = data;
  const { dpa_despro, dpa_descan, confirmed, deaths } = feature.properties;

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
        <CasesCategory>
          <span>{t("confirmed")}</span>
          <strong>{confirmed}</strong>
        </CasesCategory>
        {deaths !== undefined && (
          <CasesCategory>
            <span>{t("deaths")}</span>
            <strong>{deaths}</strong>
          </CasesCategory>
        )}
      </Cases>
    </TooltipContainer>
  );
}

function Map({ geoJson, confirmedByCity, provinces, provincesKeys }) {
  const [{ selectedProvince }, dispatch] = useGlobalState();
  const [geoJsonCities] = useGeoJsonCities(selectedProvince, confirmedByCity);
  const isProvinceActive =
    selectedProvince != null && geoJsonCities.features.length > 0;
  const dataLayer = useDataLayer(isProvinceActive);
  const isTablet = useMediaQuery(`(min-width: ${TABLET}px)`);

  const [hoveredFeature, setHoveredFeature] = useHoveredFeature(
    selectedProvince
  );

  const [mapData] = useMapData(hoveredFeature, geoJson, geoJsonCities);

  const [viewport, setViewport] = useViewport(
    geoJson.features,
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
        height="calc(100vh - 2.75rem)"
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
      <ProvincesList provincesKeys={provincesKeys} provinces={provinces} />
    </MapContainer>
  );
}

export default Map;
