import { useState, useEffect } from "react";

const fill = {
  id: "fill",
  type: "fill",
  paint: {
    "fill-color": "transparent",
    "fill-opacity": 1,
  },
};

const line = {
  id: "line",
  type: "line",
  paint: {
    "line-color": "transparent",
  },
};

function useDataLayer(isProvinceActive = false) {
  const [dataLayer, setDataLayer] = useState({ fill, line });

  useEffect(() => {
    const newFill = createFillDataLayer(isProvinceActive);
    const newLine = createLineDataLayer(isProvinceActive);
    setDataLayer({ fill: newFill, line: newLine });
  }, [isProvinceActive]);

  return dataLayer;
}

function createFillDataLayer(isProvinceActive) {
  return {
    ...fill,
    paint: {
      "fill-color": {
        property: "stop",
        stops: [
          // provinces
          [0, isProvinceActive ? "#f7f7f7" : "#ffffff"],
          [1, isProvinceActive ? "#f7f7f7" : "#fed7d7"],
          [2, isProvinceActive ? "#f7f7f7" : "#feb2b2"],
          [3, isProvinceActive ? "#f7f7f7" : "#fc8181"],
          [4, isProvinceActive ? "#f7f7f7" : "#f56565"],
          [5, isProvinceActive ? "#f7f7f7" : "#e53e3e"],
          // cities
          [10, "#ffffff"],
          [11, "#fed7d7"],
          [12, "#feb2b2"],
          [13, "#fc8181"],
          [14, "#f56565"],
          [15, "#e53e3e"],
        ],
      },
      "fill-opacity": {
        property: "stop",
        stops: [
          // provinces
          [0, isProvinceActive ? 0.5 : 0.8],
          [1, isProvinceActive ? 0.5 : 0.8],
          [2, isProvinceActive ? 0.5 : 0.8],
          [3, isProvinceActive ? 0.5 : 0.8],
          [4, isProvinceActive ? 0.5 : 0.8],
          [5, isProvinceActive ? 0.5 : 0.8],
          // cities
          [10, 0.8],
          [11, 0.8],
          [12, 0.8],
          [13, 0.8],
          [14, 0.8],
          [15, 0.8],
        ],
      },
    },
  };
}

function createLineDataLayer(isProvinceActive) {
  return {
    ...line,
    paint: {
      "line-color": {
        property: "stop",
        stops: [
          // provinces
          [0, isProvinceActive ? "#a0aec0" : "#e53e3e"],
          [1, isProvinceActive ? "#a0aec0" : "#e53e3e"],
          [2, isProvinceActive ? "#a0aec0" : "#e53e3e"],
          [3, isProvinceActive ? "#a0aec0" : "#e53e3e"],
          [4, isProvinceActive ? "#a0aec0" : "#e53e3e"],
          [5, isProvinceActive ? "#a0aec0" : "#e53e3e"],
          // cities
          [10, "#e53e3e"],
          [11, "#e53e3e"],
          [12, "#e53e3e"],
          [13, "#e53e3e"],
          [14, "#e53e3e"],
          [15, "#e53e3e"],
        ],
      },
    },
  };
}

export default useDataLayer;
