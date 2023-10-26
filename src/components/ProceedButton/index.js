import "./index.css";

const ProceedButton = (props) => {
  const { onClickProceed } = props;

  return (
    <div className="w-100 fixed-bottom bg-light d-flex justify-content-evenly align-content-center pt-3 pb-1">
      <ul className="d-flex gap-2 gap-1">
        <li className="d-flex flex-column align-content-center">
          <button id="seat-btn" className="btn btn-success  " disabled>
            #
          </button>
          <b>You</b>
        </li>
        <li className="d-flex flex-column align-content-center">
          <button
            id="seat-btn"
            className="btn btn-outline-success align-content-center"
            disabled
          >
            #
          </button>
          <b className="text-center">Standard Seat</b>
        </li>
        <li className="d-flex flex-column align-content-center">
          <button
            id="seat-btn"
            className="btn btn-outline-warning align-center text-dark"
            disabled
          >
            #
          </button>
          <b className="text-center">Premium Seat</b>
        </li>
        <li>
          <button
            id="seat-btn"
            className="btn btn-secondary align-content-center"
            disabled
          >
            #
          </button>
          <b>Unavailable</b>
        </li>
      </ul>

      <button
        onClick={() => onClickProceed()}
        type="button"
        className="btn btn-danger proceed-button"
      >
        Proceed
      </button>
    </div>
  );
};

export default ProceedButton;
