import { useState, useEffect } from "react";
import { createContext } from "react";
import { ApiContainer } from "./api-interface";
import { ThemeProvider } from "styled-components";
import { ThemeContext, getTheme } from "./theme";
import { Header } from "./header";
import { GlobalStyle, StyledApp, StyledContent } from "./styled-components";
import { LoadingScreen } from "./pages/loading-screen";
import { Outlet } from "react-router-dom";

// https://avinor.no/konsern/tjenester/flydata/flydata-i-xml-format recommend polling
// airport data every 3 minutes, and more static resources (airlines, airports,
// status code) only every 24 hours

const DYNAMIC_POLL_INTERVAL = 3 * 60 * 1000; // 3 minutes as suggested in doc
const STATIC_POLL_INTERVAL = 24 * 3600 * 1000; // 24 hours as suggested in doc

// create context for data

export const StatusCodeContext = createContext({});
export const AirlinesContext = createContext({});

//

function App() {
  const [selectedTheme, setSelectedTheme] = useState(getTheme("dark"));
  const [initiating, setInitiating] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [statusCodes, setStatusCodes] = useState({});
  const [airlines, setAirlines] = useState({});
  const [flightData, setFlightData] = useState(null);

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

    // poll actual data
    ApiContainer.FlightApi.pollFullData({
      callback: (res) => {
        setInitiating(false); // only neeeded after first fetch but easy to keep here and does no harm
        setFlightData(res);
      },
      waitTime: DYNAMIC_POLL_INTERVAL,
      onUpdate: (loading: boolean) => setLoading(loading),
      progressCallback: (p: number) => setProgress(p),
    });

    // cleanup at unmount
    return () => {
      ApiContainer.FlightApi.stopPolling();
      ApiContainer.StatusApi.stopPolling();
      ApiContainer.AirlinesApi.stopPolling();
    };
  }, []);

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
          <Header loading={loading} />
          <StatusCodeContext.Provider value={statusCodes}>
            <AirlinesContext.Provider value={airlines}>
              <Outlet context={[flightData, setFlightData]} />
              {initiating && <LoadingScreen progress={progress} />}
            </AirlinesContext.Provider>
          </StatusCodeContext.Provider>
        </StyledApp>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
