import { ApiContainer } from "./api-interface";
import { diff_hours } from "./api-interface/utils";
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
  // arrival is every airport in 'from' dict that has the .aiport that we target
  // departure is every airport in 'to' dict that has the .aiport that we target
  return (
    <Row style={{ gap: 8 }}>
      <StyledList>
        {flight_ids
          .filter((f) => to[f] && to[f].airport == uppercaseAirport)
          .map((f, i) => (
            <ListItemArrival
              key={f}
              flight_id={f}
              from={from[f]}
              to={to[f]}
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
              flight_id={f}
              from={from[f]}
              to={to[f]}
              index={i}
            />
          ))}
      </StyledList>
    </Row>
  );
};

interface FilteredListProps {
  flight_ids: string[];
  from: any;
  to: any;
}

export const FilteredList = ({ flight_ids, from, to }: FilteredListProps) => {
  return (
    <StyledList>
      {flight_ids.map((f, i) => (
        <ListItem flight_id={f} from={from[f]} to={to[f]} index={i} />
      ))}
    </StyledList>
  );
};

interface ListItemInterface {
  flight_id: string;
  from: FlightInterface;
  to: FlightInterface;
  index: number;
}

export const ListItemArrival = ({
  flight_id,
  from,
  to,
  index,
}: ListItemInterface) => {
  if (!to) to = { source_airport: "unknown", airport: "unknown" };
  if (!from) from = { source_airport: "unknown", airport: "unknown" };
  const fromAirport = to.source_airport;

  const date = new Date(from.schedule_time);
  const dateFormatted = from.schedule_time
    ? `${date.getHours()}:${date.getMinutes()}`
    : "-";

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <div>{flight_id}</div>
      <Row style={{ gap: 8 }}>
        <div>{dateFormatted}</div>
      </Row>
      <Row style={{ gap: 8 }}>
        <Tooltip
          title={
            ApiContainer.FlightApi.airportCodeToName[
              fromAirport.toLowerCase()
            ] || "unknown"
          }
        >
          <div>{fromAirport}</div>
        </Tooltip>
      </Row>
      <Status />
    </StyledListItem>
  );
};

export const ListItemDeparture = ({
  flight_id,
  from,
  to,
  index,
}: ListItemInterface) => {
  if (!from) from = { source_airport: "unknown", airport: "unknown" };
  if (!to) to = { source_airport: "unknown", airport: "unknown" };

  const toAirport = from.source_airport;

  const date = new Date(to.schedule_time);
  const dateFormatted = to.schedule_time
    ? `${date.getHours()}:${date.getMinutes()}`
    : "-";
  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <div>{flight_id}</div>
      <Row style={{ gap: 8 }}>
        <div>{dateFormatted}</div>
      </Row>
      <Row style={{ gap: 8 }}>
        <Tooltip
          title={
            ApiContainer.FlightApi.airportCodeToName[toAirport.toLowerCase()] ||
            "unknown"
          }
        >
          <div>{toAirport}</div>
        </Tooltip>
      </Row>
      <Status />
    </StyledListItem>
  );
};

export const ListItem = ({ flight_id, from, to, index }: ListItemInterface) => {
  if (!from) from = { airport: "unknown" };
  if (!to) to = { airport: "unknown" };
  const fromAirport = from.airport.toLowerCase();
  const toAirport = to.airport.toLowerCase();
  const fromDate = new Date(from.schedule_time);
  const toDate = new Date(to.schedule_time);
  const diffHours = diff_hours(fromDate, toDate) + "h";

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <div>{from.flight_id}</div>
      <Row style={{ gap: 8 }}>
        <div>{`${fromDate.getHours()}:${fromDate.getMinutes()}`}</div>
        <div>-</div>
        <div>{`${toDate.getHours()}:${toDate.getMinutes()}`}</div>
        <div>{diffHours}</div>
        {from.via_airport && <div>{from.via_airport}</div>}
        {!from.via_airport && <div>(Direct flight)</div>}
      </Row>
      <Row style={{ gap: 8 }}>
        <Tooltip
          title={
            ApiContainer.FlightApi.airportCodeToName[fromAirport] || "unknown"
          }
        >
          <div>{from.airport}</div>
        </Tooltip>
        <div>-</div>
        <Tooltip
          title={
            ApiContainer.FlightApi.airportCodeToName[toAirport] || "unknown"
          }
        >
          <div>{to.airport}</div>
        </Tooltip>
      </Row>
      <Row style={{ gap: 8 }}>
        <StyledLabel>Gate: </StyledLabel>
        <StyledValue>{from.gate || "_"}</StyledValue>
      </Row>
      <Status status={to.status} />
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
