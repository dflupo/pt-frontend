import './ManageBookings.scss';
import TopBar from '../../components/common/TopBar/TopBar';


export default function ManageBookings() {

  return (
    <div className="manage-bookings">
      <TopBar title="Manage Bookings" />

      <div className="comparison">
        <div className="col-1">
          <div className="comparison-card">

            <div className="header">
              <div className="title">
                <h4>Lunedì 1 Marzo</h4>
                <h4>10:00 - 11:00</h4>
              </div>
              <div className="capability">
                <p>3/6</p>
              </div>
            </div>

            <div className="users">
              <div className="user">
                <h5>Domenico Lupo</h5>
              </div>
              <div className="user">
                <h5>Domenico Lupo</h5>
              </div>
              <div className="user">
                <h5>Domenico Lupo</h5>
              </div>
              <div className="user">
                <h5>Domenico Lupo</h5>
              </div>
            </div>

            </div>
        </div>
        <div className="col-2">

        </div>
        <div className="col-3">

        </div>
      </div>

   
    </div>
  );
}