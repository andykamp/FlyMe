import { ApiContainer } from "./api-interface";
import { Tooltip } from "antd";
import {
  StyledListPanel,
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
}

export const FilteredListSeperated = ({
  selectedAirport,
  flight_ids,
}: FilteredListSeperatedProps) => {
  const uppercaseAirport = selectedAirport.toUpperCase();

  const flightsWithInfo = flight_ids.map((f) =>
    ApiContainer.FlightApi._getFlightInfo(f)
  );

  console.log("flightWidthInfo", flightsWithInfo);

  return (
    <StyledListPanel>
      <Row style={{ gap: 8 }}>
        <StyledList>
          {flightsWithInfo
            .filter((f) => f.to_airport == uppercaseAirport)
            .map((f, i) => (
              <ListItemArrival key={i} flightInfo={f} index={i} />
            ))}
        </StyledList>
        <StyledList>
          {flightsWithInfo
            .filter((f) => f.from_airport == uppercaseAirport)
            .map((f, i) => (
              <ListItemDeparture key={i} flightInfo={f} index={i} />
            ))}
        </StyledList>
      </Row>
    </StyledListPanel>
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
