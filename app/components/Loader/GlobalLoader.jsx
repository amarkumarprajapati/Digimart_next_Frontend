 
import "./GlobalLoader.scss";

const GlobalLoader = () => {
  return (
    <div
      className="global-loader-wrapper"
    >
      <div className="loader-content">
        {/* Main Spinner */}
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-ring"></div>
        </div>
        
        {/* Brand Name or Logo */}
        <div
          className="loader-text"
        >
          <h2>DigiMart</h2>
          <p>Loading...</p>
        </div>

        {/* Progress Dots */}
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
