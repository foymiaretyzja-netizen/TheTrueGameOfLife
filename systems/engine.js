// ==========================================
// 1. IMPORTS
// We pull in the logic from our other files here.
// ==========================================
import { initializeEcosystem, updateEcosystem } from './ecosystem.js';
import { updateEntities } from './entities.js';

// ==========================================
// 2. WORLD & CAMERA SETUP
// ==========================================
const world = document.getElementById('world');
const hud = document.getElementById('hud');

// Target values (where the camera wants to go)
let targetX = -10000 + window.innerWidth / 2;
let targetY = -10000 + window.innerHeight / 2;
let targetScale = 1;

// Current values (where the camera actually is right now)
let currentX = targetX;
let currentY = targetY;
let currentScale = targetScale;

// Interaction states
let panning = false;
let startMouseX = 0, startMouseY = 0;
let startTargetX = 0, startTargetY = 0;
let isShiftHeld = false;

// ==========================================
// 3. EVENT LISTENERS (INPUT)
// ==========================================
window.addEventListener('keydown', (e) => { if (e.key === 'Shift') isShiftHeld = true; });
window.addEventListener('keyup', (e) => { if (e.key === 'Shift') isShiftHeld = false; });

document.addEventListener('mousedown', (e) => {
    e.preventDefault();
    panning = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startTargetX = targetX;
    startTargetY = targetY;
});

document.addEventListener('mousemove', (e) => {
    if (!panning) return;
    const dx = e.clientX - startMouseX;
    const dy = e.clientY - startMouseY;
    targetX = startTargetX + dx;
    targetY = startTargetY + dy;
});

document.addEventListener('mouseup', () => { panning = false; });
document.addEventListener('mouseleave', () => { panning = false; });

document.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomIntensity = 0.05; 
    const wheel = e.deltaY < 0 ? 1 : -1;
    const zoomFactor = Math.exp(wheel * zoomIntensity);
    
    let newScale = targetScale * zoomFactor;
    newScale = Math.max(0.1, Math.min(newScale, 5));

    const mouseX = e.clientX - targetX;
    const mouseY = e.clientY - targetY;

    targetX -= mouseX * (newScale / targetScale - 1);
    targetY -= mouseY * (newScale / targetScale - 1);
    targetScale = newScale;
}, { passive: false });

// ==========================================
// 4. ENVIRONMENT GENERATION (Bubbles)
// ==========================================
function createBubbles() {
    const numberOfBubbles = 300; 
    for (let i = 0; i < numberOfBubbles; i++) {
        let bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        let size = Math.random() * 15 + 5;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 15 + 8}s`;
        bubble.style.animationDelay = `${Math.random() * 10}s`;
        
        world.appendChild(bubble);
    }
}

// ==========================================
// 5. THE MAIN SIMULATION LOOP
// ==========================================
function gameLoop() {
    // A. Calculate Camera Physics
    const ease = isShiftHeld ? 1 : 0.08;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    currentScale += (targetScale - currentScale) * ease;

    // B. Apply Camera Transform
    world.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;

    // C. Update UI HUD
    hud.innerText = `POS: X:${Math.round(-currentX)} Y:${Math.round(-currentY)} Z:${currentScale.toFixed(2)}x`;

    // D. Run Simulation Systems!
    // This tells the entities and the ecosystem to process their behaviors
    updateEcosystem();
    updateEntities();

    // E. Request the next frame (loops continuously)
    requestAnimationFrame(gameLoop);
}

// ==========================================
// 6. INITIALIZATION
// ==========================================
createBubbles();
initializeEcosystem(); // Spawn the starting food/creatures
gameLoop(); // Start the engine!
