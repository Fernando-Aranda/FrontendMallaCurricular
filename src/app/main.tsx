import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ApolloProvider } from "@apollo/client/react";
import { client } from "../api/lib/apolloClient";

import App from "./App.tsx";
import { AuthProvider } from "../context/AuthContext.tsx";

import "../assets/styles/index.css";

// Instancia de React Query
const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
