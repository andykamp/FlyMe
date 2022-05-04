import { useState, useEffect } from "react";
import FlyMeLogo from "./FlyMeLogo.svg";
import { ApiContainer } from "./api-interface";
import {
  diff_hours,
  getFromToAirport,
  getFromToAirports,
} from "./api-interface/utils";
import airportsInNorway from "./data";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { ThemeInterface, ThemeContext, getTheme } from "./theme";
import { Tabs, Select, Tooltip, Tag } from "antd";
import {
  SwapOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
const { TabPane } = Tabs;
const { Option } = Select;

const GlobalStyle = createGlobalStyle<{ theme: ThemeInterface }>`
  body {
   // ---------------------------------------------
   // general
   // ---------------------------------------------
  
   font-size: ${(props) => props.theme.general.fontSize};
   font-family: ${(props) => props.theme.general.fontFamily};
   background: ${(props) => props.theme.general.bg}

// ---------------------------------------------
   // Ant d 
   // ---------------------------------------------
   .ant-select-dropdown {
     background-color: ${(props) => props.theme.general.bg} !important ;
     color: ${(props) => props.theme.general.textColor} !important;
     font-size: ${(props) => props.theme.general.fontSize} !important;
   }
   .ant-select-item{
     background-color: ${(props) => props.theme.general.bg};
     color: ${(props) => props.theme.general.textColor}; 
     font-size: ${(props) => props.theme.general.fontSize} !important;
   }
  
   .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
     font-weight: 600;
     color: ${(props) => props.theme.general.textColor}; 
     background-color: ${(props) => props.theme.general.greySelection};
   }
  
   .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
     background-color: ${(props) => props.theme.general.greySelectionHover};
   }
// empty box select
  .ant-select-dropdown-empty {
     background: ${(props) => props.theme.general.grey1} !important;
  }
  .ant-select-item-empty .ant-empty-small {
    // also possibel but not nessesarry because of .ant-select-dropdown-empty
     color: ${(props) => props.theme.general.textColor} !important; 
  }
  .ant-select-item-empty .ant-empty-small .ant-empty-image svg {
    filter: brightness(0) invert(0.8); // white ish filter
  }

`;

const StyledApp = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: ${(props) => props.theme.general.bg};
  color: ${(props) => props.theme.general.textColor};
`;

const StyledHeader = styled.header<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  min-height: 80px;
  padding: 0 24px;
  background: ${(props) => props.theme.header.headerBg};
  margin-bottom: 24px;
`;

const StyledLogoContainer = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

const StyledHeaderContent = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 75rem;
  max-width: 75rem;
`;

const StyledContent = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  overflow-y: scroll;
  width: 75rem;
  max-width: 75rem;
  gap: 24px;
`;

const StyledPanel = styled.div<{ theme: ThemeInterface }>`

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 24px;
  color: ${(props) => props.theme.general.titleColor};
  background: ${(props) => props.theme.general.panelBg};
  border: 1px solid #1c2126;
  border-radius: 8px;
}


`;

const StyledTabs = styled(Tabs)<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.textColor};
  font-size: ${(props) => props.theme.general.fontSizeTitle};
  font-weight: bold;
  > .ant-tabs-nav::before,
  .ant-tabs-bottom > .ant-tabs-nav::before,
  .ant-tabs-top > div > .ant-tabs-nav::before,
  .ant-tabs-bottom > div > .ant-tabs-nav::before {
    border-bottom: 1px solid ${(props) => props.theme.general.textColor};
  }
`;

const StyledSelect = styled(Select)<{ theme: ThemeInterface }>`
  width: 100%;
  color: ${(props) => props.theme.general.textColor};
  background-color: transparent;
  .ant-select-selector {
    border: ${(props) => "1px solid " + props.theme.general.grey1} !important;
    background-color: transparent !important;
  }
  .ant-select-arrow {
    font-size: 11px !important;
    color: ${(props) => props.theme.general.grey1};
  }
  // search
  .ant-select-selection-search-input {
  }
