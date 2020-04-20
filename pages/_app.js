import App from "next/app";
import React from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";

import { StateProvider } from "../state-context";
import { initialState, reducer } from "../state-context/reducer";

export const theme = {
  colors: {
    black: "#000000",
    blacktransparent: "rgba(0, 0, 0, 0.8)",
    firebrick: "#c81912",
    matterhorn: "#515151",
    whitesmoke: "#f7f7f7",
    silver: "#c4c4c4",
    transparent: "transparent",
    white: "#ffffff",
  },
  shadows: {
    surface(inverted = false) {
      return `0 ${inverted ? "-2px" : "2px"} 4px rgba(0, 0, 0, 0.05)`;
    },
    deep(inverted = false) {
      return `0 ${inverted ? "-2px" : "2px"} 4px rgba(0, 0, 0, 0.3)`;
    },
  },
};

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Proxima Nova';
    font-weight: regular;
    src: url('/fonts/proxima-nova-regular.woff2');
  }

  @font-face {
    font-family: 'Proxima Nova';
    font-weight: bold;
    src: url('/fonts/proxima-nova-bold.woff2');
  }

  body {
    color: ${({ theme }) => theme.colors.matterhorn};
    font-family: 'Proxima Nova';
  }

  * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *:focus {
    outline: none;
  }

  button:hover {
    cursor: pointer;
  }

  svg {
    font-family: "Proxima Nova" !important;
  }
`;

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <StateProvider initialState={initialState} reducer={reducer}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Component {...pageProps} />
        </ThemeProvider>
      </StateProvider>
    );
  }
}
