import { FlightApi } from "./flight-api";
import { StatusApi } from "./status-api";
import { AirlinesApi } from "./airline-api";

class ApiContainer {
  serverAddress: null | string;
  FlightApi: FlightApi;
  AirlinesApi: AirlinesApi;
  StatusApi: StatusApi;
  constructor() {
    this.serverAddress = null;
    this.FlightApi = new FlightApi(this.serverAddress);
    this.AirlinesApi = new AirlinesApi(this.serverAddress);
    this.StatusApi = new StatusApi(this.serverAddress);
  }

  setServer(_serverAddress: string) {
    this.serverAddress = _serverAddress;
    this.FlightApi.setServer(this.serverAddress);
    this.AirlinesApi.setServer(this.serverAddress);
    this.StatusApi.setServer(this.serverAddress);
  }
}
const apiContainer = new ApiContainer();
export default apiContainer;
