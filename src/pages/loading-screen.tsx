import styled from "styled-components";
import ReactDOM from "react-dom";
import Logo from "../assets/logo.svg";
import { Progress } from "antd";
import { StyledLogoContainer, fadeIn, scaleInX } from "../styled-components";

const StyledContainer = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: ${(props) => props.theme.general.bg};
  color: ${(props) => props.theme.general.textColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const StyledInnerContainer = styled.div`
  width: 210px;
  letter-spacing: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  animation: ${(p) => fadeIn} 200ms;
  gap: 8px;
`;

const StyledProgress = styled(Progress)`
  animation: ${(p) => scaleInX} 1000ms;
  width: 100%;
  width: 100%;
  .ant-progress-inner {
    background: ${(props) => props.theme.general.textColor};
    border-radius: 0px;
  }
  .ant-progress-bg {
    border-radius: 0px !important;
    background-color: ${(props) => props.theme.accent.green};
    border: 1px solid ${(props) => props.theme.general.bg};
    border-radius: 0px;
  }
  .ant-progress-text {
    color: ${(props) => props.theme.general.textColor};
  }
`;

const StyledLogoTitle = styled.div`
  font-size: 2rem;
  font-size: ${(props) => props.theme.general.fontSizeTitle};
  color: ${(props) => props.theme.general.titleColor};
  font-weight: bold;
  letter-spacing: 0.05em;
  // text-transform: uppercase;
  animation: ${(p) => fadeIn} 400ms;
`;

interface Props {
  progress: any;
}

export const LoadingScreen = ({ progress }: Props) => {
  return ReactDOM.createPortal(
    <StyledContainer>
      <StyledInnerContainer>
        <StyledLogoContainer onClick={() => navigate("/", { replace: true })}>
          <img src={Logo} alt="logo" style={{ width: 50 }} />
          <StyledLogoTitle style={{ fontSize: 40 }}>FlyMe</StyledLogoTitle>
        </StyledLogoContainer>
        <StyledProgress percent={progress || 0} showInfo={false} />
      </StyledInnerContainer>
    </StyledContainer>,
    document.getElementById("root")
  );
};

LoadingScreen.defaultProps = {
  progress: 0,
};
