import './ManageBookings.scss';
import TopBar from '../../components/common/TopBar/TopBar';
import SlotsHandler from '../../components/features/SlotsHandler/SlotsHandler';
import SlotsComparision from '../../components/features/SlotsComparision/SlotsComparision'



export default function ManageBookings() {

  return (
    <div className="manage-bookings">
      <TopBar title="Manage Bookings" />

      <div className="comparision-container">
        <SlotsComparision />
      </div>

      <div className="slots-container">
        <SlotsHandler />
      </div>

   
    </div>
  );
}