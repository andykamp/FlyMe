import { ApiContainer } from "./api-interface";
import { Tooltip } from "antd";
import {
  StyledList,
  StyledListItem,
  StyledLabel,
  StyledValue,
  Row,
} from "./styled-components";
import {
  FlightInterface,
  FlightStatusInterface,
} from "./api-interface/flight-api";

interface FilteredListSeperatedProps {
  selectedAirport: string;
  flight_ids: string[];
  from: any;
  to: any;
}

export const FilteredListSeperated = ({
  selectedAirport,
  flight_ids,
  from,
  to,
}: FilteredListSeperatedProps) => {
  const uppercaseAirport = selectedAirport.toUpperCase();

  console.log("flight_ids", flight_ids);
  const both = flight_ids.filter((f) => from[f] && to[f]);
  console.log("both", both);
  const bb = both.map((f) => ({ id: f, from: from[f], to: to[f] }));
  console.log("bb", bb);
  flight_ids.forEach((f) => ApiContainer.FlightApi._getFlightInfo(f));

  // arrival is every airport in 'from' dict that has the .aiport that we target
  // departure is every airport in 'to' dict that has the .aiport that we target
  return (
    <Row style={{ gap: 8 }}>
      <StyledList>
        {flight_ids
          .filter((f) => to[f] && to[f].source_airport == uppercaseAirport)
          .map((f, i) => (
            <ListItemArrival
              key={f}
              flightInfo={ApiContainer.FlightApi._getFlightInfo(f)}
              index={i}
            />
          ))}
      </StyledList>
      <StyledList>
        {flight_ids
          .filter((f) => from[f] && from[f].airport == uppercaseAirport)
          .map((f, i) => (
            <ListItemDeparture
              key={f}
              flightInfo={ApiContainer.FlightApi._getFlightInfo(f)}
              index={i}
            />
          ))}
      </StyledList>
    </Row>
  );
};

interface ListItemInterface {
  flightInfo: any;
  index: number;
}

export const ListItemArrival = ({ flightInfo, index }: ListItemInterface) => {
  const {
    flight_id,
    arrivalTimeFormatted,
    from_airport,
    from_city,
    arrivalStatus,
  } = flightInfo;

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <div>{flight_id}</div>
      <Row style={{ gap: 8 }}>
        <div>{arrivalTimeFormatted}</div>
      </Row>
      <Row style={{ gap: 8 }}>
        <Tooltip title={from_city}>
          <div>{from_airport}</div>
        </Tooltip>
      </Row>
      <Status status={arrivalStatus} />
    </StyledListItem>
  );
};

export const ListItemDeparture = ({ flightInfo, index }: ListItemInterface) => {
  const {
    flight_id,
    departureTimeFormatted,
    to_airport,
    to_city,
    departureStatus,
  } = flightInfo;

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <div>{flight_id}</div>
      <Row style={{ gap: 8 }}>
        <div>{departureTimeFormatted}</div>
      </Row>
      <Row style={{ gap: 8 }}>
        <Tooltip title={to_city}>
          <div>{to_airport}</div>
        </Tooltip>
      </Row>
      <Status status={departureStatus} />
    </StyledListItem>
  );
};

export const Status = ({ status }: FlightStatusInterface) => {
  const defaultRemark = "On time";
  return (
    <Row style={{ gap: 8 }}>
      <StyledLabel>Remark: </StyledLabel>
      <StyledValue>
        {status ? status._code || defaultRemark : defaultRemark}
      </StyledValue>
    </Row>
  );
};
