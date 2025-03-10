import './MainLayout.scss'
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

const MainLayout = () => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainLayout;
