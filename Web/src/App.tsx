import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { NavermapsProvider } from "react-naver-maps";

export const CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

function App() {
  return (
    <BrowserRouter>
      <NavermapsProvider ncpKeyId={CLIENT_ID}>
        <AppRoutes />
      </NavermapsProvider>
    </BrowserRouter>
  );
}

export default App;
