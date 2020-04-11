import React, { useCallback, useState } from "react";
import MapGL, { Popup, Marker } from "react-map-gl";
import styled from "styled-components";
import getConfig from "next/config";

import useMediaQuery from "../hooks/use-media-query";
import { useGlobalState } from "../state-context";
import { theme } from "../pages/_app";
import { TABLET } from "../utils/breakpoints";
import { SET_SELECTED_CITY } from "../state-context/reducer";

const {
  publicRuntimeConfig: { mapboxToken, mapStyle },
} = getConfig();

console.log({ mapboxToken, mapStyle })

const City = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

const Cases = styled.div`
  display: grid;
  font-family: "Proxima Nova";
  font-size: 1rem;
  gap: 0.25rem;
  padding: 0.375rem;
`;

const Confirmed = styled.h4`
  display: grid;
  grid-template-columns: auto max-content;
  gap: 1.5rem;
  margin-bottom: 0;
  margin-top: 0;

  span {
    font-weight: normal;
  }
`;

const MapContainer = styled.div`
  & > div {
    bottom: 0;
    left: 0;
    position: fixed !important;
    right: 0;
    top: 0;
  }
`;

function Pins({ cities, dispatch }) {
  const maxConfirmed = cities
    .map(({ confirmed }) => confirmed)
    .reduce((acc, current) => (acc > current ? acc : current));

  const minConfirmed = cities
    .map(({ confirmed }) => confirmed)
    .reduce((acc, current) => (acc < current ? acc : current));

  const getRadius = useCallback(
    (confirmed) => {
      const maxRadius = 16;
      const minRadius = 2;

      if (confirmed === maxConfirmed) {
        return maxRadius;
      } else if (confirmed === minConfirmed) {
        return minRadius;
      } else {
        return (confirmed * maxRadius) / maxConfirmed + minRadius;
      }
    },
    [maxConfirmed, minConfirmed]
  );

  return cities.map((city) => {
    const radius = getRadius(city.confirmed);

    return (
      <Marker key={city.id} longitude={city.lng} latitude={city.lat}>
        <svg
          height={radius * 2}
          viewBox={`0 0 ${radius * 2 + 2} ${radius * 2 + 2}`}
          style={{
            cursor: "pointer",
            transform: `translate(${-radius}px, ${-radius * 2}px)`,
          }}
          onClick={() => dispatch({ type: SET_SELECTED_CITY, payload: city })}
        >
          <circle
            cx={radius + 1}
            cy={radius + 1}
            r={radius}
            fill={theme.colors.firebrick}
            fillOpacity="0.4"
            stroke={theme.colors.firebrick}
            strokeWidth="1"
          />
        </svg>
      </Marker>
    );
  });
}

function Map({ cities }) {
  const [{ selectedCity }, dispatch] = useGlobalState();
  const isTablet = useMediaQuery(`(min-width: ${TABLET}px)`);
  const getZoom = () => (isTablet ? 6 : 5);
  const [viewport, setViewport] = useState({
    latitude: -1.5395,
    longitude: -78.23037,
    zoom: getZoom(),
    bearing: 0,
    pitch: 0,
  });

  return (
    <MapContainer>
      <MapGL
        {...viewport}
        width="100%"
        height="100vh"
        mapStyle={mapStyle}
        onViewportChange={(newViewport) => setViewport(newViewport)}
        mapboxApiAccessToken={mapboxToken}
      >
        <Pins cities={cities} dispatch={dispatch} />
        {selectedCity && (
          <Popup
            tipSize={5}
            anchor="top"
            longitude={selectedCity.lng}
            latitude={selectedCity.lat}
            closeOnClick={false}
            onClose={() => dispatch({ type: SET_SELECTED_CITY, payload: null })}
          >
            <Cases>
              <City>
                {selectedCity.city}, {selectedCity.province}
              </City>
              <Confirmed>
                <span>Confirmados</span>
                <strong>{selectedCity.confirmed}</strong>
              </Confirmed>
            </Cases>
          </Popup>
        )}
      </MapGL>
    </MapContainer>
  );
}

export default Map;
