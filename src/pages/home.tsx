import styled, { keyframes } from "styled-components";
import Hero from "../hero.svg";
import { StyledTitle, StyledParagraph } from "../styled-components";
import { addAlpha } from "../theme";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from {
    transform: scale(.25);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledTextContainer = styled.div`
  height: 100%;
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.header.headerBg};
`;
const StyledTextInnerContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`;

const StyledIllustration = styled.div`
  height: 100%;
  flex: 3;
  animation: ${(p) => fadeIn} 100ms;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const StyledImgContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledImg = styled.img`
  object-fit: contain;
  width: 100%;
`;
const StyledButton = styled.div`
  width: 100%;
  height: 32px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${(props) => addAlpha(props.theme.accent.green, 0.7)};
  border: 1px solid ${(props) => props.theme.accent.green};
  color: ${(props) => props.theme.general.bg};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: ${(props) => addAlpha(props.theme.accent.green, 0.5)};
  }
  border-radius: 2px;
`;
const StyledDivider = styled.div`
  width: 100%;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.general.textColor};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Home = () => {
  const navigate = useNavigate();
  return (
    <StyledContainer>
      <StyledTextContainer>
        <StyledTextInnerContainer>
          <StyledTitle>Welcome to FlyMe!</StyledTitle>
          <StyledParagraph>
            We make flight planning easier. We utilize Avinor’s open API to
            provide the following services:
          </StyledParagraph>
          <StyledButton onClick={() => navigate("/fromto", { replace: true })}>
            Flight planner
          </StyledButton>
          <StyledDivider>or</StyledDivider>
          <StyledButton onClick={() => navigate("/arrdep", { replace: true })}>
            Arrivals/Departures
          </StyledButton>
        </StyledTextInnerContainer>
      </StyledTextContainer>

      <StyledIllustration>
        <StyledImgContainer>
          <StyledImg src={Hero} alt="hero" />
        </StyledImgContainer>
      </StyledIllustration>
    </StyledContainer>
  );
};

Home.defaultProps = {};
