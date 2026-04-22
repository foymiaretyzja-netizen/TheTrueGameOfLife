// We export this array so the entities.js can "see" and "eat" the food!
export const foods = []; 

// This acts as the "clock" for our ocean currents
let oceanTime = 0; 

export function initializeEcosystem() {
    console.log("Ecosystem Initialized: Spawning floating food sources...");
    generateFood();
}

export function updateEcosystem() {
    oceanTime += 0.01; // Advance the current slightly every frame
    const worldSize = 20000;

    // Loop through every piece of food and make it drift
    foods.forEach(food => {
        if (!food.active) return;

        // Math.sin and Math.cos create smooth, circular swaying movements
        food.x += Math.cos(food.driftAngle + oceanTime) * food.driftSpeed;
        food.y += Math.sin(food.driftAngle + oceanTime) * food.driftSpeed;

        // If they float off the edge of the map, wrap them around to the other side!
        if (food.x < 0) food.x = worldSize;
        if (food.x > worldSize) food.x = 0;
        if (food.y < 0) food.y = worldSize;
        if (food.y > worldSize) food.y = 0;

        // Update their actual position on the screen
        food.element.style.left = `${food.x}px`;
        food.element.style.top = `${food.y}px`;
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
                // Keep the initial random rotation for bittergrass and urchins
                foodElement.style.transform = `rotate(${Math.random() * 360}deg)`;
            }

            foodElement.style.left = `${x}px`;
            foodElement.style.top = `${y}px`;

            world.appendChild(foodElement);

            // Save the drift physics to our array
            foods.push({
                x: x,
                y: y,
                type: config.type,
                element: foodElement, 
                active: true,
                // --- NEW PHYSICS ---
                driftAngle: Math.random() * Math.PI * 2, // Random starting direction
                driftSpeed: Math.random() * 0.8 + 0.2    // Random speed between 0.2 and 1.0
            });
        }
    });

    console.log(`World generated. Spawned ${foods.length} drifting food items.`);
}
