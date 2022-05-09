import Logo from "./assets/logo.svg";
import { Tooltip } from "antd";
import { CheckCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

import {
  StyledHeader,
  StyledLogoContainer,
  StyledHeaderContent,
  StyledHeaderItem,
  StyledTitle,
  StyledHeaderMenu,
  StyledTag,
} from "./styled-components";

interface Props {
  loading: boolean;
}

export const Header = ({ loading }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;
  return (
    <StyledHeader
      style={{ background: currentRoute == "/" ? "transparent" : "inherit" }}
    >
      <StyledHeaderContent>
        <StyledLogoContainer onClick={() => navigate("/", { replace: true })}>
          <img src={Logo} alt="logo" />
          <StyledTitle>FlyMe</StyledTitle>
        </StyledLogoContainer>
        <StyledHeaderMenu>
          {/*<div onClick={toggleTheme}>toggle theme</div>*/}
          <StyledHeaderItem
            active={currentRoute == "/fromto"}
            onClick={() => navigate("/fromto", { replace: true })}
          >
            Flight Planner
          </StyledHeaderItem>
          <StyledHeaderItem
            active={currentRoute == "/arrdep"}
            onClick={() => navigate("/arrdep", { replace: true })}
          >
            Arrivals/Departures
          </StyledHeaderItem>

          <div>
            {loading ? (
              <Tooltip title=" Syncing requested data with Avinor. This website fetches data every 3 minutes. ">
                <StyledTag
                  style={{ background: "rgba(0,0,0,0.2)" }}
                  icon={<SyncOutlined spin />}
                  color="processing"
                >
                  Syncing data
                </StyledTag>
              </Tooltip>
            ) : (
              <Tooltip title=" All requested data is currently synced with Avinor. This website fetches data every 3 minutes. ">
                <StyledTag
                  style={{ background: "rgba(0,0,0,0.2)" }}
                  icon={<CheckCircleOutlined />}
                  color="success"
                >
                  Data synced
                </StyledTag>
              </Tooltip>
            )}
          </div>
        </StyledHeaderMenu>
      </StyledHeaderContent>
    </StyledHeader>
  );
};

Header.defaultProps = {
  acticePage: "home",
  loading: false,
};
