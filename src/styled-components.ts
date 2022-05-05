import styled, { createGlobalStyle } from "styled-components";
import { Select } from "antd";
import { ThemeInterface } from "./theme";

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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: ${(props) => props.theme.general.bg};
  color: ${(props) => props.theme.general.textColor};
`;

export const StyledHeader = styled.header<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  min-height: 80px;
  padding: 0 24px;
  background: ${(props) => props.theme.header.headerBg};
  margin-bottom: 24px;
`;

export const StyledLogoContainer = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

export const StyledHeaderContent = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 75rem;
  max-width: 75rem;
`;

export const StyledContent = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  width: 75rem;
  max-width: 75rem;
  gap: 24px;
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
  border-radius: 8px;
`;

export const StyledTabs = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
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
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const StyledSelect = styled(Select)<{ theme: ThemeInterface }>`
  width: 100%;
`;

export const StyledListPanel = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  color: ${(props) => props.theme.general.titleColor};
  background: ${(props) => props.theme.general.panelBg};
  border: 1px solid #1c2126;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
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
  backgound: ${(props) =>
    props.altNum ? props.theme.list.listItemAltBg : props.theme.list.listBg};
  ${({ header, theme }) =>
    header &&
    `
      //border-bottom: 4px solid ${theme.accent.green};
      border-bottom: 1px solid #1c2126;
  `}
`;

export const StyledTitle = styled.div<{ theme: ThemeInterface }>`
  font-size: ${(props) => props.theme.general.fontSizeTitle};
  color: ${(props) => props.theme.general.titleColor};
  font-weight: bold;
`;

export const StyledLabel = styled.div<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.textColor};
`;

export const StyledValue = styled.div<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.titleColor};
`;

export const StyledParagraph = styled.p<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.textColor};
  margin: 8px 0 0;
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

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;
