import { BaseEndpoint } from "./base-endpoint";
import { callEndpoint } from "./utils";
import X2JS from "x2js";
import airportsInNorway from "../assets/airports-in-norway.json";
import { diff_hours, formatTo2Digits } from "./utils";
import { statusCodeInterface } from "./status-api";

// ---------------------------------------------
// Types and interfaces
// ---------------------------------------------

interface getAirportDataProps {
  airport: string;
  timeFrom?: number;
  timeTo?: number;
  direction?: string | null;
  lastUpdate?: string | null;
}

interface pollFullDataProps {
  callback: void;
  onUpdate: (arg0: boolean) => void;
  waitTime: number;
}

interface pollAiportDataProps extends pollFullDataProps {
  airport: string;
}

export interface FlightInterface {
  airline: string;
  flight_id: string;
  dom_int: string;
  schedule_time: string;
  arr_dep: string;
  airport: string;
  check_in: string;
  delayed: string;
  gate?: string;
  via_airport?: string;
  status?: statusCodeInterface;
  _uniqueID: string;
  source_airport: string;
}

interface AirportDataResponse {
  airport: {
    flights: {
      flight?: FlightInterface[] | FlightInterface;
      _lastUpdate: string;
    };
    _name: string;
  };
}

interface EnrichedInfo {
  flight_id: string;
  departureTime: string;
  arrivalTime: string;
  departureTimeFormatted: string;
  arrivalTimeFormatted: string;
  duration: string;
  departureStatus: string;
  arrivalStatus: string;
  to_airport: string;
  to_airport_full: string;
  to_city: string;
  from_airport: string;
  from_airport_full: string;
  from_city: string;
  dom_int: string;
  airline: string;
  via_airport?: string;
  status: string;
  gate?: string;
}

// ---------------------------------------------
// Flight api class
// ---------------------------------------------

export class FlightApi extends BaseEndpoint {
  airportCodeToName: any;

  constructor(_serverAddress: null | string) {
    super(_serverAddress);
    // initiate a codeToName lookup
    this._createAirportLookup();
  }

  // create a name lookup used to convert codes to names
  _createAirportLookup = () => {
    this.airportCodeToName = {};
    airportsInNorway.forEach((a) => {
      this.airportCodeToName[a.code.toLowerCase()] = a.name;
    });
  };

  //

  _getEnrichedFlightInfo = (
    flight_id: string,
    flightData: {
      arrivals: { [key: string]: FlightInterface };
      departures: { [key: string]: FlightInterface };
      allFlightIds: string[];
    },
    airlines: { [key: string]: string },
    statusCodes: { [key: string]: string }
  ): EnrichedInfo => {
    let departureInfo = flightData.departures[flight_id] || {};
    let arrivalInfo = flightData.arrivals[flight_id] || {};

    // in case of the flight did not connect we choose on of the flights to read basic info from
    const readFrom = flightData.departures[flight_id]
      ? arrivalInfo
      : departureInfo;

    const getFlightType = (dom_int: string): string => {
      switch (dom_int) {
        case "S":
          return "Shengen";
        case "D":
          return "Domestic";
        case "I":
          return "International";
        default:
          return "unknown";
      }
    };

    const getTime = (
      arrivalInfo: FlightInterface,
      departureInfo: FlightInterface
    ) => {
      const aDate = new Date(arrivalInfo.schedule_time);
      const dDate = new Date(departureInfo.schedule_time);

      const aDateFormatted = `${formatTo2Digits(
        aDate.getHours()
      )}:${formatTo2Digits(aDate.getMinutes())}`;
      const dDateFormatted = `${formatTo2Digits(
        dDate.getHours()
      )}:${formatTo2Digits(dDate.getMinutes())}`;

      const duration = diff_hours(dDate, aDate) + "h";
      return { duration, aDateFormatted, dDateFormatted };
    };

    const getFullName = (airport: string): string => {
      if (!airport) return "unknown";
      return this.airportCodeToName[airport.toLowerCase()] || "unknown";
    };

    const getStatus = (status: statusCodeInterface | undefined) => {
      if (!status || !status._code) return "";
      return statusCodes[status._code];
    };

    const getAirline = (airline: string) => {
      if (!airline) return "unknown";
      return airlines[airline];
    };

    const { duration, aDateFormatted, dDateFormatted } = getTime(
      arrivalInfo,
      departureInfo
    );

    return {
      flight_id: flight_id,
      departureTime: departureInfo.schedule_time,
      arrivalTime: arrivalInfo.schedule_time,
      departureTimeFormatted: dDateFormatted,
      arrivalTimeFormatted: aDateFormatted,
      duration,
      to_airport: departureInfo.airport,
      to_airport_full: getFullName(departureInfo.airport),
      to_city: getFullName(departureInfo.airport).split(" ")[0],
      from_airport: arrivalInfo.airport,
      from_airport_full: getFullName(arrivalInfo.airport),
      from_city: getFullName(arrivalInfo.airport).split(" ")[0],
      dom_int: getFlightType(readFrom.dom_int),
      airline: getAirline(readFrom.airline),
      status: getStatus(readFrom.status),
      departureStatus: getStatus(departureInfo.status),
      arrivalStatus: getStatus(arrivalInfo.status),
      gate: departureInfo.gate,
      via_airport: readFrom.via_airport,
    };
  };

  // ---------------------------------------------
  // Polling
  // ---------------------------------------------

  async pollFullData({
    callback,
    onUpdate,
    progressCallback,
    waitTime,
  }: pollFullDataProps) {
    const pollFunc = async () => {
      onUpdate(true);
      const res = await this.getAirportDataFull({ progressCallback });
      onUpdate(false);
      return res;
    };

    super.createPollResource({ pollFunc, callback, waitTime });
  }

