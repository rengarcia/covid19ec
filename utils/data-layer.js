// TODO: Could these fns be hooks?

export function createFillDataLayer(isProvinceActive = false) {
  return {
    id: "fill",
    type: "fill",
    paint: {
      "fill-color": {
        property: "stop",
        stops: [
          // provinces
          [0, isProvinceActive ? "transparent" : "#fed7d7"],
          [1, isProvinceActive ? "transparent" : "#feb2b2"],
          [2, isProvinceActive ? "transparent" : "#fc8181"],
          [3, isProvinceActive ? "transparent" : "#f56565"],
          [4, isProvinceActive ? "transparent" : "#e53e3e"],
          [10, "#fed7d7"],
          [11, "#feb2b2"],
          [12, "#fc8181"],
          [13, "#f56565"],
          [14, "#e53e3e"],
        ],
      },
      "fill-opacity": {
        property: "stop",
        stops: [
          // provinces
          [0, isProvinceActive ? 1 : 0.8],
          [1, isProvinceActive ? 1 : 0.8],
          [2, isProvinceActive ? 1 : 0.8],
          [3, isProvinceActive ? 1 : 0.8],
          [4, isProvinceActive ? 1 : 0.8],
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

export function createLineDataLayer(isProvinceActive = false) {
  return {
    id: "line",
    type: "line",
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
