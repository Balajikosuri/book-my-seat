import { Component } from "react";
import { format, startOfToday } from "date-fns";
import Seat from "../Seat";
import { v4 as uuidv4 } from "uuid";

import "./index.css";
import { MutatingDots } from "react-loader-spinner";
import SelectionFilter from "../SelectionFilter";
const today = startOfToday();
const formattedDate = format(today, "EEE MMM dd yyyy");

function splitArrayIntoParts(originalArray, chunkSize) {
  const result = [];

  for (let i = 0; i < originalArray.length; i += chunkSize) {
    const chunk = originalArray.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  loading: "LOADING",
  failed: "FAILED",
};

class SeatsLayout extends Component {
  state = {
    initialTotalSeatsList: [],
    apiStatus: apiStatusConstants.initial,
    chunkArray: [],
    totalAvilabelSeats: 0,
    ticketTypeSelected: "",
    quantitySelected: "",
    currentSeatsIDArray: null,
  };

  componentDidMount() {
    this.getSeatsFromApi();
  }

  onClickProceed = async () => {
    const options = {
      method: "PUT",
    };
    const currentSeatsIDArray = await fetch(
      "http://localhost:8080/get-current-booked-seats"
    );
    const arryData = await currentSeatsIDArray.json();
    // console.log(await currentSeatsIDArray);

    this.setState(
      {
        currentSeatsIDArray: arryData,
        ticketTypeSelected: "",
        quantitySelected: "",
      },
      this.getSeatsFromApi
    );
  };

  onChangeQuantity = (e) => {
    this.setState({ quantitySelected: e.target.value });
  };

  onChangeTicketType = (e) => {
    this.setState({ ticketTypeSelected: e.target.value });
  };

  getSeatsFromApi = async () => {
    this.setState({ apiStatus: apiStatusConstants.loading });
    try {
      const totalAvilabelSeatsObjRes = await fetch(
        "http://localhost:8080/totalAvilabelSeats"
      );
      const totalAvilabelSeatsObj = await totalAvilabelSeatsObjRes.json();
      const response = await fetch("http://localhost:8080/seats");
      const jsonData = await response.json();
      // console.log(jsonData);
      const chunkArray = splitArrayIntoParts(jsonData, 30);
      this.setState({
        initialTotalSeatsList: [...jsonData],
        apiStatus: apiStatusConstants.success,
        chunkArray,
        totalAvilabelSeats: totalAvilabelSeatsObj.remainingSeats,
      });
    } catch (error) {
      console.error(`Error While Fetching Data: ${error}`);
      this.setState({ apiStatus: apiStatusConstants.failed });
    }
  };

  renderLoader = () => (
    <div className="d-flex w-100 justify-content-center">
      <MutatingDots
        height="100"
        width="100"
        color="#4fa94d"
        secondaryColor="#4fa94d"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );

  renderSeatsPage = () => {
    const { chunkArray } = this.state;
    return (
      <table className="table  table-borderless border-0 ml-0 p-5">
        <tbody className="m-0 gap-2">
          {/* Premium */}
          <tr className="p-3 pt-5">
            <td>
              <h1 className="gold-upper mb-0 mt-3">Premium-Rs. 350.00</h1>
              <hr className="mb-3" />
            </td>
          </tr>
          <tr
            key={uuidv4()}
            className="d-flex flex-row justify-content-evenly m-0 table-row mb-2"
          >
            <td style={{ width: "80px" }}>
              <h1 className="m-0 pe-4 pt-1 seat pe-4">A</h1>
            </td>
            {chunkArray[0].map((seat) => {
              return (
                seat !== 0 && (
                  <td key={`${seat}${uuidv4()}`} className="p-1 m-0">
                    <Seat
                      setActiveSeatId={this.setActiveSeatId}
                      getSeatsFromApi={this.getSeatsFromApi}
                      key={seat.id}
                      seatData={seat}
                    />
                  </td>
                )
              );
            })}
          </tr>
          <tr
            key={uuidv4()}
            className="d-flex flex-row justify-content-evenly m-0 table-row mb-2"
          >
            <td style={{ width: "80px" }}>
              <h1 className="m-0 pe-4 pt-1 seat pe-4">B</h1>
            </td>
            {chunkArray[1].map((seat) => {
              return (
                seat !== 0 && (
                  <td key={`${seat}${uuidv4()}`} className="p-1 m-0">
                    <Seat
                      setActiveSeatId={this.setActiveSeatId}
                      getSeatsFromApi={this.getSeatsFromApi}
                      key={seat.id}
                      seatData={seat}
                    />
                  </td>
                )
              );
            })}
          </tr>
          <tr
            key={uuidv4()}
            className="d-flex flex-row justify-content-evenly m-0 table-row mb-3"
          >
            <td style={{ width: "80px" }}>
              <h1 className="m-0 pe-4 pt-1 seat pe-4">C</h1>
            </td>
            {chunkArray[2].map((seat) => {
              return (
                seat !== 0 && (
                  <td key={`${seat}${uuidv4()}`} className="p-1 m-0">
                    <Seat
                      setActiveSeatId={this.setActiveSeatId}
                      getSeatsFromApi={this.getSeatsFromApi}
                      key={seat.id}
                      seatData={seat}
                    />
                  </td>
                )
              );
            })}
          </tr>
          {/* Executive */}
          <tr className="p-3 pt-5">
            <td>
              <h1 className="gold-upper mb-0 mt-3">Standard-Rs. 250.00</h1>
              <hr className="mb-3" />
            </td>
          </tr>
          <tr
            key={uuidv4()}
            className="d-flex flex-row justify-content-evenly m-0 table-row mb-2"
          >
            <td style={{ width: "80px" }}>
              <h1 className="m-0 pe-4 pt-1 seat pe-4">D</h1>
            </td>
            {chunkArray[3].map((seat) => {
              return (
                seat !== 0 && (
                  <td key={`${seat}${uuidv4()}`} className="p-1 m-0">
                    <Seat
                      setActiveSeatId={this.setActiveSeatId}
                      getSeatsFromApi={this.getSeatsFromApi}
                      key={seat.id}
                      seatData={seat}
                    />
                  </td>
                )
              );
            })}
          </tr>
          <tr
            key={uuidv4()}
            className="d-flex flex-row justify-content-evenly m-0 table-row mb-2"
          >
            <td style={{ width: "80px" }}>
              <h1 className="m-0 pe-4 pt-1 seat pe-4">E</h1>
            </td>
            {chunkArray[4].map((seat) => {
              return (
                seat !== 0 && (
                  <td key={`${seat}${uuidv4()}`} className="p-1 m-0">
                    <Seat
                      setActiveSeatId={this.setActiveSeatId}
                      getSeatsFromApi={this.getSeatsFromApi}
                      key={seat.id}
                      seatData={seat}
                    />
                  </td>
                )
              );
            })}
          </tr>
          <tr
            key={uuidv4()}
            className="d-flex flex-row justify-content-evenly m-0 table-row mb-2"
          >
            <td style={{ width: "80px" }}>
              <h1 className="m-0 pe-4 pt-1 seat pe-4">F</h1>
            </td>
            {chunkArray[5].map((seat) => {
              return (
                seat !== 0 && (
                  <td key={`${seat}${uuidv4()}`} className="p-1 m-0">
                    <Seat
                      setActiveSeatId={this.setActiveSeatId}
                      getSeatsFromApi={this.getSeatsFromApi}
                      key={seat.id}
                      seatData={seat}
                    />
                  </td>
                )
              );
            })}
          </tr>
          <tr
            key={uuidv4()}
            className="d-flex flex-row justify-content-evenly m-0 table-row mb-2"
          >
            <td style={{ width: "80px" }}>
              <h1 className="m-0 pe-4 pt-1 seat pe-4">G</h1>
            </td>
            {chunkArray[6].map((seat) => {
              return (
                seat !== 0 && (
                  <td key={`${seat}${uuidv4()}`} className="p-1 m-0">
                    <Seat
                      setActiveSeatId={this.setActiveSeatId}
                      getSeatsFromApi={this.getSeatsFromApi}
                      key={seat.id}
                      seatData={seat}
                    />
                  </td>
                )
              );
            })}
          </tr>

          <tr
            key={uuidv4()}
            className="d-flex flex-row justify-content-evenly m-0 table-row mb-2"
          >
            <td style={{ width: "80px" }}>
              <h1 className="m-0 pe-4 pt-1 seat pe-4">H</h1>
            </td>
            {chunkArray[7].map((seat) => {
              return (
                seat !== 0 && (
                  <td key={`${seat}${uuidv4()}`} className="p-1 m-0">
                    <Seat
                      setActiveSeatId={this.setActiveSeatId}
                      getSeatsFromApi={this.getSeatsFromApi}
                      key={seat.id}
                      seatData={seat}
                    />
                  </td>
                )
              );
            })}
          </tr>
        </tbody>
      </table>
    );
  };

  renderFailed = () => {
    return <h1 className="text-danger">failed</h1>;
  };

  renderResultPage = () => {
    const { apiStatus } = this.state;
    switch (true) {
      case apiStatusConstants.loading === apiStatus:
        return this.renderLoader();

      case apiStatusConstants.failed === apiStatus:
        return this.renderFailed();

      case apiStatusConstants.success === apiStatus:
        return this.renderSeatsPage();

      default:
        return null;
    }
  };

  render() {
    const { totalAvilabelSeats } = this.state;
    return (
      <>
        <div className="container p-3">
          <nav className="d-flex flex-row  justify-content-lg-around ">
            <h1 className="text-primary book-my-seats-heading">Book My Seat</h1>
            <p className="ml-2">
              Today: <b>{formattedDate}</b>
            </p>
          </nav>

          <div></div>
          <div className="card p-3 pt-5 border mb-5 pb-3">
            <div className="w-100 d-flex justify-content-evenly">
              <SelectionFilter
                onChangeTicketType={this.onChangeTicketType}
                onChangeQuantity={this.onChangeQuantity}
              />
              <h3 className="btn btn-success btn-lg disabled text-align-left w-25 total-seats">
                Avilable Seats:{"  "}
                <b className="text-warning"> {totalAvilabelSeats}</b>
              </h3>
            </div>
            {this.renderResultPage()}
            <div className="w-100 text-center">
              <img
                src="https://res.cloudinary.com/dt4fj4qfl/image/upload/a_vflip//v1698160934/curved-screen.webp"
                alt="curved-screen"
              />
              <p className="text-secondary">All eyes this way please!</p>
            </div>
          </div>
        </div>

        <div className="w-100 fixed-bottom bg-secondary d-flex justify-content-center p-2">
          <button
            onClick={this.onClickProceed}
            type="button"
            className="btn btn-success text-center"
          >
            Book Ticket
          </button>
        </div>
      </>
    );
  }
}

export default SeatsLayout;
