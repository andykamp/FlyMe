import { useState, useEffect } from "react";
import styled from "styled-components";
import { airportsInNorway } from "../data";
import { Select, Tag } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import ArrDep from "../ArrDep.svg";

import {
  StyledContent,
  StyledPanel,
  StyledTitle,
  StyledSelect,
  StyledParagraph,
  StyledIntroItem,
  StyledIntroContainer,
} from "../styled-components";
import { FilteredListSeperated } from "../List";

const StyledImg = styled.img`
  margin-top: 40px;
  object-fit: contain;
  width: 50%;
`;

interface Props {
  loading: any;
  statusCodes: any;
  airlines: any;
}

export const ArrivalsDepartures = ({
  loading,
  statusCodes,
  airlines,
}: Props) => {
  // TODO do this for ailines and status code also
  const [flightData, setFlightData] = useOutletContext();

  const [selectedAirport, setSelectedAirport] = useState<null | string>(null);
  const [tab, setTab] = useState<"arrivals" | "departures">("arrivals");

  //  user changed the selected airport  by dropdown
  const airportChanged = (airport: string) => {
    setSelectedAirport(airport);
  };

  return (
    <StyledContent>
      <StyledPanel>
        <StyledIntroContainer>
          <StyledIntroItem>
            <StyledTitle>Arrivals/departures</StyledTitle>
            <StyledSelect
              style={{ width: 300, marginTop: 8 }}
              onChange={airportChanged}
              value={selectedAirport}
              showSearch
              placeholder="Select a airport"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
      {!selectedAirport && <StyledImg src={ArrDep} alt="logo" />}
    </StyledContent>
  );
};

ArrivalsDepartures.defaultProps = {
  statusCodes: {},
  airlines: {},
};
