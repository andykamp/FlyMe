import { ApiContainer } from "./api-interface";
import { Tooltip } from "antd";
import { FlightInterface, EnrichedInfo } from "./api-interface/flight-api";
import {
  StyledListPanel,
  StyledList,
  StyledListItem,
  StyledTableValue,
  StyledTableValueStatus,
  StyledTabs,
  StyledTab,
  StyledTitle,
  Row,
  Col,
} from "./styled-components";

// ---------------------------------------------
// from-to list
// ---------------------------------------------

interface FilteredList {
  fromAirport: string;
  toAirport: string;
  flightData: {
    arrivals: { [key: string]: FlightInterface };
    departures: { [key: string]: FlightInterface };
    allFlightIds: string[];
  };
  airlines: { [key: string]: string };
  statusCodes: { [key: string]: string };
}

export const FilteredList = ({
  fromAirport,
  toAirport,
  flightData,
  statusCodes,
  airlines,
}: FilteredList) => {
  let relevantFlights: any;
  if (!fromAirport || !toAirport) relevantFlights = [];
  else
    relevantFlights = flightData.allFlightIds.filter((flight_id) => {
      const f =
        flightData.departures[flight_id] || flightData.arrivals[flight_id];

      return (
        f.source_airport.toUpperCase() === fromAirport.toUpperCase() &&
        f.airport === toAirport.toUpperCase()
      );
    });

  const sortArrivalfunc = (a: EnrichedInfo, b: EnrichedInfo) =>
    a.arrivalTimestamp - b.arrivalTimestamp;

  const flightsWithInfo = relevantFlights
    .map((f: string) =>
      ApiContainer.FlightApi._getEnrichedFlightInfo(
        f,
        flightData,
        airlines,
        statusCodes
      )
    )
    .sort(sortArrivalfunc);

  const isEmpty = !flightsWithInfo.length;

  return (
    <Row style={{ gap: 24, width: "100%" }}>
      {!isEmpty && (
        <StyledListPanel>
          <StyledList>
            <ListHeader />
            {flightsWithInfo.map((f, i) => (
              <ListItem key={i} flightInfo={f} index={i} />
            ))}
          </StyledList>
        </StyledListPanel>
      )}
      {isEmpty && (
        <StyledListPanel style={{ height: 80, padding: 24 }}>
          No results on this travel distance before today 23:59...
        </StyledListPanel>
      )}
    </Row>
  );
};

// ---------------------------------------------
// from -to list header and item
// ---------------------------------------------

export const ListHeader = () => {
  return (
    <StyledListItem header>
      <Row style={{ gap: 8 }}>
        <StyledTableValue header width={120}>
          Time
        </StyledTableValue>
        <StyledTableValue header width={150}>
          Airline
        </StyledTableValue>
        <StyledTableValue header width={100}>
          Flight
        </StyledTableValue>
      </Row>
      <StyledTableValue header width={150}>
        Remarks
      </StyledTableValue>
    </StyledListItem>
  );
};

export const ListItem = ({ flightInfo, index }: ListItemInterface) => {
  const {
    flight_id,
    arrivalTimeFormatted,
    departureTimeFormatted,
    departureStatus,
    airline,
  } = flightInfo;

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <Row style={{ gap: 8 }}>
        <StyledTableValue width={120}>
          {departureTimeFormatted}-{arrivalTimeFormatted}
        </StyledTableValue>
        <StyledTableValue width={150}>{airline}</StyledTableValue>
        <StyledTableValue width={100}>{flight_id}</StyledTableValue>
      </Row>
      <StyledTableValueStatus
        width={150}
        status={departureTimeFormatted == "-" ? "Unmapped" : departureStatus}
      >
        {departureTimeFormatted == "-" ? "Unmapped" : departureStatus}
      </StyledTableValueStatus>
    </StyledListItem>
  );
};

// ---------------------------------------------
//  Arrival/departure list
// ---------------------------------------------

