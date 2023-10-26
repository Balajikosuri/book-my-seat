import "./index.css";
import "reactjs-popup/dist/index.css";
import Popup from "reactjs-popup";

const CustomHoverAlert = (props) => {
  const { Component, open } = props;
  return (
    <Popup
      position="top center"
      closeOnDocumentClick
      className="pop-up-container w-100"
      open={open}
      modal
    >
      {(close) => (
        <div className="p-3 text-center text-capitalize  ">
          <h4 className="fs-6 mb-4">Please Select Seat Type and Quantity</h4>
          <p className="text-warning fw-bold">
            Premium Ticket: <b className="text-dark">Rs. 350/-</b>
          </p>
          <p className="text-success  fw-bold mt-0">
            Standard Ticket: <b className="text-dark">Rs. 250/-</b>
          </p>
          <div className="d-flex gap-2">{Component}</div>
          <button
            type="button"
            className="btn btn-success mt-5"
            onClick={close}
          >
            Continue Booking
          </button>
        </div>
      )}
    </Popup>
  );
};

export default CustomHoverAlert;
