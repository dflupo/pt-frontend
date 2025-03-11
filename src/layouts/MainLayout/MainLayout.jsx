import './MainLayout.scss'
import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar/Sidebar";
import TopBar from '../../components/common/TopBar/TopBar';

export default function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Outlet context={ {TopBar} } /> 
      </div>
    </div>
  );
};
