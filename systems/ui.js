export let selectedEntity = null;
export let debugMode = false;

export function selectEntity(entity) {
    // Deselect the old entity if one exists
    if (selectedEntity && selectedEntity.element) {
        selectedEntity.element.classList.remove('selected');
    }
    
    selectedEntity = entity;
    
    // Select the new entity and show the UI
    if (entity) {
        entity.element.classList.add('selected');
        document.getElementById('target-ui').style.display = 'flex';
    } else {
        document.getElementById('target-ui').style.display = 'none';
    }
}

export function toggleDebugMode() {
    debugMode = !debugMode;
    const world = document.getElementById('world');
    
    if (debugMode) {
        world.classList.add('debug-mode');
    } else {
        world.classList.remove('debug-mode');
    }
    console.log(`Debug Cones: ${debugMode ? 'ON' : 'OFF'}`);
}

export function updateUI() {
    if (!selectedEntity) return;

    // Update biological stats
    document.getElementById('ui-health').innerText = Math.round(selectedEntity.health);
    document.getElementById('ui-hunger').innerText = Math.round(selectedEntity.hunger);
    
    // Quick debug logic to translate their raw sensory data into text
    let actionText = "Wandering";
    if (selectedEntity.senses.visionCenter > 0) actionText = "Seeing Food (Center)";
    else if (selectedEntity.senses.visionLeft > 0) actionText = "Seeing Food (Left)";
    else if (selectedEntity.senses.visionRight > 0) actionText = "Seeing Food (Right)";
    
    document.getElementById('ui-action').innerText = actionText;
}
