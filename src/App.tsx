import { useState, useEffect } from "react";
import FlyMeLogo from "./FlyMeLogo.svg";
import { ApiContainer } from "./api-interface";
import { getFromToAirport } from "./api-interface/utils";
import { airportsInNorway } from "./data";
import { ThemeProvider } from "styled-components";
import { ThemeContext, getTheme } from "./theme";
import { Select, Tooltip, Tag } from "antd";
import { CheckCircleOutlined, SyncOutlined } from "@ant-design/icons";
import {
  GlobalStyle,
  StyledApp,
  StyledHeader,
  StyledLogoContainer,
  StyledHeaderContent,
  StyledContent,
  StyledPanel,
  StyledTitle,
  StyledSelect,
  StyledParagraph,
  Row,
  StyledIntroItem,
  StyledIntroContainer,
} from "./styled-components";
import { FilteredListSeperated } from "./List";

const { Option } = Select;

// https://avinor.no/konsern/tjenester/flydata/flydata-i-xml-format recommend polling
// airport data every 3 minutes, and more static resources (airlines, airports,
// status code) only every 24 hours

const ACTIVE_POLL_INTERVAL = 30 * 1000; // 3 minutes as suggested in doc
const REFERENCE_POLL_INTERVAL = 24 * 3600 * 1000; // 24 hours as suggested in doc

//

function App() {
  const [selectedTheme, setSelectedTheme] = useState(getTheme("dark"));
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<null | string>(null);
  const [dataLastUpdated, setDataLastUpdated] = useState(0);
  const [filteredFromAirport, setFilteredFromAirport] = useState([]);
  const [statusCodes, setStatusCodes] = useState({});
  const [airlines, setAirlines] = useState({});
  const [tab, setTab] = useState<"arrivals" | "departures">("arrivals");

  useEffect(() => {
    // poll data straight away
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

    // cleanup
    return () => {
      console.log("cleanupppppp");
      ApiContainer.FlightApi.stopPolling();
      ApiContainer.StatusApi.stopPolling();
      ApiContainer.AirlinesApi.stopPolling();
    };
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
      callback: () => {
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
              <StyledIntroContainer>
                <StyledIntroItem>
                  <StyledTitle>
                    Select airport to see arrivals/departures
                  </StyledTitle>
                  <StyledParagraph>
                    FlyMe displays arrival/departure times using Avinor's open
                    API.
                    <br />
                    Read more about Avinor&nbsp;
                    <a href="https://www.avinor.no" target="_blank">
                      here
                    </a>
                    .
                  </StyledParagraph>
                  <StyledSelect
                    style={{ width: 300, marginTop: 8 }}
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
                </StyledIntroItem>
              </StyledIntroContainer>
            </StyledPanel>
            {false && selectedAirport && !loading && (
              <StyledIntroContainer style={{ padding: "0 24px" }}>
                <StyledIntroItem>
                  <StyledTitle>Arrivals</StyledTitle>
                </StyledIntroItem>
                <StyledIntroItem>
                  <StyledTitle>Departures</StyledTitle>
                </StyledIntroItem>
              </StyledIntroContainer>
            )}
            {selectedAirport && filteredFromAirport && (
              <FilteredListSeperated
                selectedAirport={selectedAirport}
                flight_ids={filteredFromAirport}
                onTabChange={setTab}
                tab={tab}
              />
            )}
          </StyledContent>
        </StyledApp>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
