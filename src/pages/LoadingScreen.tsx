import styled from "styled-components";
import Logo from "../logo.svg";
import { Progress } from "antd";

import { StyledLogoContainer, StyledTitle } from "../styled-components";

const StyledContainer = styled.div`
position: absolute;
 width: 100vw; 
 height: 100vh;
z-index. 9999;
background: ${(props) => props.theme.general.bg};
  color: ${(props) => props.theme.general.textColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const StyledInnerContainer = styled.div`
  width: 400px;
  letter-spacing: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const StyledProgress = styled(Progress)`
  width: 100%;
  width: 100%;
  .ant-progress-inner {
    background: ${(props) => props.theme.general.textColor};
  }
  .ant-progress-bg {
    border-radius: 0px !important;
    background-color: ${(props) => props.theme.accent.green};
  }
  color: red;
  .ant-progress-text {
    color: ${(props) => props.theme.general.textColor};
  }
`;

interface Props {
  progress: any;
}

export const LoadingScreen = ({ progress }: Props) => {
  return (
    <StyledContainer>
      <StyledInnerContainer>
        <StyledLogoContainer onClick={() => navigate("/", { replace: true })}>
          <img src={Logo} alt="logo" />
          <StyledTitle>API Avinor</StyledTitle>
        </StyledLogoContainer>
        <StyledProgress percent={progress || 0} showInfo={false} />
      </StyledInnerContainer>
    </StyledContainer>
  );
};

LoadingScreen.defaultProps = {
  progress: 0,
};
