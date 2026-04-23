const gridElement = document.getElementById('grid')
const newEventButton = document.getElementById('new-event-button')
const newEventWindow = document.getElementById('new-event-window')
const newEventCloseButton = document.getElementById('new-event-close-button')
const createEventButton = document.getElementById('create-new-event-button')

// New event window elements
const dayDropdown = document.getElementById('new-event-days')
const eventTitleInput = document.getElementById('new-event-title')
const eventDescriptionInput = document.getElementById('new-event-description')
const startTimeInput = document.getElementById('new-event-start')
const endTimeInput = document.getElementById('new-event-end')
const recurringEventInput = document.getElementById('new-event-recurring')

newEventButton.addEventListener('click', showNewEventWindow)
newEventCloseButton.addEventListener('click', closeNewEventWindow)
createEventButton.addEventListener('click', validateAndCreateEvent)

function showNewEventWindow() {
    newEventWindow.style.visibility = 'visible'

    const date = new Date()
    const currentDay = date.getDay()
    const currentHour = date.getHours()

    dayDropdown.value = currentDay
    startTimeInput.value = String(currentHour) + ':00'
    endTimeInput.value = String(currentHour + 1) + ':00'
    recurringEventInput.checked = false
}

function closeNewEventWindow() {
    newEventWindow.style.visibility = 'hidden'
}

function timeStrToGrid(timeStr) {
    //const [startHours, startMinutes] = startTime.split(':').map(Number)

    const hour = timeStr.split(':')[0]
    // Adding one since otherwise events would be an hour too early
    const row = Number(hour) + 1

    return row
}

function createEventElements(title, description, day, startTime, endTime) {
    const newEvent = document.createElement('div')
    newEvent.className = 'event-container'
    gridElement.appendChild(newEvent)

    // Replacing . with : incase the user tried using the wrong separator
    startTime = startTime.replace('.', ':')
    endTime = endTime.replace('.', ':')

    newEvent.style.gridColumnStart = day
    newEvent.style.gridRowStart = timeStrToGrid(startTime)
    newEvent.style.gridRowEnd = timeStrToGrid(endTime)

    const newEventTitle = document.createElement('span')
    newEvent.appendChild(newEventTitle)

    if (title == '') {
        title = 'No title'
    }
    newEventTitle.innerHTML = title
    
    const newEventTime = document.createElement('span')
    newEvent.appendChild(newEventTime)
    newEventTime.innerHTML = startTime + ' - ' + endTime
}

function validateAndCreateEvent() {
    const title = eventTitleInput.value
    const desc = eventDescriptionInput.value

    const day = dayDropdown.value

    const startTime = startTimeInput.value
    const endTime = endTimeInput.value

    const test = Number(startTime.replace(':', '.'))
    console.log(test)
    if (test >= 0 && test <= 24) {
        createEventElements(title, desc, day, startTime, endTime)
        closeNewEventWindow()
    }

    
}

createEventElements('test', 'test description', 1, '9:00', '10:00')