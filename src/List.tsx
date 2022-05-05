import { ApiContainer } from "./api-interface";
import { Tooltip } from "antd";
import {
  StyledListPanel,
  StyledList,
  StyledListItem,
  StyledTableValue,
  StyledTabs,
  StyledTab,
  StyledTitle,
  Row,
  Col,
} from "./styled-components";

interface FilteredListSeperatedProps {
  selectedAirport: string;
  flight_ids: string[];
  tab: "arrivals" | "departures";
  onTabChange: (name: "arrivals" | "departures") => void;
}

export const FilteredListSeperated = ({
  selectedAirport,
  flight_ids,
  tab,
  onTabChange,
}: FilteredListSeperatedProps) => {
  const uppercaseAirport = selectedAirport.toUpperCase();

  const flightsWithInfo = flight_ids.map((f) =>
    ApiContainer.FlightApi._getFlightInfo(f)
  );

  const arrivals = flightsWithInfo.filter(
    (f) => f.to_airport == uppercaseAirport
  );
  const departures = flightsWithInfo.filter(
    (f) => f.from_airport == uppercaseAirport
  );
  const arrivalsIsEmpty = !arrivals.length;
  const departureslsIsEmpty = !departures.length;
  return (
    <Col style={{ width: "100%" }}>
      <StyledTabs>
        <StyledTab
          active={tab == "arrivals"}
          onClick={() => onTabChange("arrivals")}
        >
          <StyledTitle>Arrivals</StyledTitle>
        </StyledTab>
        <StyledTab
          active={tab == "departures"}
          onClick={() => onTabChange("departures")}
        >
          <StyledTitle>Departures</StyledTitle>
        </StyledTab>
      </StyledTabs>
      <Row style={{ gap: 24, width: "100%" }}>
        {!arrivalsIsEmpty && tab == "arrivals" && (
          <StyledListPanel>
            <StyledList>
              <ListHeaderArrival />
              {arrivals.map((f, i) => (
                <ListItemArrival key={i} flightInfo={f} index={i} />
              ))}
            </StyledList>
          </StyledListPanel>
        )}
        {arrivalsIsEmpty && tab == "arrivals" && (
          <StyledListPanel>emptyyyy emptyyyy</StyledListPanel>
        )}
        {!departureslsIsEmpty && tab == "departures" && (
          <StyledListPanel>
            <StyledList>
              <ListHeaderDepartures />
              {departures.map((f, i) => (
                <ListItemDeparture key={i} flightInfo={f} index={i} />
              ))}
            </StyledList>
          </StyledListPanel>
        )}
        {departureslsIsEmpty && tab == "departures" && (
          <StyledListPanel>emptyyyy emptyyyy</StyledListPanel>
        )}
      </Row>
    </Col>
  );
};

export const ListHeaderArrival = () => {
  return (
    <StyledListItem header>
      <Row style={{ gap: 8 }}>
        <StyledTableValue header width={60}>
          Flight
        </StyledTableValue>
        <StyledTableValue header width={180}>
          Arrival
        </StyledTableValue>
        <StyledTableValue header width={200}>
          From
        </StyledTableValue>
      </Row>
      <StyledTableValue header width={150}>
        Remarks
      </StyledTableValue>
    </StyledListItem>
  );
};

export const ListHeaderDepartures = () => {
  return (
    <StyledListItem header>
      <Row style={{ gap: 8 }}>
        <StyledTableValue header width={60}>
          Flight
        </StyledTableValue>
        <StyledTableValue header width={180}>
          Departure
        </StyledTableValue>
        <StyledTableValue header width={200}>
          Destination
        </StyledTableValue>
        <StyledTableValue header width={60}>
          Gate
        </StyledTableValue>
      </Row>
      <StyledTableValue header width={150}>
        Remarks
      </StyledTableValue>
    </StyledListItem>
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
    departureTimeFormatted,
    from_airport_full,
    from_city,
    arrivalStatus,
  } = flightInfo;

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <Row style={{ gap: 8 }}>
        <StyledTableValue width={60}>{flight_id}</StyledTableValue>
        <StyledTableValue width={180}>
          {arrivalTimeFormatted} (departed {departureTimeFormatted})
        </StyledTableValue>
        <Tooltip title={from_airport_full}>
          <StyledTableValue width={200}>{from_city}</StyledTableValue>
        </Tooltip>
      </Row>
      <StyledTableValue width={150}>{arrivalStatus}</StyledTableValue>
    </StyledListItem>
  );
};
export const ListItemDeparture = ({ flightInfo, index }: ListItemInterface) => {
  const {
    flight_id,
    arrivalTimeFormatted,
    departureTimeFormatted,
    to_airport_full,
    to_city,
    gate,
    departureStatus,
  } = flightInfo;

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <Row style={{ gap: 8 }}>
        <StyledTableValue width={60}>{flight_id}</StyledTableValue>
        <StyledTableValue width={180}>
          {departureTimeFormatted} (arrives {arrivalTimeFormatted})
        </StyledTableValue>
        <Tooltip title={to_airport_full}>
          <StyledTableValue width={200}>{to_city}</StyledTableValue>
        </Tooltip>
        <StyledTableValue width={60}>{gate}</StyledTableValue>
      </Row>
      <StyledTableValue width={150}>{departureStatus}</StyledTableValue>
    </StyledListItem>
  );
};
