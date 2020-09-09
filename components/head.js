import React from "react";

import image from "../assets/ogimage.png";
import icon from "../assets/favicon.ico";

function AppHead() {
  const title = "Covid-19 Ecuador";
  const description =
    "Información actualizada de los casos de COVID-19 en Ecuador";

  return (
    <>
      <link rel="icon" href={icon} />
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:image" content={image} />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
        rel="stylesheet"
      />
      <link
        href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css"
        rel="stylesheet"
      />
      <title>{title}</title>
    </>
  );
}

export default AppHead;
