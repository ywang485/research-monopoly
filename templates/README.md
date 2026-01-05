# Research Monopoly - Game Board Space Icon Templates

This folder contains SVG templates for creating custom icons for the special game board spaces.

## Space Types

### 1. Bargain Grid (160x160 px)
- **Purpose**: Evil Bargain Shop where players can make special deals
- **Player Access**: Human players only
- **File**: `1-BargainGrid-template.svg`

### 2. Publication Grid (160x160 px)
- **Purpose**: Publishing venue for submitting unpublished research findings
- **Player Access**: All players
- **File**: `2-PublicationGrid-template.svg`

### 3. Random Event Grid (160x160 px)
- **Purpose**: Triggers random events during gameplay
- **Player Access**: All players except AI "Experiments" players
- **File**: `3-RandomEventGrid-template.svg`

### 4. Recruitment Grid (240x240 px)
- **Purpose**: PhD student recruitment station
- **Player Access**: Human players only
- **File**: `4-RecruitmentGrid-template.svg`
- **Note**: This icon is **50% larger** (1.5x) than the other space icons

## How to Use These Templates

1. **Open the SVG files** in your preferred graphics editor (Inkscape, Adobe Illustrator, Figma, etc.)
2. **Draw your icon design** within the blue dashed box area
3. **Keep your design centered** using the crosshair guides
4. **Export as PNG** with the same dimensions (160x160 or 240x240)
5. **Name your exported files**:
   - `BargainGrid-icon.png`
   - `PublicationGrid-icon.png`
   - `RandomEventGrid-icon.png`
   - `RecruitmentGrid-icon.png`

## Design Guidelines

- **Simple and clear**: Icons should be recognizable at small sizes
- **Stay within the guide area**: The blue dashed box shows the safe drawing area
- **Use the center guides**: The crosshairs help you center your design
- **Consider the theme**: This is a research/academic themed monopoly game
- **Transparent backgrounds**: Export with transparency (alpha channel)

## Upload Location

Once you've created your icons, upload them to:
```
/Assets/Resources/Sprites/
```

The integration will replace sprites in the existing `MapGrid-SpecialGrid.png` sprite sheet.

## Technical Details

- **Standard icon size**: 0.16 x 0.16 Unity units (rendered at 1.6 x 1.6)
- **Recruitment icon size**: 0.24 x 0.24 Unity units (rendered at 2.4 x 2.4)
- **Scaling**: 10x transform scale applied in-game
- **Format**: PNG with transparency
- **Color**: Full color support, white default tint applied in-game
