import './ProgressBar.scss';

const ProgressBar = ({ progress }) => {
  const progressStyle = {
    width: `${progress}%`
  };

  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={progressStyle}>
        {progress >= 50 && <span className="progress-label inside">{progress}%</span>}
      </div>
      {progress < 50 && <span className="progress-label outside" style={{ left: `${progress}%` }}>{progress}%</span>}
    </div>
  );
};

export default ProgressBar;
