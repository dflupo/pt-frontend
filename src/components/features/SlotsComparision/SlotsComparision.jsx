import './SlotsComparision.scss';
import { MdGroups2, MdDragIndicator} from "react-icons/md";


export default function SlotsComparision() {

    return(
        <div className="comparision">
            <div className="col-1">
                <div className="comparision-card">

                <div className="header">
                <div className="title">
                    <h4>Lunedì 1 Marzo</h4>
                    <h4>10:00 - 11:00</h4>
                </div>
                <div className="capability free">
                    <MdGroups2 size={25} />
                    <p>3/6</p>
                </div>
                </div>

                <div className="users">
                <div className="user">
                    <span className="drag">
                    <MdDragIndicator size={25} />
                    </span>
                    <h5>Domenico Lupo</h5>
                </div>
                <div className="user">
                    <span className="drag">
                    <MdDragIndicator size={25} />
                    </span>
                    <h5>Domenico Lupo</h5>
                </div>
                <div className="user">
                    <span className="drag">
                    <MdDragIndicator size={25} />
                    </span>
                    <h5>Domenico Lupo</h5>
                </div>
                <div className="user">
                    <span className="drag">
                    <MdDragIndicator size={25} />
                    </span>
                    <h5>Domenico Lupo</h5>
                </div>
                <div className="user">
                    <span className="drag">
                    <MdDragIndicator size={25} />
                    </span>
                    <h5>Domenico Lupo</h5>
                </div>
                <div className="user">
                    <span className="drag">
                    <MdDragIndicator size={25} />
                    </span>
                    <h5>Domenico Lupo</h5>
                </div>
                <div className="user">
                    <span className="drag">
                    <MdDragIndicator size={25} />
                    </span>
                    <h5>Domenico Lupo</h5>
                </div>
                </div>

                </div>
            </div>
            <div className="col-2">

            </div>
            <div className="col-3">
                <div className="comparision-card">
                    <div className="header">
                        <div className="title">
                            <h4>Lunedì 1 Marzo</h4>
                            <h4>10:00 - 11:00</h4>
                        </div>
                        <div className="capability free">
                            <MdGroups2 size={25} />
                            <p>3/6</p>
                        </div>
                    </div>

                    <div className="users">
                        <div className="user">
                            <span className="drag">
                            <MdDragIndicator size={25} />
                            </span>
                            <h5>Domenico Lupo</h5>
                        </div>
                        <div className="user">
                            <span className="drag">
                            <MdDragIndicator size={25} />
                            </span>
                            <h5>Domenico Lupo</h5>
                        </div>
                        <div className="user">
                            <span className="drag">
                            <MdDragIndicator size={25} />
                            </span>
                            <h5>Domenico Lupo</h5>
                        </div>
                        <div className="user">
                            <span className="drag">
                            <MdDragIndicator size={25} />
                            </span>
                            <h5>Domenico Lupo</h5>
                        </div>
                        <div className="user">
                            <span className="drag">
                            <MdDragIndicator size={25} />
                            </span>
                            <h5>Domenico Lupo</h5>
                        </div>
                        <div className="user">
                            <span className="drag">
                            <MdDragIndicator size={25} />
                            </span>
                            <h5>Domenico Lupo</h5>
                        </div>
                        <div className="user">
                            <span className="drag">
                            <MdDragIndicator size={25} />
                            </span>
                            <h5>Domenico Lupo</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}