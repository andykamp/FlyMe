import styled, { keyframes, createGlobalStyle } from "styled-components";
import { Tag, Select } from "antd";
import { ThemeInterface, addAlpha } from "./theme";

// ---------------------------------------------
// general
// ---------------------------------------------

export const GlobalStyle = createGlobalStyle<{ theme: ThemeInterface }>`
  body {
   // ---------------------------------------------
   // general
   // ---------------------------------------------
  
   font-size: ${(props) => props.theme.general.fontSize};
   font-family: ${(props) => props.theme.general.fontFamily};
   background: ${(props) => props.theme.general.bg}

`;

export const StyledApp = styled.div<{ theme: ThemeInterface }>`
  position: relatve;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: ${(props) => props.theme.general.bg};
  color: ${(props) => props.theme.general.textColor};
`;

// ---------------------------------------------
// header
// ---------------------------------------------

export const StyledHeader = styled.header<{ theme: ThemeInterface }>`
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  min-height: 80px;
  padding: 0 24px;
  background: ${(props) => props.theme.header.headerBg};
`;

export const StyledLogoContainer = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
  cursor: pointer;
`;

export const StyledHeaderContent = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  // max-width: 75rem;
`;

export const StyledHeaderMenu = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  gap: 24px;
`;

export const StyledHeaderItem = styled.div<{
  theme: ThemeInterface;
  active: boolean;
}>`
  color: ${(props) => props.theme.general.titleColor};
  font-weight: light;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    color: ${(props) =>
      props.active
        ? props.theme.accent.green
        : addAlpha(props.theme.general.titleColor, 0.5)};
  }

  ${({ active, theme }) =>
    active &&
    `
  color: ${theme.accent.green};

  `}
`;

// ---------------------------------------------
// Content and misc
// ---------------------------------------------

export const StyledContent = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  width: 75%;
  // max-width: 75rem;
  gap: 24px;
  margin-top: 80px;
  padding: 24px;
`;

export const StyledIntroContainer = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

export const StyledIntroItem = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

export const StyledPanel = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 24px;
  color: ${(props) => props.theme.general.titleColor};
  background: ${(props) => props.theme.general.panelBg};
  border: 1px solid #1c2126;
  border-radius: 2px;
`;

export const StyledTag = styled(Tag)`
  height: 32px;
  line-height: 32px;
  font-size: ${(props) => props.theme.general.fontSize};
`;

export const StyledTabs = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
`;
export const StyledTab = styled.div<{
  theme: ThemeInterface;
  active?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  cursor: pointer;
  padding: 24px;
  color: ${(props) => props.theme.general.titleColor};
  background: ${(props) =>
    props.active ? props.theme.general.panelBg : "transparent"};
  border: 1px solid #1c2126;
`;

export const StyledSelect = styled(Select)<{ theme: ThemeInterface }>`
  width: 100%;
  .ant-select-selection-placeholder {
    color: black;
  }
`;

export const StyledTitle = styled.div<{ theme: ThemeInterface }>`
  font-size: ${(props) => props.theme.general.fontSizeTitle};
  color: ${(props) => props.theme.general.titleColor};
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const StyledLabel = styled.div<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.textColor};
`;

export const StyledValue = styled.div<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.titleColor};
`;

export const StyledParagraph = styled.p<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.textColor};
  margin: 8px 0 8px;
`;

export const StyledLink = styled.div<{ theme: ThemeInterface }>`
  margin: 8px 0 0;
  font-weight: bold;
  color: ${(props) => props.theme.accent.green};
  text-decoration: underline;
  cursor: pointer;
`;

export const StyledIconContainer = styled.div<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.textColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 100%;
`;

export const StyledTableValue = styled.div<{
  theme: ThemeInterface;
  width?: number;
  header?: boolean;
}>`
  text-transform: uppercase;
  color: ${(props) => props.theme.general.textColor};
  width: ${(props) => (props.width ? props.width + "px" : "100%")};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${({ header, theme }) =>
    header &&
    `
    font-weight:bold;
  `}
`;

export const StyledFromToHeader = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
// ---------------------------------------------
// list
// ---------------------------------------------

export const StyledListPanel = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  color: ${(props) => props.theme.general.titleColor};
  background: ${(props) => props.theme.general.panelBg};
  border: 1px solid #1c2126;
  // border-bottom-left-radius: 8px;
  // border-bottom-right-radius: 8px;
`;

export const StyledList = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: ${(props) => props.theme.list.listBg};
`;

export const StyledListItem = styled.div<{
  theme: ThemeInterface;
  altNum?: boolean;
  header?: boolean;
}>`
  display: flex;
  flex-direction: row
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 24px;
  background: ${(props) =>
    props.altNum ? props.theme.list.listItemAltBg : props.theme.list.listBg};
  ${({ header, theme }) =>
    header &&
    `
      //border-bottom: 4px solid ${theme.accent.green};
      border-bottom: 1px solid #1c2126;
  `}

  &:hover {
    background: ${(props) =>
      addAlpha(
        props.altNum ? props.theme.list.listItemAltBg : props.theme.list.listBg,
        0.5
      )};
  }
`;
export const StyledTableValueStatus = styled.div<{
  theme: ThemeInterface;
  width?: number;
  status?: string;
}>`
  text-transform: uppercase;
  width: ${(props) => (props.width ? props.width + "px" : "100%")};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${(props) =>
    props.status == "Departed" || props.status == "Arrived"
      ? props.theme.status.success
      : props.status == "Cancelled" || props.status == "Unmapped"
      ? props.theme.status.error
      : props.theme.status.warning};
`;

// ---------------------------------------------
// generic col/row
// ---------------------------------------------

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

// ---------------------------------------------
// animations
// ---------------------------------------------

export const fadeIn = keyframes`
  from {
    transform: scale(.25);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

export const scaleInX = keyframes`
  from {
    transform: scale(.50, 1);
    opacity: 1;
  }

  to {
    transform: scale(1., 1.);
    opacity: 1;
  }
`;