`;

const StyledListPanel = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  color: ${(props) => props.theme.general.titleColor};
  background: ${(props) => props.theme.general.panelBg};
  border: 1px solid #1c2126;
  border-radius: 8px;
`;

const StyledList = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow-y: scroll;
  background: ${(props) => props.theme.list.listBg};
`;

const StyledListItem = styled.div<{ theme: ThemeInterface; altNum: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0 24px;
  background: ${(props) =>
    props.altNum ? props.theme.list.listItemAltBg : props.theme.list.listBg};
`;

const StyledTitle = styled.div<{ theme: ThemeInterface }>`
  font-size: ${(props) => props.theme.general.fontSizeTitle};
  color: ${(props) => props.theme.general.titleColor};
  font-weight: bold;
`;

const StyledLabel = styled.div<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.textColor};
`;

const StyledValue = styled.div<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.titleColor};
`;

const StyledParagraph = styled.p<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.textColor};
  margin: 8px 0 0;
`;

const StyledLink = styled.div<{ theme: ThemeInterface }>`
  margin: 8px 0 0;
  font-weight: bold;
  color: ${(props) => props.theme.accent.green};
  text-decoration: underline;
  cursor: pointer;
`;

const StyledIconContainer = styled.div<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.textColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const FilteredListSeperated = ({ selectedAirport, flight_ids, from, to }) => {
  const uppercaseAirport = selectedAirport.toUpperCase();

  console.log("flight_ids", flight_ids);
  const both = flight_ids.filter((f) => from[f] && to[f]);
  console.log("both", both);
  const bb = both.map((f) => ({ id: f, from: from[f], to: to[f] }));
  console.log("bb", bb);
  // arrival is every airport in 'from' dict that has the .aiport that we target
  // departure is every airport in 'to' dict that has the .aiport that we target
  return (
    <Row style={{ gap: 8 }}>
      <StyledList>
        {flight_ids
          .filter((f) => to[f] && to[f].airport == uppercaseAirport)
          .map((f, i) => (
            <ListItemArrival
              key={f}
              flight_id={f}
              from={from[f]}
              to={to[f]}
              index={i}
            />
          ))}
      </StyledList>
      <StyledList>
        {flight_ids
          .filter((f) => from[f] && from[f].airport == uppercaseAirport)
          .map((f, i) => (
            <ListItemDeparture
              key={f}
              flight_id={f}
              from={from[f]}
              to={to[f]}
              index={i}
            />
          ))}
      </StyledList>
    </Row>
  );
};

const FilteredList = ({ flight_ids, from, to }) => {
  return (
    <StyledList>
      {flight_ids.map((f, i) => (
        <ListItem flight_id={f} from={from[f]} to={to[f]} index={i} />
      ))}
    </StyledList>
  );
};

const ListItemArrival = ({ flight_id, from, to, index }: ListItemInterface) => {
  if (!to) to = { source_airport: "unknown", airport: "unknown" };
  if (!from) from = { source_airport: "unknown", airport: "unknown" };
  const fromAirport = to.source_airport;

  const date = new Date(from.schedule_time);
  const dateFormatted = from.schedule_time
    ? `${date.getHours()}:${date.getMinutes()}`
    : "-";

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <div>{to.flight_id}</div>
      <Row style={{ gap: 8 }}>
        <div>{dateFormatted}</div>
      </Row>
      <Row style={{ gap: 8 }}>
        <Tooltip
          title={
            ApiContainer.FlightApi.airportCodeToName[
              fromAirport.toLowerCase()
            ] || "unknown"
          }
        >
          <div>{fromAirport}</div>
        </Tooltip>
      </Row>
      <Status />
    </StyledListItem>
  );
};

const ListItemDeparture = ({
  flight_id,
  from,
  to,
  index,
}: ListItemInterface) => {
  if (!from) from = { source_airport: "unknown", airport: "unknown" };
  if (!to) to = { source_airport: "unknown", airport: "unknown" };

  const toAirport = from.source_airport;

  const date = new Date(to.schedule_time);
  const dateFormatted = to.schedule_time
    ? `${date.getHours()}:${date.getMinutes()}`
    : "-";
  return (
    <StyledListItem altNum={index % 2 == 0}>
      <div>{from.flight_id}</div>
      <Row style={{ gap: 8 }}>
        <div>{dateFormatted}</div>
      </Row>
      <Row style={{ gap: 8 }}>
        <Tooltip
          title={
            ApiContainer.FlightApi.airportCodeToName[toAirport.toLowerCase()] ||
            "unknown"
          }
        >
          <div>{toAirport}</div>
        </Tooltip>
      </Row>
      <Status />
    </StyledListItem>
  );
};

const ListItem = ({ flight_id, from, to, index }: ListItemInterface) => {
  if (!from) from = { airport: "unknown" };
  if (!to) to = { airport: "unknown" };
  const fromAirport = from.airport.toLowerCase();
  const toAirport = to.airport.toLowerCase();
  const fromDate = new Date(from.schedule_time);
  const toDate = new Date(to.schedule_time);
  const diffHours = diff_hours(fromDate, toDate) + "h";

  return (
    <StyledListItem key={flight_id} altNum={index % 2 == 0}>
      <div>{from.flight_id}</div>
      <Row style={{ gap: 8 }}>
        <div>{`${fromDate.getHours()}:${fromDate.getMinutes()}`}</div>
        <div>-</div>
        <div>{`${toDate.getHours()}:${toDate.getMinutes()}`}</div>
        <div>{diffHours}</div>
        {from.via_airport && <div>{from.via_airport}</div>}
        {!from.via_airport && <div>(Direct flight)</div>}
      </Row>
      <Row style={{ gap: 8 }}>
        <Tooltip
          title={
            ApiContainer.FlightApi.airportCodeToName[fromAirport] || "unknown"
          }
        >
          <div>{from.airport}</div>
        </Tooltip>
        <div>-</div>
        <Tooltip
          title={
            ApiContainer.FlightApi.airportCodeToName[toAirport] || "unknown"
          }
        >
          <div>{to.airport}</div>
        </Tooltip>
      </Row>
      <Row style={{ gap: 8 }}>
        <StyledLabel>Gate: </StyledLabel>
        <StyledValue>{from.gate || "_"}</StyledValue>
      </Row>
      <Status />
    </StyledListItem>
  );
};
const Status = ({ status }) => {
  const defaultRemark = "On time";
  return (
    <Row style={{ gap: 8 }}>
      <StyledLabel>Remark: </StyledLabel>
      <StyledValue>
        {status ? status._code || defaultRemark : defaultRemark}
      </StyledValue>
    </Row>
  );
};

// https://avinor.no/konsern/tjenester/flydata/flydata-i-xml-format recommend polling
// airport data every 3 minutes, and more static resources (airlines, airports,
// status code) only every 24 hours

const ACTIVE_POLL_INTERVAL = 30 * 1000; // 3 minutes as suggested in doc
const REFERENCE_POLL_INTERVAL = 24 * 3600 * 1000; // 24 hours as suggested in doc

//

function App() {
  const [theme, setTheme] = useState(getTheme("dark"));
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [selectedAirportTo, setSelectedAirportTo] = useState(null);
  const [selectedAirportFrom, setSelectedAirportFrom] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [dataLastUpdated, setDataLastUpdated] = useState(0);
  const [airports, setAirports] = useState({});
  const [airlines, setAirlines] = useState({});
  const [statusConfig, setStatusConfig] = useState({});
  const [filteredFromAirport, setFilteredFromAirport] = useState([]);
  const [filteredFromToAirport, setFilteredFromToAirport] = useState([]);
  const [tab, setTab] = useState("1");

  useEffect(() => {
    ApiContainer.setServer("https://flydata.avinor.no");
    // ApiContainer.setServer(
    //   "https://agile-wave-55549.herokuapp.com/" + "flydata.avinor.no"
    // );
    console.log("mounttt");
  }, []);

  useEffect(() => {
    if (!selectedAirport) return;
    console.log("data is fetched and polling started");
    const { departures, arrivals } = ApiContainer.FlightApi;
    console.log("tofrom", departures, arrivals);
    const filterFrom = getFromToAirport({
      airport: selectedAirport,
      from: arrivals,
      to: departures,
    });
    console.log("filterSigle", filterFrom);
    setFilteredFromAirport(filterFrom);
  }, [dataLastUpdated]);

  const getData = async () => {
    setLoading(true);
    setFullData(null);
    const airports = await ApiContainer.FlightApi.getAirports();
    const airlines = await ApiContainer.FlightApi.getAirlines();
    const statusConfig = await ApiContainer.FlightApi.getStatusConfig();
    // const query = await ApiContainer.FlightApi.query({
    //   query: "TimeFrom=1&TimeTo=24&airport=OSL&lastUpdate=2022-04-20T15:00:00Z",
    // });
    const fullData = await ApiContainer.FlightApi.getAirportDataFull({
      airport: "OSL",
      timeFrom: 0,
      timeTo: 24,
    });
    console.log("airports", airports);
    console.log("airlines", airlines);
    console.log("statusConfig", statusConfig);
    console.log("fullData", fullData);
    setAirports(airports);
    setAirlines(airlines);
    setStatusConfig(statusConfig);
    setFullData(fullData);
    //
    setLoading(false);
  };

  const airportChanged = (airport: string) => {
    console.log("aiport", airport);
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
  const airportToChanged = (airport) => {
    setSelectedAirportTo(airport);
    if (!selectedAirportFrom) setFilteredFromToAirport([]);
    const filterFromTo = getFromToAirports({
      fromAirport: selectedAirportFrom,
      toAirport: airport,
      from: fullData.from,
      to: fullData.to,
    });
    console.log("filterMulti", filterFromTo);
    setFilteredFromToAirport(filterFromTo);
  };
  const airportFromChanged = (airport) => {
    setSelectedAirportFrom(airport);
    if (!selectedAirportTo) setFilteredFromToAirport([]);
    const filterFromTo = getFromToAirports({
      fromAirport: airport,
      toAirport: selectedAirportTo,
      from: fullData.from,
      to: fullData.to,
    });
    console.log("filterMulti", filterFromTo);
    setFilteredFromToAirport(filterFromTo);
  };

  const toggleTheme = () => {
    let newTheme;

    if (theme.base == "dark") newTheme = getTheme("light");
    else newTheme = getTheme("dark");
    setTheme(newTheme);
  };
  const getFlightsForSelectedAirport = () => {};

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <ThemeProvider theme={theme}>
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
                          placeholder="Select airport"
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
                  <TabPane tab="From/To" key="2">
                    <Row>
                      <Col>
                        <StyledTitle>From:</StyledTitle>
                        <Select
                          placeholder="Select airport"
                          style={{ width: 300 }}
                          onChange={airportFromChanged}
                          value={selectedAirportFrom}
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
                        </Select>
                      </Col>

                      <StyledIconContainer>
                        <SwapOutlined />
                      </StyledIconContainer>
                      <Col>
                        <StyledTitle>To:</StyledTitle>
                        <Select
                          placeholder="Select airport"
                          style={{ width: 300 }}
                          onChange={airportToChanged}
                          value={selectedAirportTo}
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
                        </Select>
                      </Col>
                    </Row>
                  </TabPane>
                </StyledTabs>
              </Col>
            </StyledPanel>
            <StyledListPanel>
              {loading && <div>loading....</div>}
              {selectedAirport && filteredFromAirport && tab == "1" && (
                <FilteredListSeperated
                  selectedAirport={selectedAirport}
                  flight_ids={filteredFromAirport}
                  from={ApiContainer.FlightApi.departures}
                  to={ApiContainer.FlightApi.arrivals}
                />
              )}
              {false && fullData && filteredFromAirport && tab == "1" && (
                <FilteredList
                  flight_ids={filteredFromAirport}
                  from={fullData.from}
                  to={fullData.to}
                />
              )}
              {fullData && filteredFromToAirport && tab == "2" && (
                <FilteredList
                  flight_ids={filteredFromToAirport}
                  from={fullData.from}
                  to={fullData.to}
                />
              )}
            </StyledListPanel>
          </StyledContent>
        </StyledApp>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
