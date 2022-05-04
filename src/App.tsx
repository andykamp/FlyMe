import { useState, useEffect } from "react";
import FlyMeLogo from "./FlyMeLogo.svg";
import { ApiContainer } from "./api-interface";
import { getFromToAirport } from "./api-interface/utils";
import { airportsInNorway } from "./data";
import { ThemeProvider } from "styled-components";
import { ThemeContext, getTheme } from "./theme";
import { Tabs, Select, Tooltip, Tag } from "antd";
import { CheckCircleOutlined, SyncOutlined } from "@ant-design/icons";
import {
  GlobalStyle,
  StyledApp,
  StyledHeader,
  StyledLogoContainer,
  StyledHeaderContent,
  StyledContent,
  StyledPanel,
  StyledTabs,
  StyledTitle,
  StyledSelect,
  StyledParagraph,
  StyledLink,
  Row,
  Col,
} from "./styled-components";
import { FilteredListSeperated } from "./List";

const { TabPane } = Tabs;
const { Option } = Select;

// https://avinor.no/konsern/tjenester/flydata/flydata-i-xml-format recommend polling
// airport data every 3 minutes, and more static resources (airlines, airports,
// status code) only every 24 hours

const ACTIVE_POLL_INTERVAL = 30 * 1000; // 3 minutes as suggested in doc
const REFERENCE_POLL_INTERVAL = 24 * 3600 * 1000; // 24 hours as suggested in doc

//

//const getData = async () => {
//  setLoading(true);
//  setFullData(null);
//  const airports = await ApiContainer.FlightApi.getAirports();
//  const airlines = await ApiContainer.FlightApi.getAirlines();
//  const statusConfig = await ApiContainer.FlightApi.getStatusConfig();
//  // const query = await ApiContainer.FlightApi.query({
//  //   query: "TimeFrom=1&TimeTo=24&airport=OSL&lastUpdate=2022-04-20T15:00:00Z",
//  // });
//  const fullData = await ApiContainer.FlightApi.getAirportDataFull({
//    airport: "OSL",
//    timeFrom: 0,
//    timeTo: 24,
//  });
//  console.log("airports", airports);
//  console.log("airlines", airlines);
//  console.log("statusConfig", statusConfig);
//  console.log("fullData", fullData);
//  setAirports(airports);
//  setAirlines(airlines);
//  setStatusConfig(statusConfig);
//  setFullData(fullData);
//  //
//  setLoading(false);
//};

