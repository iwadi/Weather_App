import '../App.css';

function ForecastItem() {
    return (
        <>
            <div className="forecast-item">
                    <span className="forecast-title">MORNING</span>
                    <hr className="forecast-hr"/>
                    <div className="forecast-icon">☁️</div>
                    <span className="forecast-temperature">17°</span>
                </div>
                <div className="forecast-item">
                    <span className="forecast-title">AFTERNOON</span>
                    <hr className="forecast-hr"/>
                    <div className="forecast-icon">⛅</div>
                    <span className="forecast-temperature">21°</span>
                </div>
                <div className="forecast-item">
                    <span className="forecast-title">EVENING</span>
                    <hr className="forecast-hr"/>
                    <div className="forecast-icon">☔</div>
                    <span className="forecast-temperature">19°</span>
                </div>
                <div className="forecast-item">
                    <span className="forecast-title">OVERNIGHT</span>
                    <hr className="forecast-hr"/>
                    <div className="forecast-icon">☁️</div>
                    <span className="forecast-temperature">13°</span>
            </div>
        </>
    )
}

export default ForecastItem;