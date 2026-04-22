// Import our new brain!
import { Prey } from './prey-brain.js';

export const aliveEntities = [];

export function initializeEntities() {
    console.log("Entities Initialized: Spawning Generation 1 Prey.");
    
    // Spawn 200 prey randomly across the map
    for (let i = 0; i < 200; i++) {
        let x = Math.random() * 20000;
        let y = Math.random() * 20000;
        aliveEntities.push(new Prey(x, y));
    }
}

export function updateEntities() {
    // Tell every living creature to update its brain and move
    aliveEntities.forEach(entity => {
        entity.update();
    });
}
