import { useState, useEffect } from "react";
import bbox from "@turf/bbox";
import { WebMercatorViewport, FlyToInterpolator } from "react-map-gl";
import useMediaQuery from "../hooks/use-media-query";
import { TABLET } from "../utils/breakpoints";

function useViewport(features, selectedProvince) {
  const isTablet = useMediaQuery(`(min-width: ${TABLET}px)`);
  const getZoom = () => (isTablet ? 6 : 5);

  const [viewport, setViewport] = useState({
    latitude: -1.5395,
    longitude: -78.23037,
    zoom: getZoom(),
    bearing: 0,
    pitch: 0,
  });

  useEffect(() => {
    const feature = features.find(
      ({ properties }) =>
        properties.dpa_provin === selectedProvince && !properties.dpa_canton
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
    }
  }, [features, selectedProvince]);

  return [viewport, setViewport];
}

export default useViewport;
