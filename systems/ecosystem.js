// Export the foods array and our new performance toggle
export const foods = []; 
export let performanceMode = false;

let oceanTime = 0; 

export function initializeEcosystem() {
    console.log("Ecosystem Initialized: Spawning floating food...");
    generateFood();
}

// --- NEW: Performance Toggle ---
export function togglePerformanceMode() {
    performanceMode = !performanceMode;
    console.log(`Performance Mode: ${performanceMode ? 'ON' : 'OFF'}`);

    if (performanceMode) {
        // Find all food that is still alive
        let activeFoods = foods.filter(f => f.active);
        
        // Calculate half of them
        let foodsToKill = Math.floor(activeFoods.length / 2);
        
        // Shuffle the array so we delete them randomly, keeping the map spread out
        activeFoods.sort(() => Math.random() - 0.5);

        // Eradicate 50% of them permanently
        for (let i = 0; i < foodsToKill; i++) {
            activeFoods[i].active = false;
            // Remove the HTML element completely to save memory
            if (activeFoods[i].element) {
                activeFoods[i].element.remove();
            }
        }
        console.log(`Purged ${foodsToKill} food items for performance.`);
    }
}

// We now pass the camera coordinates from engine.js into the ecosystem!
export function updateEcosystem(camX, camY, scale, screenW, screenH) {
    oceanTime += 0.01; 
    const worldSize = 20000;

    // Calculate the exact borders of what the camera can see
    // We add a 200px "padding" so items don't visibly pop into existence
    const padding = 200;
    const viewLeft = -camX / scale - padding;
    const viewRight = (-camX + screenW) / scale + padding;
    const viewTop = -camY / scale - padding;
    const viewBottom = (-camY + screenH) / scale + padding;

    foods.forEach(food => {
        if (!food.active) return;

        // Always calculate the drift math so they keep moving off-screen
        food.x += Math.cos(food.driftAngle + oceanTime) * food.driftSpeed;
        food.y += Math.sin(food.driftAngle + oceanTime) * food.driftSpeed;

        if (food.x < 0) food.x = worldSize;
        if (food.x > worldSize) food.x = 0;
        if (food.y < 0) food.y = worldSize;
        if (food.y > worldSize) food.y = 0;

        // --- Frustum Culling ---
        let isVisible = true;
        if (performanceMode) {
            // Check if the food is inside the camera borders
            isVisible = (food.x > viewLeft && food.x < viewRight && food.y > viewTop && food.y < viewBottom);
        }

        // Only update the actual CSS if it is on screen (or if performance mode is off)
        if (isVisible) {
            food.element.style.left = `${food.x}px`;
            food.element.style.top = `${food.y}px`;
        }
    });
}

function generateFood() {
    const world = document.getElementById('world');
    const worldSize = 20000;

    const foodTypes = [
        { type: 'bittergrass', count: 1500 }, 
        { type: 'seaweed', count: 600 },      
        { type: 'urchin', count: 400 }        
    ];

    foodTypes.forEach(config => {
        for (let i = 0; i < config.count; i++) {
            let x = Math.random() * worldSize;
            let y = Math.random() * worldSize;

            let foodElement = document.createElement('div');
            foodElement.classList.add(config.type);
            
            if (config.type === 'seaweed') {
                foodElement.style.animationDelay = `${Math.random() * 2}s`;
            } else {
                foodElement.style.transform = `rotate(${Math.random() * 360}deg)`;
            }

            foodElement.style.left = `${x}px`;
            foodElement.style.top = `${y}px`;

            world.appendChild(foodElement);

            foods.push({
                x: x,
                y: y,
                type: config.type,
                element: foodElement, 
                active: true,
                driftAngle: Math.random() * Math.PI * 2, 
                driftSpeed: Math.random() * 0.8 + 0.2    
            });
        }
    });
}
