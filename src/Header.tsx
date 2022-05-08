import Logo from "./logo.svg";
import { Tooltip, Tag } from "antd";
import { Link } from "react-router-dom";
import { CheckCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  StyledHeader,
  StyledLogoContainer,
  StyledHeaderContent,
  StyledTitle,
  Row,
} from "./styled-components";

interface Props {
  activePage: any;
  loading: boolean;
}

export const Header = ({ loading, activePage }: Props) => {
  const navigate = useNavigate();
  return (
    <StyledHeader>
      <StyledHeaderContent>
        <StyledLogoContainer onClick={() => navigate("/", { replace: true })}>
          <img src={Logo} alt="logo" />
          <StyledTitle>API Avinor</StyledTitle>
        </StyledLogoContainer>
        <Row style={{ gap: 8 }}>
          {/*<div onClick={toggleTheme}>toggle theme</div>*/}
          <Link to="/arrdep">Arrivals/Departures</Link>
          <Link to="/fromto">From/To</Link>

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
  );
};

Header.defaultProps = {
  acticePage: "home",
  loading: false,
};
