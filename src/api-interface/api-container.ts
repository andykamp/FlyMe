import { FlightApi } from "./flight-api";
import { StatusApi } from "./status-api";
import { AirlinesApi } from "./airline-api";

const SERVER_API = "https://flydata.avinor.no";
// const SERVER_API = "https://agile-wave-55549.herokuapp.com/" + "flydata.avinor.no"
class ApiContainer {
  serverAddress: null | string;
  FlightApi: FlightApi;
  AirlinesApi: AirlinesApi;
  StatusApi: StatusApi;
  constructor() {
    this.serverAddress = SERVER_API;
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
