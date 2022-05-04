import { BaseEndpoint } from "./base-endpoint";
import { callEndpoint } from "./utils";
import X2JS from "x2js";
import { airportsInNorway } from "../data";
import { diff_hours } from "./utils";

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

export interface FlightInterface {
  airline: string;
  flight_id: number;
  dom_int: string;
  schedule_time: string;
  arr_dep: string;
  airport: string;
  check_in: string;
  delayed: string;
  gate?: string;
  via_airport?: string;
  status: FlightStatusInterface;
  _uniqueID: string;
  source_airport: string;
}

export interface FlightStatusInterface {
  code: string;
  time: string;
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

interface pollFullDataProps {
  callback: void;
  onUpdate: (arg0: boolean) => void;
  waitTime: number;
}

interface pollAiportDataProps extends pollFullDataProps {
  airport: string;
}
// ---------------------------------------------
// Flight api class
// ---------------------------------------------

export class FlightApi extends BaseEndpoint {
  airportCodeToName: any;
  departures: { [key: string]: FlightInterface } = {};
  arrivals: { [key: string]: FlightInterface } = {};

  constructor(_serverAddress: null | string) {
    super(_serverAddress);
    // initiate a codeToName lookup
    this._createAirportLookup();
  }

  // ---------------------------------------------
  //  Helper lookup methods
  // ---------------------------------------------

  _createAirportLookup = () => {
    this.airportCodeToName = {};
    airportsInNorway.forEach((a) => {
      this.airportCodeToName[a.code.toLowerCase()] = a.name;
    });
  };

  //

  _isNorwegianAirport = (targetA: string) => {
    return Boolean(this.airportCodeToName[targetA.toLowerCase()]);
  };

  _getFlightInfo = (flight_id: string) => {
    let departureInfoMissing = false,
      arrivalInfoMissing = false;
    let departureInfo = this.departures[flight_id];
    let arrivalInfo = this.arrivals[flight_id];
    if (!departureInfo) {
      departureInfo = {};
      departureInfoMissing = true;
    }

    if (!arrivalInfo) {
      arrivalInfo = {};
      arrivalInfoMissing = true;
    }

    if (departureInfoMissing && arrivalInfoMissing) {
      console.error("missing flight", flight_id);
      return {};
    }
    const readFrom = departureInfoMissing ? arrivalInfo : departureInfo;

    const dom_int_lookup = {
      D: "Domestic",
      I: "International",
      S: "Shengen",
    };

    // const diffHours = diff_hours(fromDate, toDate) + "h";
    // const date = new Date(to.schedule_time);
    // const dateFormatted = to.schedule_time
    //   ? `${date.getHours()}:${date.getMinutes()}`
    //   : "-";
    const info = {
      flight_id: flight_id,
      departureTime: departureInfo.schedule_time,
      arrivalTime: arrivalInfo.schedule_time,
      departureTimeFormatted: departureInfo.schedule_time,
      arrivalTimeFormatted: arrivalInfo.schedule_time,
      duration: "--",
      departureStatus: departureInfo.status,
      arrivalStatus: arrivalInfo.status,
      to_airport: departureInfo.airport,
      to_airport_full: this.airportCodeToName[
        departureInfo.airport.toLowerCase()
      ],
      to_city: this.airportCodeToName[
        departureInfo.airport.toLowerCase()
      ].split(" ")[0],
      from_airport: arrivalInfo.airport,
      from_airport_full: this.airportCodeToName[
        arrivalInfo.airport.toLowerCase()
      ],
      form_city: this.airportCodeToName[
        arrivalInfo.airport.toLowerCase()
      ].split(" ")[0],
      dom_int: dom_int_lookup[readFrom.dom_int] || "_",
      airline: "TODO", // airline_lookup[readFrom.airline]
      via_airport: "TODO",
      status: "TODOOOO",
    };
    console.log("infooo", info);
    return info;
  };

  // ---------------------------------------------
  // Polling
  // ---------------------------------------------

  async pollFullData({ callback, onUpdate, waitTime }: pollFullDataProps) {
    const pollFunc = async () => {
      onUpdate(true);
      const res = await this.getAirportDataFull();
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

  async getAirportDataFull() {
    // empty data
    this.departures = {};
    this.arrivals = {};

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
        if (f.arr_dep == "D") this.departures[f.flight_id] = f;
        else if (f.arr_dep == "A") this.arrivals[f.flight_id] = f;
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
  }

  async getPopulatedAirportData({ airport }: { airport: string }) {
    // empty data
    this.departures = {};
    this.arrivals = {};

    const t1_tot = performance.now();

    // get the selected airport
    const airportData = await this.getAirportData({
      airport: airport.toUpperCase(),
    });

    // read the aiports relevant to query further
    const { _name } = airportData.airport;

    let flights = airportData.airport.flights.flight;
    if (!flights) return;
    // handle edge-case where 1 flight is given as object and not list
    if (!Array.isArray(flights)) flights = [flights];

    // stack up all calls  in a promise array
    // we use a cache to not fetch the same airport info multiple times
    const cache: { [key: string]: boolean } = {};
    const promises = [];
    for (let f of flights) {
      // if (!this._isNorwegianAirport(airport)) continue;
      if (f.dom_int != "D") continue;
      // also add the airport to the  lookup
      f.source_airport = _name;
      if (f.arr_dep == "D") this.departures[f.flight_id] = f;
      else if (f.arr_dep == "A") this.arrivals[f.flight_id] = f;

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
    for (let data of allData) {
      let flights = data.airport.flights.flight;
      if (!flights) continue;
      // handle edge-case where 1 flight is given as object and not list
      if (!Array.isArray(flights)) flights = [flights];
      // loop trough flights and cache get airports
      for (let f of flights) {
        // if (!this._isNorwegianAirport(airport)) continue;
        // if (f.dom_int != "D") continue;
        if (f.airport.toLowerCase() != airport) continue;
        // TODO make sure it is domestic!!!
        // add info about what airport it
        f.source_airport = data.airport._name;
        if (f.arr_dep == "D") this.departures[f.flight_id] = f;
        else if (f.arr_dep == "A") this.arrivals[f.flight_id] = f;
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
