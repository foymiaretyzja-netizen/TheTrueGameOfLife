// We need to import the food array so the fish can "see" it!
import { foods } from './ecosystem.js';

export class Prey {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * 360; 
        
        // Biological Stats
        this.health = 100;
        this.hunger = 100;
        this.stamina = 100;
        
        // The Reward System
        this.rewardTimer = 0; // Increases as they survive, drops if they take damage
        
        // --- NEW: SENSORY INPUTS ---
        this.visionDistance = 300; // How far they can see in pixels
        this.senses = {
            visionLeft: 0,   // 0 (nothing) to 1 (food right in front of my left eye)
            visionCenter: 0,
            visionRight: 0,
            hungerLevel: 1.0 // 1.0 is full, 0.0 is starving
        };

        // --- NEW: THE BRAIN ---
        // We will build the actual matrix math for these 50 neurons in the next step
        this.brain = {
            inputs: 4,       // Left, Center, Right, Hunger
            hiddenNodes: 50, // Your requested 50-neuron processing layer
            outputs: 2       // Turn Angle, Swim Speed
        };

        this.element = document.createElement('div');
        this.element.classList.add('prey');
        document.getElementById('world').appendChild(this.element);
    }

    // --- NEW: THE EYES ---
    lookAround() {
        // Reset vision every frame
        this.senses.visionLeft = 0;
        this.senses.visionCenter = 0;
        this.senses.visionRight = 0;

        // Loop through the ecosystem food to see what is nearby
        foods.forEach(food => {
            if (!food.active) return;

            // Calculate distance to food using Pythagorean theorem
            let dx = food.x - this.x;
            let dy = food.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // If the food is close enough to see...
            if (distance < this.visionDistance) {
                // Calculate the angle to the food
                let angleToFood = Math.atan2(dy, dx) * (180 / Math.PI);
                
                // Find the difference between where the fish is looking and where the food is
                let angleDiff = angleToFood - this.angle;
                
                // Normalize the angle to be between -180 and 180
                while (angleDiff <= -180) angleDiff += 360;
                while (angleDiff > 180) angleDiff -= 360;

                // Sort the food into the 3 vision cones (Left, Center, Right)
                let visualIntensity = 1 - (distance / this.visionDistance); // Closer = stronger signal (closer to 1)

                if (angleDiff > -45 && angleDiff < -15) {
                    this.senses.visionLeft = Math.max(this.senses.visionLeft, visualIntensity);
                } else if (angleDiff >= -15 && angleDiff <= 15) {
                    this.senses.visionCenter = Math.max(this.senses.visionCenter, visualIntensity);
                } else if (angleDiff > 15 && angleDiff < 45) {
                    this.senses.visionRight = Math.max(this.senses.visionRight, visualIntensity);
                }
            }
        });
    }

    update() {
        // 1. Gather Sensory Data
        this.lookAround();
        this.senses.hungerLevel = this.hunger / 100;

        // 2. Feed Data to the 50 Neurons (Placeholder logic until we write the neural math)
        // For right now, if they see food on the left, they steer left. If nothing, they swim straight.
        let steerOutput = 0;
        if (this.senses.visionLeft > this.senses.visionRight) steerOutput = -2;
        else if (this.senses.visionRight > this.senses.visionLeft) steerOutput = 2;
        
        let speedOutput = 2; // Base speed

        // 3. Apply Brain Outputs to Motor Functions
        this.angle += steerOutput;
        let radians = this.angle * (Math.PI / 180);
        
        this.x += Math.cos(radians) * speedOutput;
        this.y += Math.sin(radians) * speedOutput;

        // Map wrapping
        if (this.x < 0) this.x = 20000;
        if (this.x > 20000) this.x = 0;
        if (this.y < 0) this.y = 20000;
        if (this.y > 20000) this.y = 0;

        // Update CSS on screen
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = `rotate(${this.angle}deg)`;
        
        // Increase mental reward timer for surviving another frame
        this.rewardTimer++;
    }
}
