import { createGlobalStyle } from "styled-components";

export const AppReset = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
  }

  html,
  body,
  #root,
  main {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  html {
    font-size: 20px;
    font-family: system-ui, sans-serif;
    font-weight: normal;
    line-height: 1;
    text-rendering: geometricPrecision;
    background-color: #ffffff;
    color: #000000;
  }

  main {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
`;
