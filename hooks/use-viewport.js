import { useState, useEffect } from "react";
import bbox from "@turf/bbox";
import { WebMercatorViewport, FlyToInterpolator } from "react-map-gl";

import useMediaQuery from "../hooks/use-media-query";
import { WIDE } from "../utils/breakpoints";

const getInitialViewport = (zoom) => ({
  latitude: -1.5395,
  longitude: -78.23037,
  zoom,
  bearing: 0,
  pitch: 0,
  transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
  transitionDuration: "auto",
});

function useViewport(features, selectedProvince) {
  const [userSelectedFeature, setUserSelectedFeature] = useState(false);
  const isWide = useMediaQuery(`(min-width: ${WIDE}px)`);
  const getZoom = () => (isWide ? 5.5 : 5);

  const [viewport, setViewport] = useState(getInitialViewport(getZoom()));

  useEffect(() => {
    const feature = features.find(
      ({ properties }) =>
        properties.dpa_prov === selectedProvince && !properties.dpa_canton
    );

    if (feature) {
      setUserSelectedFeature(true);

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
      });
    } else if (!feature && userSelectedFeature) {
      setViewport(getInitialViewport(getZoom()));
    }
  }, [features, selectedProvince]);

  return [viewport, setViewport];
}

export default useViewport;