  async pollAirportData({
    airport,
    callback,
    onUpdate,
    waitTime,
  }: pollAiportDataProps) {
    const pollFunc = async () => {
      onUpdate(true);
      const res = await this.getPopulatedAirportData({ airport });
      onUpdate(false);
      return res;
    };

    super.createPollResource({ pollFunc, callback, waitTime });
  }

  // ---------------------------------------------
  // Fetches
  // ---------------------------------------------

  async getAirportDataFull({ progressCallback }) {
    // init new data
    const departures: { [key: string]: FlightInterface } = {};
    const arrivals: { [key: string]: FlightInterface } = {};
    const allFlightIds: Set<string> = new Set();

    const t1_tot = performance.now();

    // stack up all calls  in a promise array
    const promises = [];
    for (let a of airportsInNorway) {
      const airport = a.code.toUpperCase();
      promises.push(
        this.getAirportData({
          airport,
          timeFrom: 0,
          timeTo: 24,
        })
      );
    }

    // add progress callbacks to the promises to get progressbar
    allProgress(promises, (p: number) => {
      console.log(`% Done = ${p.toFixed(2)}`);
      if (progressCallback) progressCallback(p.toFixed(2));
    });

    // await all promises
    const t1_fetch = performance.now();
    const allData = await Promise.all(promises);
    const t2_fetch = performance.now();
    console.log(
      `getAirportDataFull fetching took ${t2_fetch - t1_fetch} ms (${
        (t2_fetch - t1_fetch) / 100
      })s`
    );

    // parse result for all promises
    const t1_parse = performance.now();
    for (let airportData of allData) {
      const { _name } = airportData.airport;
      let flights = airportData.airport.flights.flight;
      if (!flights) continue;
      // handle edge-case where 1 flight is given as object and not list
      if (!Array.isArray(flights)) flights = [flights];
      // loop trough flights and cache  get airports
      for (let f of flights) {
        // add info about what airport it
        f.source_airport = _name;
        if (f.arr_dep == "D") departures[f.flight_id] = f;
        else if (f.arr_dep == "A") arrivals[f.flight_id] = f;
        allFlightIds.add(f.flight_id);
      }
    }

    const t2_parse = performance.now();
    console.log(
      `getAirportDataFull parsing took ${t2_parse - t1_parse} ms (${
        (t2_parse - t1_parse) / 100
      })s`
    );

    const t2_tot = performance.now();
    console.log(
      `getAirportDataFull total took ${t2_tot - t1_tot} ms (${
        (t2_tot - t1_tot) / 100
      })s`
    );

    return {
      arrivals,
      departures,
      allFlightIds: [...allFlightIds],
    };
  }

  async getPopulatedAirportData({ airport }: { airport: string }) {
    // init new data
    const departures: { [key: string]: FlightInterface } = {};
    const arrivals: { [key: string]: FlightInterface } = {};
    const allFlightIds: Set<string> = new Set();

    // get the selected airport first
    const airportData = await this.getAirportData({
      airport: airport.toUpperCase(),
    });

    // read the aiports relevant to query further
    const { _name } = airportData.airport;
    let flights = airportData.airport.flights.flight;
    if (!flights) return;
    if (!Array.isArray(flights)) flights = [flights];

    // stack up all calls  in a promise array
    const cache: { [key: string]: boolean } = {};
    const promises = [];
    for (let f of flights) {
      if (f.dom_int != "D") continue;
      f.source_airport = _name; // add info about what aiport request is made to
      if (f.arr_dep == "D") departures[f.flight_id] = f;
      else if (f.arr_dep == "A") arrivals[f.flight_id] = f;
      allFlightIds.add(f.flight_id);

      const { airport } = f;
      if (cache[airport]) continue;

      // add fetch of new data to the airport
      promises.push(
        this.getAirportData({
          airport,
          timeFrom: 0,
          timeTo: 24,
        })
      );
      cache[airport] = true;
    }

    // await all promises
    const allData = await Promise.all(promises);

    // parse result for all promises
    for (let data of allData) {
      let flights = data.airport.flights.flight;
      if (!flights) continue;
      if (!Array.isArray(flights)) flights = [flights];
      // loop trough flights and cache get airports
      for (let f of flights) {
        if (f.airport.toLowerCase() != airport) continue;
        // add info about what airport it
        f.source_airport = data.airport._name;
        if (f.arr_dep == "D") departures[f.flight_id] = f;
        else if (f.arr_dep == "A") arrivals[f.flight_id] = f;
        allFlightIds.add(f.flight_id);
      }
    }

    return {
      arrivals,
      departures,
      allFlightIds: [...allFlightIds],
    };
  }

  async getAirportData({
    airport,
    timeFrom = 0,
    timeTo = 24,
    direction = null,
    lastUpdate = null,
  }: getAirportDataProps): Promise<AirportDataResponse> {
    let queryString = `TimeFrom=${timeFrom}&TimeTo=${timeTo}&airport=${airport}`;

    if (direction) queryString += `&direction=${direction}`;
    if (lastUpdate) queryString += `&lastUpdate=${lastUpdate}`;
    const url = this.getApiUrl("XmlFeed.asp?", queryString);
    const method = "GET";
    const body = {};
    const decode = (xhr: XMLHttpRequest) => new X2JS().xml2js(xhr.response);

    const contentType = "text/xml";
    return await callEndpoint({ url, method, body, decode, contentType });
  }
}

// Unused code to poll and fetch all data. Eg for polling all data every 3 minutes

function allProgress(proms: any, progress_cb: (p: number) => void) {
  let d = 0;
  progress_cb(0);
  for (const p of proms) {
    p.then(() => {
      d++;
      progress_cb((d * 100) / proms.length);
    });
  }
  return Promise.all(proms);
}
