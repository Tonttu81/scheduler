const gridElement = document.getElementById('grid')

function createEvent(day, startTime, endTime) {
    const newEvent = document.createElement('div');
    gridElement.appendChild(newEvent);
    
    newEvent.style.gridColumnStart = day;
    newEvent.style.gridRowStart = startTime;
    newEvent.style.gridRowEnd = endTime;
}

createEvent(3, 4, 5);
createEvent(1, 2, 6);
createEvent(3, 4, 5);
createEvent(3, 3, 5);