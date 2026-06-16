import { describe, it, expect } from 'vitest';
import {
  GUIDES_PANEL_MIN_HEIGHT_PX,
  GUIDES_SECTION_INTRINSIC_SIZE_PX,
  PANEL_TILES_CHROME_HEIGHT_PX,
  PANEL_TILES_INTRINSIC_SIZE_PX,
  PANEL_TILES_MIN_HEIGHT_PX,
  PANEL_TILES_SCROLL_HEIGHT_PX,
  ZK2_CONTENT_MAX_HEIGHT_PX,
} from '../src/lib/layout-tokens';

describe('layout-tokens', () => {
  it('derives scroll height from panel min height minus chrome', () => {
    expect(PANEL_TILES_SCROLL_HEIGHT_PX).toBe(
      PANEL_TILES_MIN_HEIGHT_PX - PANEL_TILES_CHROME_HEIGHT_PX
    );
  });

  it('keeps zk2 content cap at or above the panel minimum', () => {
    expect(ZK2_CONTENT_MAX_HEIGHT_PX).toBeGreaterThanOrEqual(PANEL_TILES_MIN_HEIGHT_PX);
  });

  it('tracks deferred section intrinsic size buffer', () => {
    expect(PANEL_TILES_INTRINSIC_SIZE_PX).toBe(PANEL_TILES_MIN_HEIGHT_PX + 200);
  });

  it('keeps guides section compact — not tile-panel height', () => {
    expect(GUIDES_PANEL_MIN_HEIGHT_PX).toBeLessThan(PANEL_TILES_MIN_HEIGHT_PX);
    expect(GUIDES_SECTION_INTRINSIC_SIZE_PX).toBeLessThan(PANEL_TILES_INTRINSIC_SIZE_PX);
  });
});
