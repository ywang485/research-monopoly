# Game Board Space Icon Templates

This directory contains templates for creating custom icons for the different space types on the Research Monopoly game board.

## Template Files

### Individual Templates (24x24 pixels each)
1. **RandomEventGrid_template_24x24.png** - Random Event spaces
2. **RecruitmentGrid_template_24x24.png** - PhD Student Recruitment spaces
3. **PublicationGrid_template_24x24.png** - Publication spaces
4. **BargainGrid_template_24x24.png** - Evil Bargain Shop spaces

### Sprite Sheet Template
- **MapGrid-SpecialGrid_TEMPLATE.png** - Full sprite sheet with all 5 spaces (120x24 pixels)

### Reference
- **README_INSTRUCTIONS.png** - Visual guide showing all space types

## Specifications

- **Icon Size**: 24x24 pixels per icon
- **Format**: PNG with transparency (RGBA)
- **Sprite Sheet Layout**: 5 sprites arranged horizontally (positions 0-4)
- **Current Mapping**:
  - Position 0: RandomEventGrid
  - Position 1: RecruitmentGrid
  - Position 2: PublicationGrid
  - Position 3: BargainGrid
  - Position 4: (Currently unused)

## How to Use

1. **Choose Your Approach**:
   - **Option A**: Draw on individual template files (easier for different tools)
   - **Option B**: Draw on the sprite sheet template (one file to manage)

2. **Design Your Icons**:
   - Each icon should be 24x24 pixels
   - Use the crosshair guides (center lines) for alignment
   - Design within the bordered area
   - Consider the icons will be displayed small on the game board

3. **Save Your Work**:
   - If using individual templates: Keep the same filenames or name them clearly
   - If using sprite sheet: Save as PNG with transparency
   - Maintain exact pixel dimensions (24x24 per icon)

4. **Upload to Repository**:
   - Replace the current sprite sheet at: `/Assets/Resources/Sprites/MapGrid-SpecialGrid.png`
   - Or provide individual icon files for integration

## Icon Purposes

- **Random Event**: Spaces that trigger random game events
- **Recruitment**: Spaces where players can recruit PhD students to help with research
- **Publication**: Spaces where players publish their research findings
- **Bargain Shop**: Special spaces for the "Evil Bargain Shop" interactions

## Notes

- The templates include light gray crosshairs and borders - these are guides only, remove them in your final design
- The game uses Unity's SpriteRenderer, so PNG format with alpha channel is recommended
- Icons will be rendered on the game board at world scale {x: 10, y: 10, z: 1}
- Actual display size varies (most are 0.16 units, Recruitment is 0.24 units)

## Current Icons

The current icons in the game are simple pixel art designs. You can see them in:
`/Assets/Resources/Sprites/MapGrid-SpecialGrid.png`

Feel free to design icons that match the research/academic theme of the game!
