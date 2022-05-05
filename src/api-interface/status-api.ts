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

export interface statusCodeInterface {
  _code: string;
  _statusTextEn: string;
  _statusTextNo: string;
}
interface statusCodesResponse {
  flightStatuses: {
    flightStatus: statusCodeInterface[];
  };
}

// ---------------------------------------------
//  Status api class
// ---------------------------------------------

export class StatusApi extends BaseEndpoint {
  constructor(_serverAddress: null | string) {
    super(_serverAddress);
  }

  async pollStatusCodes({
    callback,
    onUpdate,
    waitTime,
  }: pollStatusCodesProps) {
    const pollFunc = async () => {
      onUpdate(true);
      const res = await this.getStatusCodes();
      const statusLookup: { [key: string]: string } = {};
      const { flightStatus } = res.flightStatuses;
      for (let s of flightStatus) {
        statusLookup[s._code] = s._statusTextEn;
      }
      onUpdate(false);
      return statusLookup;
    };

    super.createPollResource({ pollFunc, callback, waitTime });
  }

  async getStatusCodes(): Promise<statusCodesResponse> {
    const url = this.getApiUrl("flightStatuses.asp?", "");
    const method = "GET";
    const body = {};
    const decode = (xhr: XMLHttpRequest) => new X2JS().xml2js(xhr.response);
    const contentType = "text/xml";
    return await callEndpoint({ url, method, body, decode, contentType });
  }
}
