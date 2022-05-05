import { useState, useEffect } from "react";
import Logo from "./logo.svg";
import { ApiContainer } from "./api-interface";
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

// https://avinor.no/konsern/tjenester/flydata/flydata-i-xml-format recommend polling
// airport data every 3 minutes, and more static resources (airlines, airports,
// status code) only every 24 hours

const DYNAMIC_POLL_INTERVAL = 3 * 60 * 1000; // 3 minutes as suggested in doc
const STATIC_POLL_INTERVAL = 24 * 3600 * 1000; // 24 hours as suggested in doc

//

function App() {
  const [selectedTheme, setSelectedTheme] = useState(getTheme("dark"));
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<null | string>(null);
  const [statusCodes, setStatusCodes] = useState({});
  const [airlines, setAirlines] = useState({});
  const [flightData, setFlightData] = useState(null);
  const [tab, setTab] = useState<"arrivals" | "departures">("arrivals");

  // start polling the static resources at mound
  useEffect(() => {
    // poll status codes
    ApiContainer.StatusApi.pollStatusCodes({
      callback: (statusCodes) => {
        setStatusCodes(statusCodes);
      },
      waitTime: STATIC_POLL_INTERVAL,
    });

    // poll airlines
    ApiContainer.AirlinesApi.pollAirlines({
      callback: (airlines) => {
        setAirlines(airlines);
      },
      waitTime: STATIC_POLL_INTERVAL,
    });

    // cleanup at unmount
    return () => {
      ApiContainer.FlightApi.stopPolling();
      ApiContainer.StatusApi.stopPolling();
      ApiContainer.AirlinesApi.stopPolling();
    };
  }, []);

  //  user changed the selected airport  by dropdown
  const airportChanged = (airport: string) => {
    setSelectedAirport(airport);

    ApiContainer.FlightApi.pollAirportData({
      airport,
      callback: (res) => {
        setFlightData(res);
      },
      waitTime: DYNAMIC_POLL_INTERVAL,
      onUpdate: (loading: boolean) => setLoading(loading),
    });
  };

  // toggle theme between light/datk
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
                <img src={Logo} alt="logo" />
                <StyledTitle>API Avinor</StyledTitle>
              </StyledLogoContainer>
              <Row style={{ gap: 8 }}>
                {/*<div onClick={toggleTheme}>toggle theme</div>*/}
                <div>
                  {loading ? (
                    <Tooltip title=" Syncing requested data with Avinor. This website fetches data every 3 minutes. ">
                      <Tag
                        style={{ background: "rgba(0,0,0,0.2)" }}
                        icon={<SyncOutlined spin />}
                        color="processing"
                      >
                        Syncing data
                      </Tag>
                    </Tooltip>
                  ) : (
                    <Tooltip title=" All requested data is currently synced with Avinor. This website fetches data every 3 minutes. ">
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
                      <Select.Option
                        key={a.code}
                        value={a.code}
                      >{`(${a.code.toUpperCase()}) ${a.name}`}</Select.Option>
                    ))}
                  </StyledSelect>
                </StyledIntroItem>
              </StyledIntroContainer>
            </StyledPanel>

            {loading && (
              <StyledIntroContainer style={{ padding: "0 24px" }}>
                <StyledIntroItem>
                  <Tag
                    style={{ background: "rgba(0,0,0,0.2)" }}
                    icon={<SyncOutlined spin />}
                    color="processing"
                  >
                    Loading data ...
                  </Tag>
                </StyledIntroItem>
              </StyledIntroContainer>
            )}

            {!loading && selectedAirport && flightData && (
              <FilteredListSeperated
                selectedAirport={selectedAirport}
                onTabChange={setTab}
                tab={tab}
                flightData={flightData}
                statusCodes={statusCodes}
                airlines={airlines}
              />
            )}
          </StyledContent>
        </StyledApp>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
