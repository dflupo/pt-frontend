import './styles/main.scss'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Test from "./routes/Test/Test"


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Test />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
