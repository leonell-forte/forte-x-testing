import RouteProvider from "components/RouteProvider";

import "./App.css";
import QueryProvider from "./components/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <div>
        <div className="fixed left-0 top-0 z-[-1] h-screen w-screen bg-body-gradient"></div>
        <RouteProvider />
      </div>
    </QueryProvider>
  );
}

export default App;
