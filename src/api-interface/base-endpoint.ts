import { callEndpoint } from "./utils";
import { pollResource } from "./polling";

export class BaseEndpoint {
  serverAddress: null | string;
  pollResource: pollResource | null = null;
  constructor(_serverAddress: null | string) {
    this.serverAddress = _serverAddress;
  }

  setServer(_serverAddress: string) {
    this.serverAddress = _serverAddress;
  }

  getApiUrl(objectId: string, endpointUrl: string) {
    var s1 = objectId ? `/${objectId}` : "";
    var s2 = endpointUrl ? endpointUrl : "";
    return `${this.serverAddress}${s1}${s2}`;
  }

  stopPolling() {
    if (this.pollResource) this.pollResource.stopPolling();
    this.pollResource = null;
  }

  startPolling() {
    if (this.pollResource) this.pollResource.startPolling();
  }

  createPollResource({
    pollFunc,
    callback,
    waitTime,
  }: {
    pollFunc: any;
    callback: any;
    waitTime: number;
  }) {
    this.stopPolling();
    this.pollResource = new pollResource({ pollFunc, callback, waitTime });
    this.startPolling();
  }
}
