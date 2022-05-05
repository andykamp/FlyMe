interface CallEndpointProps {
  url: string;
  method?: string;
  body?: object;
  decode?: any;
  contentType?: string;
  compression?: string;
}
export function callEndpoint({
  url,
  method = "GET",
  decode = (x: XMLHttpRequest) => JSON.parse(x.response),
  body = {},
  contentType = "application/json",
  compression,
}: CallEndpointProps) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {};
    xhr.onreadystatechange = function () {
      // In local files, status is 0 upon success in Mozilla Firefox
      if (xhr.readyState === XMLHttpRequest.DONE) {
        var status = xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          resolve(decode(xhr));
        } else {
          console.log(xhr.response);
          reject();
        }
      }
    };
    xhr.open(method, url);
    if (contentType) xhr.setRequestHeader("Content-Type", contentType);
    if (compression) xhr.setRequestHeader("Payload-Encoding", compression);
    // TODO add caching logic
    // xhr.setRequestHeader("Cache-Control", "private, max-age=180");

    xhr.send(JSON.stringify(body));
  });
}

export function getApiUrl(
  endpointObj: any,
  endpointUrl: string,
  objectId: string
) {
  var s1 = endpointUrl ? endpointUrl : "";
  var s2 = objectId ? `/${objectId}` : "";
  return `${endpointObj.serverAddress}${endpointObj.endpointPrefix}${s1}${s2}`;
}

// ---------------------------------------------
// airport utils
// ---------------------------------------------
interface getFromToAirportProps {
  airport: string;
  from: object;
  to: object;
}
// find all flights that goes from a spesified airport to SOME other airport
export const getFromToAirport = ({
  airport,
  from,
  to,
}: getFromToAirportProps) => {
  const fromKeys = Object.keys(from);
  const toKeys = Object.keys(to);
  const flight_ids = new Set();
  for (let fk of fromKeys) {
    const source_airport = from[fk].source_airport.toLowerCase();
    const toFromAirport = from[fk].airport.toLowerCase();
    const arr_dep = from[fk].arr_dep;
    if (source_airport == airport || toFromAirport == airport)
      flight_ids.add(fk);
    // if (source_airport == airport && arr_dep == "A") arrivals.add(fk);
  }
  for (let tk of toKeys) {
    const cursorAirport = to[tk].source_airport.toLowerCase();
    if (cursorAirport == airport) flight_ids.add(tk);
    const source_airport = to[tk].source_airport.toLowerCase();
    const toFromAirport = to[tk].airport.toLowerCase();
    const arr_dep = to[tk].arr_dep;
    if (source_airport == airport || toFromAirport == airport)
      flight_ids.add(tk);
    // if (source_airport == airport && arr_dep == "D") departures.add(tk);
  }

  return [...flight_ids];
};

interface getFromToAirportsProps {
  fromAirport: string;
  toAirport: string;
  from: object;
  to: object;
}
// find all flights that goes from a spesified airport to a spesified other
export const getFromToAirports = ({
  fromAirport,
  toAirport,
  from,
  to,
}: getFromToAirportsProps) => {
  const fromKeys = Object.keys(from);
  const toKeys = Object.keys(to);
  const flight_ids = new Set();
  for (let fk of fromKeys) {
    const dep = from[fk].airport.toLowerCase();
    const arr = to[fk] && to[fk].airport.toLowerCase();
    if (dep == fromAirport && arr == toAirport) flight_ids.add(fk);
  }
  return [...flight_ids];
};

export function diff_hours(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}
