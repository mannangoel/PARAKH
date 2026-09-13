/*import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Inspection from "./pages/Inspection";
import Analysis from "./pages/Analysis";
import Result from "./pages/Result";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/inspection"
          element={<Inspection />}
        />

        <Route
          path="/analysis"
          element={<Analysis />}
        />

        <Route
          path="/result"
          element={<Result />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;*/
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Inspection from "./pages/Inspection";
import Analysis from "./pages/Analysis";
import Result from "./pages/Result";
import Investigations from "./pages/Investigations";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <div className="app-layout">

        <Routes>

          <Route path="/" element={<Home />} />

          <Route
            path="/inspection"
            element={<Inspection />}
          />

          <Route
            path="/analysis"
            element={<Analysis />}
          />

          <Route
            path="/result"
            element={<Result />}
          />

          <Route
            path="/investigations"
            element={<Investigations />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;