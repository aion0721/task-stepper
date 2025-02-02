import { Provider as ChakraProvder } from "@/components/ui/provider";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppContextProvider } from "./context/AppContextProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <ChakraProvder>
        <App />
      </ChakraProvder>
    </AppContextProvider>
  </React.StrictMode>
);
