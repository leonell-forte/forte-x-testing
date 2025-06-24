import RouteProvider from "@/components/RouteProvider";
import { ToastMarker } from "@/components/ui/toast/Toast";

import "./App.css";
import QueryProvider from "./components/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <div>
        <div className="layout-background fixed left-0 top-0 z-[-1] h-screen w-screen"></div>
        <RouteProvider />
        <ToastMarker />
      </div>
    </QueryProvider>
  );
}

export default App;
