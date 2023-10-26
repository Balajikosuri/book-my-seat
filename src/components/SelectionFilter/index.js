import React from "react";

const SelectionFilter = (props) => {
  const {
    onChangeTicketType,
    ticketTypeValue,
    QuantityValue,
    onChangeQuantity,
  } = props;
  return (
    <>
      <div className="styled-select">
        <select
          value={ticketTypeValue}
          onChange={(e) => onChangeTicketType(e)}
          className="btn btn-secondary pl-3 pr-5"
        >
          <option value="" disabled>
            -- Ticket Type --
          </option>
          <option value="Premium">Premium</option>
          <option value="Standard">Standard</option>
        </select>
      </div>
      <div className="number-dropdown ">
        <select
          value={QuantityValue}
          onChange={(e) => onChangeQuantity(e)}
          className="btn btn-secondary pl-3 pr-5"
        >
          <option value="" disabled>
            -- Q.ty --
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    </>
  );
};

export default SelectionFilter;
