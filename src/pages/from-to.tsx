import { useContext, useState } from "react";
import styled from "styled-components";
import airportsInNorway from "../assets/airports-in-norway.json";
import { Select, Tag } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import FromToImg from "../assets/from-to.svg";
import { StatusCodeContext, AirlinesContext } from "../app";
import {
  StyledContent,
  StyledPanel,
  StyledTitle,
  StyledSelect,
  StyledIntroItem,
  StyledIntroContainer,
  StyledFromToHeader,
} from "../styled-components";
import { FilteredList } from "../list";

interface Props {
  loading: any;
}

const StyledImg = styled.img`
  margin-top: 40px;
  object-fit: contain;
  width: 50%;
`;

export const FromTo = ({ loading }: Props) => {
  // TODO do this for ailines and status code also
  const [flightData, setFlightData] = useOutletContext();

  const statusCodes = useContext(StatusCodeContext);
  const airlines = useContext(AirlinesContext);

  const [fromAirport, setFromAirport] = useState<null | string>(null);
  const [toAirport, setToAirport] = useState<null | string>(null);
  const [tab, setTab] = useState<"arrivals" | "departures">("arrivals");

  //  user changed the selected airport  by dropdown
  const toChanged = (airport: string) => {
    setToAirport(airport);
  };

  const fromChanged = (airport: string) => {
    setFromAirport(airport);
  };

  return (
    <StyledContent>
      <StyledPanel>
        <StyledIntroContainer>
          <StyledIntroItem>
            <StyledTitle>Flight Planner</StyledTitle>

            <StyledFromToHeader>
              <StyledSelect
                style={{ marginTop: 8 }}
                onChange={fromChanged}
                value={fromAirport}
                showSearch
                placeholder="To"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
              <SwapOutlined style={{ width: 200 }} />
              <StyledSelect
                style={{ marginTop: 8 }}
                onChange={toChanged}
                value={toAirport}
                showSearch
                placeholder="From"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
            </StyledFromToHeader>
          </StyledIntroItem>
        </StyledIntroContainer>
      </StyledPanel>
      {!loading && flightData && fromAirport && toAirport && (
        <FilteredList
          fromAirport={fromAirport}
          toAirport={toAirport}
          flightData={flightData}
          statusCodes={statusCodes}
          airlines={airlines}
        />
      )}
      {(!fromAirport || !toAirport) && (
        <StyledImg src={FromToImg} alt="FromTo" />
      )}
    </StyledContent>
  );
};

FromTo.defaultProps = {};