interface FilteredListSeperatedProps {
  selectedAirport: string;
  tab: "arrivals" | "departures";
  onTabChange: (name: "arrivals" | "departures") => void;
  flightData: {
    arrivals: { [key: string]: FlightInterface };
    departures: { [key: string]: FlightInterface };
    allFlightIds: string[];
  };
  airlines: { [key: string]: string };
  statusCodes: { [key: string]: string };
}

export const FilteredListSeperated = ({
  selectedAirport,
  tab,
  onTabChange,
  flightData,
  statusCodes,
  airlines,
}: FilteredListSeperatedProps) => {
  const uppercaseAirport = selectedAirport.toUpperCase();

  const flightsWithInfo = flightData.allFlightIds.map((f: string) =>
    ApiContainer.FlightApi._getEnrichedFlightInfo(
      f,
      flightData,
      airlines,
      statusCodes
    )
  );

  const sortDeparturefunc = (a: EnrichedInfo, b: EnrichedInfo) =>
    a.departureTimestamp - b.departureTimestamp;
  const sortArrivalfunc = (a: EnrichedInfo, b: EnrichedInfo) =>
    a.arrivalTimestamp - b.arrivalTimestamp;

  const arrivals = flightsWithInfo
    .filter((f) => f.to_airport == uppercaseAirport)
    .sort(sortArrivalfunc);
  let departures = flightsWithInfo
    .filter((f) => f.from_airport == uppercaseAirport)
    .sort(sortDeparturefunc);

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
          <StyledListPanel style={{ height: 80, padding: 24 }}>
            No arrivals on this airport before today 23:59...
          </StyledListPanel>
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
          <StyledListPanel style={{ height: 80, padding: 24 }}>
            No departures on this airport before today 23:59...
          </StyledListPanel>
        )}
      </Row>
    </Col>
  );
};

// ---------------------------------------------
// from -to list header and item
// ---------------------------------------------

export const ListHeaderArrival = () => {
  return (
    <StyledListItem header>
      <Row style={{ gap: 8 }}>
        <StyledTableValue header width={60}>
          Time
        </StyledTableValue>
        <StyledTableValue header width={150}>
          Airline
        </StyledTableValue>
        <StyledTableValue header width={80}>
          Flight
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
          Time
        </StyledTableValue>
        <StyledTableValue header width={150}>
          Airline
        </StyledTableValue>
        <StyledTableValue header width={80}>
          Flight
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
    from_airport_full,
    from_city,
    arrivalStatus,
    airline,
  } = flightInfo;

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <Row style={{ gap: 8 }}>
        <StyledTableValue width={60}>{arrivalTimeFormatted}</StyledTableValue>
        <StyledTableValue width={150}>{airline}</StyledTableValue>
        <StyledTableValue width={80}>{flight_id}</StyledTableValue>
        <Tooltip title={from_airport_full}>
          <StyledTableValue width={200}>{from_city}</StyledTableValue>
        </Tooltip>
      </Row>
      <StyledTableValueStatus
        width={150}
        status={arrivalTimeFormatted == "-" ? "Unmapped" : arrivalStatus}
      >
        {arrivalTimeFormatted == "-" ? "Unmapped" : arrivalStatus}
      </StyledTableValueStatus>
    </StyledListItem>
  );
};
export const ListItemDeparture = ({ flightInfo, index }: ListItemInterface) => {
  const {
    flight_id,
    departureTimeFormatted,
    to_airport_full,
    to_city,
    gate,
    airline,
    departureStatus,
  } = flightInfo;

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <Row style={{ gap: 8 }}>
        <StyledTableValue width={60}>{departureTimeFormatted}</StyledTableValue>
        <StyledTableValue width={150}>{airline}</StyledTableValue>
        <StyledTableValue width={80}>{flight_id}</StyledTableValue>
        <Tooltip title={to_airport_full}>
          <StyledTableValue width={200}>{to_city}</StyledTableValue>
        </Tooltip>
        <StyledTableValue width={60}>{gate}</StyledTableValue>
      </Row>
      <StyledTableValueStatus
        width={150}
        status={departureTimeFormatted == "-" ? "Unmapped" : departureStatus}
      >
        {departureTimeFormatted == "-" ? "Unmapped" : departureStatus}
      </StyledTableValueStatus>
    </StyledListItem>
  );
};
