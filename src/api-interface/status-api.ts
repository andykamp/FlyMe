import { BaseEndpoint } from "./base-endpoint";
import { callEndpoint } from "./utils";
import X2JS from "x2js";

// ---------------------------------------------
// Types and interfaces
// ---------------------------------------------

interface pollStatusCodesProps {
  callback: void;
  onUpdate: (arg0: boolean) => void;
  waitTime: number;
}

// ---------------------------------------------
// Flight api class
// ---------------------------------------------

export class StatusApi extends BaseEndpoint {
  constructor(_serverAddress: null | string) {
    super(_serverAddress);
  }

  // ---------------------------------------------
  // Polling
  // ---------------------------------------------

  async pollStatusCodes({
    callback,
    onUpdate,
    waitTime,
  }: pollStatusCodesProps) {
    const pollFunc = async () => {
      onUpdate(true);
      const res = await this.getStatusCodes();
      onUpdate(false);
      return res;
    };

    super.createPollResource({ pollFunc, callback, waitTime });
  }

  // ---------------------------------------------
  // Fetches
  // ---------------------------------------------

  async getStatusCodes() {
    const url = this.getApiUrl("flightStatuses.asp?", "");
    const method = "GET";
    const body = {};
    const decode = (xhr: XMLHttpRequest) => new X2JS().xml2js(xhr.response);
    const contentType = "text/xml";
    return await callEndpoint({ url, method, body, decode, contentType });
  }
}
