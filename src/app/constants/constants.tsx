// Constants for MUI Menu properties
export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 8;
export const MENU_ITEM_WIDTH = 250;
export const MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: MENU_ITEM_WIDTH,
    },
  },
};

// Constants for SVG dimensions
export const CHART_MARGINS = { top: 100, right: 50, bottom: 50, left: 100 };
export const CHART_WIDTH = 1280 - CHART_MARGINS.left - CHART_MARGINS.right;
export const CHART_HEIGHT = 4000 - CHART_MARGINS.top - CHART_MARGINS.bottom;

export const OVERLAY_STYLES: React.CSSProperties = {
  position: 'fixed',
  bottom: '20px', // 20px from the bottom of the viewport
  left: '50%', // Start at the half width of the viewport
  transform: 'translateX(-50%)', // Center horizontally
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
  padding: '10px',
  paddingRight: '50px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  zIndex: 1000, // Make sure it's on top of other elements
  display: 'flex',
  flexDirection: 'row', // Stack elements vertically
  gap: '10px', // Space between elements
  alignItems: 'center', // Center items inside the overlay horizontally
  maxWidth: 'calc(100% - 40px)', // Prevent overlay from reaching the very edge of the scree
  width: '60%',
};

export const routes = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];

export const marks = [
  {
    value: 0,
    label: '00:00 Uhr',
  },
  {
    value: 12,
    label: '12:00 Uhr',
  },
  {
    value: 24,
    label: '24:00 Uhr',
  },
];