function App() {
  const [selectedTheme, setSelectedTheme] = useState(getTheme("dark"));
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<null | string>(null);
  const [dataLastUpdated, setDataLastUpdated] = useState(0);
  const [filteredFromAirport, setFilteredFromAirport] = useState([]);
  const [tab, setTab] = useState("1");
  const [statusCodes, setStatusCodes] = useState({});
  const [airlines, setAirlines] = useState({});

  useEffect(() => {
    ApiContainer.setServer("https://flydata.avinor.no");
    // ApiContainer.setServer(
    //   "https://agile-wave-55549.herokuapp.com/" + "flydata.avinor.no"
    // );
    ApiContainer.StatusApi.pollStatusCodes({
      callback: (statusCodes) => {
        console.log("StatusCodes", statusCodes);
        setStatusCodes(statusCodes);
      },
      waitTime: REFERENCE_POLL_INTERVAL,
      onUpdate: (loading: boolean) => console.log("getStatuscodeee"),
    });
    ApiContainer.AirlinesApi.pollAirlines({
      callback: (airlines) => {
        console.log("airlines", airlines);
        setAirlines(airlines);
      },
      waitTime: REFERENCE_POLL_INTERVAL,
      onUpdate: (loading: boolean) => console.log("getStatuscodeee"),
    });
    console.log("mounttt");
  }, []);

  useEffect(() => {
    if (!selectedAirport) return;
    console.log("data is fetched and polling started");
    const { departures, arrivals } = ApiContainer.FlightApi;
    const filterFrom = getFromToAirport({
      airport: selectedAirport,
      from: arrivals,
      to: departures,
    });
    setFilteredFromAirport(filterFrom);
  }, [dataLastUpdated]);

  const airportChanged = (airport: string) => {
    setSelectedAirport(airport);
    setFilteredFromAirport([]);
    // we start a new poll every time the airport changes
    // ApiContainer.FlightApi.pollFullData({
    //   callback: () => {
    //     setDataLastUpdated(Date.now());
    //   },
    //   waitTime: ACTIVE_POLL_INTERVAL,
    //   onUpdate: (loading: boolean) => setLoading(loading),
    // });
    ApiContainer.FlightApi.pollAirportData({
      airport,
      callback: (res) => {
        console.log("Res", res);
        setDataLastUpdated(Date.now());
      },
      waitTime: ACTIVE_POLL_INTERVAL,
      onUpdate: (loading: boolean) => setLoading(loading),
    });
  };

  const toggleTheme = (): void => {
    let newTheme;

    if (selectedTheme.base == "dark") newTheme = getTheme("light");
    else newTheme = getTheme("dark");
    setSelectedTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={[selectedTheme, setSelectedTheme]}>
      <ThemeProvider theme={selectedTheme}>
        <GlobalStyle />

        <StyledApp>
          <StyledHeader>
            <StyledHeaderContent>
              <StyledLogoContainer>
                <img src={FlyMeLogo} alt="logo" />
                <StyledTitle>FlyMe</StyledTitle>
              </StyledLogoContainer>
              <Row style={{ gap: 8 }}>
                <div onClick={toggleTheme}>toggle theme</div>
                <div>
                  {loading ? (
                    <Tooltip title=" Syncing requested data with Avinor. FlyMe fetches data every 3 minutes. ">
                      <Tag
                        style={{ background: "rgba(0,0,0,0.2)" }}
                        icon={<SyncOutlined spin />}
                        color="processing"
                      >
                        Syncing data
                      </Tag>
                    </Tooltip>
                  ) : (
                    <Tooltip title=" All requested data is currently synced with Avinor. FlyMe fetches data every 3 minutes. ">
                      <Tag
                        style={{ background: "rgba(0,0,0,0.2)" }}
                        icon={<CheckCircleOutlined />}
                        color="success"
                      >
                        Data synced
                      </Tag>
                    </Tooltip>
                  )}
                </div>
              </Row>
            </StyledHeaderContent>
          </StyledHeader>
          <StyledContent>
            <StyledPanel>
              <StyledTitle>Some info about the site</StyledTitle>
              <StyledParagraph>
                Build Plugins add extra functionality to your site build.
                Plugins are created by developers at Netlify and in the
                community. All plugin support is provided by plugin authors.
              </StyledParagraph>
              <StyledLink
                onClick={() => window.open("www.avinor.no", "_blank")}
              >
                Flight data from avinor
              </StyledLink>
            </StyledPanel>
            <StyledPanel>
              <Col>
                <StyledTabs
                  defaultActiveKey={tab}
                  onChange={(val) => setTab(val)}
                >
                  <TabPane tab="Arrivals/Departures" key="1">
                    <Row>
                      <Col>
                        <StyledTitle>From:</StyledTitle>
                        <StyledSelect
                          style={{ width: 300 }}
                          onChange={airportChanged}
                          value={selectedAirport}
                          showSearch
                          placeholder="Search for airport"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.children
                              .toLowerCase()
                              .localeCompare(optionB.children.toLowerCase())
                          }
                        >
                          {airportsInNorway.map((a) => (
                            <Option
                              key={a.code}
                              value={a.code}
                            >{`(${a.code.toUpperCase()}) ${a.name}`}</Option>
                          ))}
                        </StyledSelect>
                      </Col>
                    </Row>
                  </TabPane>
                </StyledTabs>
              </Col>
            </StyledPanel>
            {loading && <div>loading....</div>}
            {selectedAirport && filteredFromAirport && tab == "1" && (
              <FilteredListSeperated
                selectedAirport={selectedAirport}
                flight_ids={filteredFromAirport}
              />
            )}
          </StyledContent>
        </StyledApp>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
