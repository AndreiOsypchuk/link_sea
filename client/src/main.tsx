import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { RootContextProvider } from "./store";
const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <RootContextProvider>
          <App />
        </RootContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
