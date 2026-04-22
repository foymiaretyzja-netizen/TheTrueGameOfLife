// Pulling in a lightweight, lightning-fast Simplex Noise library
import { createNoise2D } from 'https://unpkg.com/simplex-noise@4.0.1/dist/esm/simplex-noise.js';

// We export this array so the brain.js and entities.js can see where the walls are!
export const colliders = []; 

export function initializeEcosystem() {
    console.log("Ecosystem Initialized: Generating terrain...");
    generateTerrain();
}

export function updateEcosystem() {
    // We will add plant growth logic here later
}

function generateTerrain() {
    const world = document.getElementById('world');
    const noise2D = createNoise2D();
    
    const worldSize = 20000;
    const tileSize = 400; // Massive 400x400 pixel rocks for performance
    
    // Tweak these to change the map shape!
    const noiseScale = 0.003; // Keeps the landmasses sweeping and large
    const threshold = 0.78;   // RAISED: Only the very highest peaks become rocks now (more open water!)

    let rockCount = 0;

    for (let x = 0; x < worldSize; x += tileSize) {
        for (let y = 0; y < worldSize; y += tileSize) {
            
            // Get a noise value between -1 and 1
            const value = noise2D(x * noiseScale, y * noiseScale);
            
            // If the value is high enough, spawn a rock
            if (value > threshold) {
                let rock = document.createElement('div');
                rock.classList.add('rock');
                
                // 1. Add slight random variation to the size
                let widthVariation = tileSize + (Math.random() * 60 - 30);
                let heightVariation = tileSize + (Math.random() * 60 - 30);
                
                // 2. Generate a totally random, organic border-radius for EACH rock
                // We pick 8 random percentages between 35% and 65%
                let r = () => Math.floor(Math.random() * 30 + 35);
                let randomBlobShape = `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;
                
                // 3. Give it a random rotation so they don't all face the same way
                let randomRotation = Math.random() * 360;

                // Apply the unique styles
                rock.style.width = `${widthVariation}px`; 
                rock.style.height = `${heightVariation}px`;
                rock.style.left = `${x}px`;
                rock.style.top = `${y}px`;
                rock.style.borderRadius = randomBlobShape;
                rock.style.transform = `rotate(${randomRotation}deg)`;
                
                world.appendChild(rock);
                
                // Save the data so creatures can crash into them later
                colliders.push({ x, y, width: tileSize, height: tileSize });
                rockCount++;
            }
        }
    }
    console.log(`World generated. Spawned ${rockCount} rock formations.`);
}
