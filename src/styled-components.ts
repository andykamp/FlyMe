import styled, { createGlobalStyle } from "styled-components";
import { Tabs, Select } from "antd";
import { ThemeInterface } from "./theme";

export const GlobalStyle = createGlobalStyle<{ theme: ThemeInterface }>`
  body {
   // ---------------------------------------------
   // general
   // ---------------------------------------------
  
   font-size: ${(props) => props.theme.general.fontSize};
   font-family: ${(props) => props.theme.general.fontFamily};
   background: ${(props) => props.theme.general.bg}

// ---------------------------------------------
   // Ant d 
   // ---------------------------------------------
   .ant-select-dropdown {
     background-color: ${(props) => props.theme.general.bg} !important ;
     color: ${(props) => props.theme.general.textColor} !important;
     font-size: ${(props) => props.theme.general.fontSize} !important;
   }
   .ant-select-item{
     background-color: ${(props) => props.theme.general.bg};
     color: ${(props) => props.theme.general.textColor}; 
     font-size: ${(props) => props.theme.general.fontSize} !important;
   }
  
   .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
     font-weight: 600;
     color: ${(props) => props.theme.general.textColor}; 
     background-color: ${(props) => props.theme.general.greySelection};
   }
  
   .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
     background-color: ${(props) => props.theme.general.greySelectionHover};
   }
// empty box select
  .ant-select-dropdown-empty {
     background: ${(props) => props.theme.general.grey1} !important;
  }
  .ant-select-item-empty .ant-empty-small {
    // also possibel but not nessesarry because of .ant-select-dropdown-empty
     color: ${(props) => props.theme.general.textColor} !important; 
  }
  .ant-select-item-empty .ant-empty-small .ant-empty-image svg {
    filter: brightness(0) invert(0.8); // white ish filter
  }

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
  overflow-y: scroll;
  width: 75rem;
  max-width: 75rem;
  gap: 24px;
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
}


`;

export const StyledTabs = styled(Tabs)<{ theme: ThemeInterface }>`
  color: ${(props) => props.theme.general.textColor};
  font-size: ${(props) => props.theme.general.fontSizeTitle};
  font-weight: bold;
  > .ant-tabs-nav::before,
  .ant-tabs-bottom > .ant-tabs-nav::before,
  .ant-tabs-top > div > .ant-tabs-nav::before,
  .ant-tabs-bottom > div > .ant-tabs-nav::before {
    border-bottom: 1px solid ${(props) => props.theme.general.textColor};
  }
`;

export const StyledSelect = styled(Select)<{ theme: ThemeInterface }>`
  width: 100%;
  color: ${(props) => props.theme.general.textColor};
  background-color: transparent;
  .ant-select-selector {
    border: ${(props) => "1px solid " + props.theme.general.grey1} !important;
    background-color: transparent !important;
  }
  .ant-select-arrow {
    font-size: 11px !important;
    color: ${(props) => props.theme.general.grey1};
  }
  // search
  .ant-select-selection-search-input {
  }
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
  border-radius: 8px;
`;

export const StyledList = styled.div<{ theme: ThemeInterface }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow-y: scroll;
  background: ${(props) => props.theme.list.listBg};
`;

export const StyledListItem = styled.div<{
  theme: ThemeInterface;
  altNum: number;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0 24px;
  background: ${(props) =>
    props.altNum ? props.theme.list.listItemAltBg : props.theme.list.listBg};
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
