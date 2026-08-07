# Visual board layout editor

## Context
The board's space arrangement is currently 100% computed by a fixed algorithm in `renderBoard()` (`public/js/rendering.js:222+`) that distributes however many spaces exist evenly around a square perimeter loop — there is no per-space coordinate anywhere in the data model. The user wants to arrange spaces in any shape they choose (not just a square/loop), via a visual drag-and-drop editor rather than hand-written coordinates.

Research confirmed the rest of the codebase is already layout-agnostic: hover hit-testing (`getSpaceAtPosition`, `ui.js:223`), token animation/interpolation (`getAnimatedPosition`, `game-logic.js:294`), viewport centering (`centerViewportOnSpace`, `ui.js:426`), and token/arrow drawing all just consume `GameState.boardPositions[i] = {x, y}` generically by index — none of them assume a square or perimeter shape. The only place that needs to change is where `positions` gets computed, plus a new way to author those positions.

## Approach
Keep the existing text map (`#map-text` on the setup screen, parsed by `parseMap()`) as the source of truth for *which* spaces exist (type/name/cost) and their order — unchanged. Add an optional grid position to each line (`COL`/`ROW`), and a new full-screen visual editor that lets the user drag each space's tile onto a grid to set those two numbers, then writes them back into the map text. If a board's spaces don't *all* have positions, it silently falls back to today's auto-loop — fully backward compatible, default board needs zero changes.

### 1. Map format + `parseMap()` (`public/js/utils.js:343`)
Extend the pipe format to an optional 4th/5th field: `TYPE|Name|ExtraData|Col|Row`. Parse `parts[3]`/`parts[4]` as `gridCol`/`gridRow` (integers, `undefined` if absent) onto each space object. No change to existing lines/boards that don't use them.

### 2. `renderBoard()` layout branch (`public/js/rendering.js`)
Refactor the current position-calculation block (`rendering.js:240-345`, the `basePerEdge`/edge-distribution math) out into a standalone `computeAutoLoopPositions(numSpaces, spaceSize, padding)` returning `{ positions, logicalBoardWidth, logicalBoardHeight }` — same math, just extracted so it can be reused (see editor below) instead of only living inline in `renderBoard()`.

In `renderBoard()`: `const hasCustomLayout = board.length > 0 && board.every(s => s.gridCol !== undefined && s.gridRow !== undefined);`
- If true: normalize (subtract min col/row so everything is ≥0), compute `positions[i] = { x: (s.gridCol - minCol) * spaceSize + padding, y: (s.gridRow - minRow) * spaceSize + padding }`, and size `logicalBoardWidth/Height` from the (maxCol-minCol+1)/(maxRow-minRow+1) bounding box instead of the square `sideLength`.
- If false (any space missing a position — including a partially-annotated map from manual text edits after using the editor once): fall back to `computeAutoLoopPositions(...)` exactly as today.

Everything downstream (scale-to-fit, zoom, offset centering, `GameState.boardPositions` storage) is untouched — it already operates generically on whatever `positions`/`logicalBoardWidth`/`logicalBoardHeight` it's given.

### 3. Visual layout editor (new)
A dedicated full-screen overlay (not the small "torn note" `#modal` — its `max-width: 500px` is too small for a grid tool), added as a new top-level element in `SetupScreen.tsx`, toggled via a "🗺️ Arrange Layout" button under Board Configuration.

**Opening it**: parse the current source (`#map-text` value if `map-select` is "custom", else `DEFAULT_MAP`) with `parseMap()`. For each space, seed its editor position from `gridCol`/`gridRow` if present, otherwise from `computeAutoLoopPositions(...)` (pixel position ÷ `spaceSize`, exact since the loop algorithm already snaps to a `spaceSize` grid) — so the editor always starts from a sensible, non-overlapping layout rather than a blank grid.

