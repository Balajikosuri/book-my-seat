import { Component } from "react";

import "./index.css";

class Seat extends Component {
  state = {
    activeSeatNum: "",
    activeId: null,
  };

  doUnselect = async (id) => {
    const { isActive } = this.state;
    const { getSeatsFromApi } = this.props;
    const options = {
      method: "PUT",
    };

    isActive
      ? await fetch(`http://localhost:8080/seats/${id}`, options, () => {
          getSeatsFromApi();
        })
      : await fetch(`http://localhost:8080/dseats/${id}`, options, () => {
          getSeatsFromApi();
        });
  };

  onClickSeat = async (id) => {
    const url = `http://localhost:8080/seats/${id}`;
    const options = {
      method: "PUT",
    };
    await fetch(url, options);
    // console.log(id);
  };

  render() {
    const { activeId } = this.state;

    // const isActive = this.toggleOfSeat(activeSeatNum);
    // console.log(this.toggleOfSeat(activeSeatNum));
    const { seatData, setActiveSeatId, getSeatsFromApi } = this.props;
    const { seatNumberInRow, isBooked, row, id, seatReserved } = seatData;

    return (
      <button
        id="seat-btn"
        // disabled={isBooked}
        value={`${row}_${seatNumberInRow}`}
        className={`btn btn-outline-success seat-btn m-0 p-0 ${
          isBooked && "booked-seat"
        }    ${isBooked && seatReserved !== null && "booked-seat"}`}
        type="button"
        disabled={isBooked}
        onClick={(e) => {
          this.onClickSeat(id);
          getSeatsFromApi();
        }}
      >
        {seatNumberInRow}
      </button>
    );
  }
}

export default Seat;
