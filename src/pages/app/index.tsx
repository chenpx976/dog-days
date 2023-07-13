import React from "react";
import ReactDOM from "react-dom/client";
import { StoreContext, rootStore } from "@src/store/rootStore";
import { ChakraProvider } from "@chakra-ui/react";
import { Suspense } from "react";
import { MemoryRouter as Router, useRoutes } from "react-router-dom";
// import "./global.less";
// import routes from "~react-pages";
// console.log("🚀 ~ file: main.tsx:9 ~ routes", routes);
import theme from "./theme";
import App from "./app";
// const App = () => {
//   const routeList = useRoutes(routes);
//   console.log("🚀 ~ file: main.tsx:14 ~ App ~ routeList", routeList);
//   return <Suspense fallback={<p>Loading...</p>}>{routeList}</Suspense>;
// };

export default (
  <StoreContext.Provider value={rootStore}>
    <ChakraProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </StoreContext.Provider>
);
