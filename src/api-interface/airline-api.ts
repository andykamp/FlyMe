import { BaseEndpoint } from "./base-endpoint";
import { callEndpoint } from "./utils";
import X2JS from "x2js";

// ---------------------------------------------
// Types and interfaces
// ---------------------------------------------

interface pollAirportsProps {
  callback: void;
  waitTime: number;
}

export interface airlineInterface {
  _code: string;
  _name: string;
}
interface airlineResponse {
  airlineNames: {
    airlineName: airlineInterface[];
  };
}

// ---------------------------------------------
//  Airline api class
// ---------------------------------------------

export class AirlinesApi extends BaseEndpoint {
  constructor(_serverAddress: null | string) {
    super(_serverAddress);
  }

  async pollAirlines({ callback, waitTime }: pollAirportsProps) {
    const pollFunc = async () => {
      const res = await this.getAirlines();
      const airlineLookup: { [key: string]: string } = {};
      const { airlineName } = res.airlineNames;
      for (let s of airlineName) {
        airlineLookup[s._code] = s._name;
      }
      return airlineLookup;
    };

    super.createPollResource({ pollFunc, callback, waitTime });
  }

  async getAirlines(): Promise<airlineResponse> {
    const url = this.getApiUrl("airlineNames.asp", "");
    const method = "GET";
    const body = {};
    const decode = (xhr: XMLHttpRequest) => new X2JS().xml2js(xhr.response);
    const contentType = "text/xml";
    return await callEndpoint({ url, method, body, decode, contentType });
  }
}
