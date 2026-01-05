# Research Monopoly - Game Space Icon Templates

This folder contains templates for creating custom icons for the game board spaces.

## About the Game

This is a **web-based** research monopoly game that uses **HTML Canvas** to draw the game board. Currently, all icons are drawn procedurally using canvas drawing commands.

## Space Types (Excluding Hypothesis)

Based on the code in `public/js/rendering.js` and `public/js/constants.js`:

1. **START** - Academic Career Begins
   - Current icon: Quill pen and inkwell
   - Effect: Passing gives +2 fame (rejuvenates by 2 years in messages)

2. **RECRUIT** - Graduate School / Faculty Hiring
   - Current icon: Scholar with scroll and wig
   - Effect: Hire students (undergraduate, master, PhD) for fame points

3. **CONFERENCE** - Academic Conference
   - Current icon: Lectern with open book
   - Effect: Present work and gain recognition (+3 fame base)

4. **SABBATICAL** - Research Leave
   - Current icon: Stack of books with candle
   - Effect: Rejuvenate by 2 years (rest and contemplation)

5. **COMMUNITY_SERVICE** - Community Service
   - Current icon: Document with spectacles
   - Effect: Lose years to service work (or sacrifice a student)

6. **GRANT** - Research Grant / Major Funding
   - Current icon: Royal coin purse with coins
   - Effect: Receive funding and gain 2 fame

7. **SCANDAL** - Academic Scandal
   - Current icon: Broken quill and spilled ink
   - Effect: Lose fame points due to academic misconduct

8. **COLLABORATION** - Research Network
   - Current icon: Two hands shaking with period sleeve cuffs
   - Effect: Team up with colleague, gain fame and rejuvenate

9. **EUREKA** - Breakthrough Moment
   - Current icon: Newton's apple with enlightenment rays
   - Effect: Claim nearest uninvested hypothesis FOR FREE!

## Current Implementation

The game currently draws all icons **procedurally** using JavaScript canvas drawing functions. Each icon is rendered at:
- **Base size**: 60x60 pixels
- **Drawing area**: Centered within the space, typically using ±20px from center
- **Style**: Hand-drawn, sketchy, classical/period scientific aesthetic

## Template Format

I've created **200x200 pixel PNG templates** for each space type:
- Higher resolution for easier drawing
- Will need to be loaded as images in the game code
- Clear center guidelines
- Space type labeled

## How to Use

1. **Draw your icons** on the template images using your preferred image editor
2. **Save as PNG** with transparency
3. **Upload** the completed icons back to the repository
4. **Integration**: The code in `public/js/rendering.js` will need to be updated to:
   - Load images instead of using procedural drawing functions
   - Apply the images to each space type

## Technical Notes

- Game board is rendered on an HTML Canvas element
- Current icons use a sketchy, hand-drawn style with pencil aesthetics
- The notebook/academic theme should be preserved in custom icons
- Icons should be recognizable at small sizes (60px)
- Consider transparent backgrounds for better integration
