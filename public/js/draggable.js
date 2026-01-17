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

        // Initialize collapse/expand toggle
        const toggleBtn = document.getElementById('game-log-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering drag
                notepad.classList.toggle('collapsed');
                toggleBtn.textContent = notepad.classList.contains('collapsed') ? '+' : '−';
            });
        }
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
    let startMouseX;
    let startMouseY;
    let startElementX;
    let startElementY;

    dragHandle.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch events for mobile
    dragHandle.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.target === dragHandle || dragHandle.contains(e.target)) {
            // Get mouse/touch position
            if (e.type === "touchstart") {
                startMouseX = e.touches[0].clientX;
                startMouseY = e.touches[0].clientY;
            } else {
                startMouseX = e.clientX;
                startMouseY = e.clientY;
            }

            // Get element's current position
            if (isCentered) {
                // For centered elements, we track the translation offset
                // Parse current transform to get existing offset
                const transform = element.style.transform;
                const match = transform.match(/translate\(calc\(-50% \+ (-?\d+(?:\.\d+)?)px\), (-?\d+(?:\.\d+)?)px\)/);
                if (match) {
                    startElementX = parseFloat(match[1]);
                    startElementY = parseFloat(match[2]);
                } else {
                    startElementX = 0;
                    startElementY = 0;
                }
            } else {
                // For absolutely positioned elements, get current left/top
                const computedStyle = window.getComputedStyle(element);
                startElementX = parseFloat(computedStyle.left) || 0;
                startElementY = parseFloat(computedStyle.top) || 0;
            }

            isDragging = true;
            // Bring to front by giving it the highest z-index
            element.style.zIndex = highestZIndex++;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            let currentMouseX, currentMouseY;
            if (e.type === "touchmove") {
                currentMouseX = e.touches[0].clientX;
                currentMouseY = e.touches[0].clientY;
            } else {
                currentMouseX = e.clientX;
                currentMouseY = e.clientY;
            }

            // Calculate how far the mouse moved
            const deltaX = currentMouseX - startMouseX;
            const deltaY = currentMouseY - startMouseY;

            // Apply delta to element's starting position
            const newX = startElementX + deltaX;
            const newY = startElementY + deltaY;

            setTranslate(newX, newY, element, isCentered);
        }
    }

    function dragEnd(e) {
        isDragging = false;
        // Don't reset z-index - keep the stacking order
    }

    function setTranslate(xPos, yPos, el, centered) {
        if (centered) {
            // For centered elements (notepad) - keep translateX(-50%) for centering
            el.style.transform = `translate(calc(-50% + ${xPos}px), ${yPos}px)`;
        } else {
            // For absolutely positioned elements (sticky notes)
            el.style.left = `${xPos}px`;
            el.style.top = `${yPos}px`;
            el.style.right = 'auto';
            el.style.bottom = 'auto';
        }
    }
}
