/**
 * Panel layout height tokens.
 * Keep in sync with :root custom properties in src/style.css.
 */
export const PANEL_TILES_MIN_HEIGHT_PX = 1400;
export const PANEL_TILES_CHROME_HEIGHT_PX = 280;
export const ZK2_CONTENT_MAX_HEIGHT_PX = 1800;

export const PANEL_TILES_SCROLL_HEIGHT_PX =
  PANEL_TILES_MIN_HEIGHT_PX - PANEL_TILES_CHROME_HEIGHT_PX;

export const PANEL_TILES_INTRINSIC_SIZE_PX = PANEL_TILES_MIN_HEIGHT_PX + 200;

/** Getting-started guides — compact card grid, not a tile directory panel. */
export const GUIDES_PANEL_MIN_HEIGHT_PX = 360;
export const GUIDES_SECTION_INTRINSIC_SIZE_PX = 720;
