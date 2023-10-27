import { Component } from "react";

import "./index.css";
import CustomHoverAlert from "../CustomHoverAlert";
import { memo } from "react";

class Seat extends Component {
  state = {
    activeSeatNum: "",
    activeId: null,
    showErrorMsg: false,
  };

  onClickSeat = async (id) => {
    const { seatData, getSeatsFromApi, ticketTypeSelected, quantitySelected } =
      this.props;
    const url = `http://localhost:8080/toggle-seat-selection/${id}?limit=${quantitySelected}&type=${ticketTypeSelected}`;
    const options = {
      method: "PUT",
    };
    const { type } = seatData;

    if (type !== ticketTypeSelected) {
      this.setState({ showErrorMsg: true });
      alert("Invalid Seat type !");
    }
    if (quantitySelected !== "" && ticketTypeSelected !== "") {
      await fetch(url, options, () => {
        getSeatsFromApi();
      });
    } else {
      alert("please select Type and Quantity of the tickets");
    }

    // console.log(id);
  };

  render() {
    // const { activeId } = this.state;

    // const isActive = this.toggleOfSeat(activeSeatNum);
    // console.log(this.toggleOfSeat(activeSeatNum));
    const { seatData, onSelect, getSeatsFromApi} =
      this.props;
    const { seatNumberInRow, isBooked, row, id, seatReserved, type } = seatData;
    const { showErrorMsg } = this.state;

    return (
      <>
        <CustomHoverAlert open={showErrorMsg} />
        <button
          id="seat-btn"
          value={`${row}_${seatNumberInRow}`}
          className={`btn btn-outline-success seat-btn m-0 p-0     ${
            seatReserved && "booked-seat btn-secondary"
          }  ${isBooked && "btn-success text-light"} ${
            type === "Premium" && "btn border-warning"
          }`}
          // ${isBooked && seatReserved !== null && "booked-seat"}
          type="button"
          disabled={seatReserved}
          onClick={(e) => {
            this.onClickSeat(id);
            onSelect(showErrorMsg);
            getSeatsFromApi();
          }}
        >
          {seatNumberInRow}
        </button>
      </>
    );
  }
}

export default memo(Seat);
