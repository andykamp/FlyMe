import { BaseEndpoint } from "./base-endpoint";
import { callEndpoint } from "./utils";
import X2JS from "x2js";

// ---------------------------------------------
// Types and interfaces
// ---------------------------------------------

interface pollAirportsProps {
  callback: void;
  onUpdate: (arg0: boolean) => void;
  waitTime: number;
}

// ---------------------------------------------
// Flight api class
// ---------------------------------------------

export class AirlinesApi extends BaseEndpoint {
  constructor(_serverAddress: null | string) {
    super(_serverAddress);
  }

  // ---------------------------------------------
  // Polling
  // ---------------------------------------------

  async pollAirlines({ callback, onUpdate, waitTime }: pollAirportsProps) {
    const pollFunc = async () => {
      onUpdate(true);
      const res = await this.getAirlines();
      onUpdate(false);
      return res;
    };

    super.createPollResource({ pollFunc, callback, waitTime });
  }

  // ---------------------------------------------
  // Fetches
  // ---------------------------------------------

  async getAirlines() {
    const url = this.getApiUrl("airlineNames.asp", "");
    const method = "GET";
    const body = {};
    const decode = (xhr: XMLHttpRequest) => new X2JS().xml2js(xhr.response);
    const contentType = "text/xml";
    return await callEndpoint({ url, method, body, decode, contentType });
  }
}
