export class Prey {
    constructor(x, y) {
        // Core position
        this.x = x;
        this.y = y;
        
        // Direction and Motor
        this.angle = Math.random() * 360; // Facing a random direction
        this.speed = 2; // Pixels per frame
        
        // Biological Stats
        this.health = 100;
        this.hunger = 100;
        this.stamina = 100;

        // Visual Body
        this.element = document.createElement('div');
        this.element.classList.add('prey');
        document.getElementById('world').appendChild(this.element);
    }

    // This runs every single frame
    update() {
        // Convert degrees to radians for the math engine
        let radians = this.angle * (Math.PI / 180);
        
        // Swim forward
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;

        // Map wrapping (if they swim off the edge, they appear on the other side)
        if (this.x < 0) this.x = 20000;
        if (this.x > 20000) this.x = 0;
        if (this.y < 0) this.y = 20000;
        if (this.y > 20000) this.y = 0;

        // Update CSS on screen (We add +45 degrees because of how CSS rotates our teardrop shape)
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = `rotate(${this.angle + 45}deg)`;
    }
}
