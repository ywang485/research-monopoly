// Make elements draggable

// Track z-index for stacking order
let highestZIndex = 50;

function initDraggableNotepad() {
    // Initialize mini notepad
    const notepad = document.getElementById('game-log-container');
    const notepadHeader = notepad?.querySelector('.notepad-header');
    if (notepad && notepadHeader) {
        notepad.style.zIndex = highestZIndex++;
        makeDraggable(notepad, notepadHeader, true);
    }

    // Initialize Scientists panel
    const playersPanel = document.getElementById('players-panel');
    const playersHeader = playersPanel?.querySelector('h3');
    if (playersPanel && playersHeader) {
        playersPanel.classList.add('draggable-sticky');
        playersPanel.style.zIndex = highestZIndex++;
        makeDraggable(playersPanel, playersHeader, false);
    }

    // Initialize Theories panel
    const theoriesPanel = document.getElementById('theories-panel');
    const theoriesHeader = theoriesPanel?.querySelector('h3');
    if (theoriesPanel && theoriesHeader) {
        theoriesPanel.classList.add('draggable-sticky');
        theoriesPanel.style.zIndex = highestZIndex++;
        makeDraggable(theoriesPanel, theoriesHeader, false);
    }
}

function makeDraggable(element, dragHandle, isCentered) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Get initial position from computed style
    const rect = element.getBoundingClientRect();
    if (isCentered) {
        xOffset = 0;
        yOffset = 0;
    } else {
        xOffset = rect.left;
        yOffset = rect.top;
    }

    dragHandle.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch events for mobile
    dragHandle.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === dragHandle || dragHandle.contains(e.target)) {
            isDragging = true;
            // Bring to front by giving it the highest z-index
            element.style.zIndex = highestZIndex++;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, element, isCentered);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        // Don't reset z-index - keep the stacking order
    }

    function setTranslate(xPos, yPos, el, centered) {
        if (centered) {
            // For centered elements (notepad)
            el.style.transform = `translate(calc(-50% + ${xPos}px), ${yPos}px) rotate(-0.5deg)`;
        } else {
            // For absolutely positioned elements (sticky notes)
            el.style.left = `${xPos}px`;
            el.style.top = `${yPos}px`;
            el.style.right = 'auto';
            el.style.bottom = 'auto';
        }
    }
}
