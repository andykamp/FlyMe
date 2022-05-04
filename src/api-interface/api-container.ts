import { FlightApi } from "./flight-api";

class ApiContainer {
  serverAddress: null | string;
  FlightApi: FlightApi;
  constructor() {
    this.serverAddress = null;
    this.FlightApi = new FlightApi(this.serverAddress);
  }

  setServer(_serverAddress: string) {
    this.serverAddress = _serverAddress;
    this.FlightApi.setServer(this.serverAddress);
  }
}
const apiContainer = new ApiContainer();
export default apiContainer;