**Grid rendering**: a CSS Grid container sized via `+`/`-` controls (rows/cols, defaulting to the auto-loop bounding box + a few cells of margin, min 8×8), with cell boundaries drawn via a cheap repeating-`linear-gradient` background (no per-cell DOM nodes needed). Each space is a small `.layout-tile` (`draggable="true"`, short label - first few letters of type or its emoji from `ITEMS`/space-type icon - full name in `title` tooltip), positioned with `style.gridColumn`/`gridRow` from its current (col,row).

**Drag mechanics**: reuses the drag-and-drop pattern already established for the team-grouping editor (`public/js/ui.js`, `setupGroupListEvents`'s `dragstart`/`dragover`/`drop`) — `dragstart` on a tile stores its space index in `dataTransfer`; a single `dragover`/`drop` listener on the grid container (not per-cell) computes the target cell from `(clientX/Y - container rect) / cellSize`, shows a single moving highlight div during `dragover`, and on `drop`: if the target cell is occupied by another tile, swap the two spaces' (col,row); otherwise just move. Re-render tile `gridColumn`/`gridRow` after each drop (cheap, tile count ≤ ~35).

**Saving**: a `serializeMapWithPositions(spaces, positions)` helper (new, `utils.js`) rebuilds the full map text with `|Col|Row` appended to every line (a fresh `# Format: TYPE|NAME|EXTRA_DATA|COL|ROW` header replaces the old one - freeform comments aside from that header are not preserved across a save, which is an acceptable, clearly-documented trade-off for not building a comment-preserving text differ). Writes the result into `#map-text` and force-switches `#map-select` to `"custom"` (so a layout drawn on top of the "Default Board" transparently promotes it to a custom map, since positions only live in the text). A "Reset to Auto Layout" button does the inverse: strips the `|Col|Row` fields from every line, reverting to auto-loop. Both buttons close the overlay back to the setup screen.

## Files to touch
- `public/js/utils.js` — `parseMap()` optional col/row parsing; new `serializeMapWithPositions()`
- `public/js/rendering.js` — extract `computeAutoLoopPositions()`; `renderBoard()` custom-layout branch
- `public/js/ui.js` — layout editor open/close, grid rendering, drag handlers, save/reset (mirrors the existing `setupGroupListEvents` drag pattern)
- `app/components/SetupScreen.tsx` — "🗺️ Arrange Layout" button; new `#layout-editor-overlay` markup (grid container, resize controls, Save/Reset/Cancel buttons)
- `app/globals.css` — overlay, grid background, `.layout-tile`, drag-over highlight (reuse the `.group-card.drag-over`-style visual language already established)

## Explicitly out of scope
- Editing space *type/name/cost* visually (still done via the existing text box) - the editor only controls position.
- Preserving arbitrary comments in the map text across a save (only the format header is regenerated).
- Per-space custom sizing (all tiles/spaces remain the uniform `spaceSize`, matching `getSpaceAtPosition`'s existing uniform-size hit-test assumption).

## Verification
- `npm run dev`, open the setup screen, click "Arrange Layout" with the default board loaded: confirm tiles appear pre-arranged in the current square-loop shape (not overlapping, not blank).
- Drag a tile to an empty cell: confirm it moves and the previous cell is now empty.
- Drag a tile onto an occupied cell: confirm the two swap rather than one being lost.
- Click Save, start the game: confirm the board renders in the custom shape (not a square), and that hover tooltips, token movement/animation, and the current-player arrow all work correctly at the new positions (they're generic, but worth eyeballing).
- Arrange a genuinely non-square shape (e.g. a plus-sign or an L), confirm rendering/zoom/pan all still work.
- Open the editor again on an already-arranged custom map: confirm it starts from the saved positions, not the auto-loop.
- Click "Reset to Auto Layout": confirm the board goes back to the square loop.
- Manually delete the `|Col|Row` from just one line in the textarea (simulating a hand-edit after using the editor) and start the game: confirm it falls back to full auto-loop rather than crashing or overlapping spaces.
