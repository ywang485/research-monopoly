// Make elements draggable

function initDraggableNotepad() {
    // Initialize mini notepad (only draggable element now)
    const notepad = document.getElementById('game-log-container');
    const header = notepad?.querySelector('.notepad-header');
    if (notepad && header) {
        makeDraggable(notepad, header, true);
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
            element.style.zIndex = 100; // Bring to front while dragging
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

        // Reset z-index based on element type
        if (element.classList.contains('mini-notepad')) {
            element.style.zIndex = 100;
        } else if (element.classList.contains('draggable-sticky')) {
            element.style.zIndex = 30;
        }
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
