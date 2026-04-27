const gridElement = document.getElementById('grid')
const newEventButton = document.getElementById('new-event-button')
const newEventWindow = document.getElementById('new-event-window')
const newEventCloseButton = document.getElementById('new-event-close-button')
const createEventButton = document.getElementById('create-new-event-button')
const eventForm = document.getElementById('new-event-form')

let cellHeight = parseFloat(
    window.getComputedStyle(document.body).getPropertyValue('--schedule-cell-height')
)

newEventButton.addEventListener('click', showNewEventWindow)
newEventCloseButton.addEventListener('click', closeNewEventWindow)
eventForm.addEventListener('submit', (e) => {
    e.preventDefault()
    validateAndCreateEvent()
})

window.addEventListener('resize', updateCellSize)
updateCellSize()

updateDates()

function showNewEventWindow() {
    newEventWindow.style.visibility = 'visible'

    const date = new Date()
    let currentDay = date.getDay()
    const currentHour = date.getHours()

    // getDay returns 0 if its a Sunday so converting it
    if (currentDay == 0) {
        currentDay = 7
    }

    eventForm.elements.title.value = ''
    eventForm.elements.desc.value = ''
    eventForm.elements.days.value = currentDay
    eventForm.elements.start.value = String(currentHour) + ':00'
    eventForm.elements.end.value = String(currentHour + 1) + ':00'
}

function closeNewEventWindow() {
    newEventWindow.style.visibility = 'hidden'
}

function timeStrToGrid(timeStr) {
    const time = timeStr.split(/[:.]/)

    const hours = Number(time[0])
    let minutes
    if (time[1]) {
        minutes = Number(time[1])
    }

    return {
        row: hours + 1,
        offset: minutes / 60 
    }
}

function createEventElements(title, description, day, startTime, endTime) {
    const newEvent = document.createElement('div')
    newEvent.className = 'event-container'
    gridElement.appendChild(newEvent)

    const { row: startRow, offset: startOffset } = timeStrToGrid(startTime)
    const { row: endRow, offset: endOffset } = timeStrToGrid(endTime)

    newEvent.style.gridColumnStart = day
    newEvent.style.gridRowStart = startRow
  
    // Applying offset to the start of the event in case event for example starts at 10:25
    newEvent.style.top = String(cellHeight * startOffset) + 'px'

    // Calculating how long the cell should be so
    // this way we can have events that for example start at 10:25 and end at 12:25
    const startY = startRow * cellHeight + startOffset * cellHeight
    const endY = endRow * cellHeight + endOffset * cellHeight
    const height = endY - startY
    newEvent.style.height = String(height) + 'px'

    newEvent.dataset.startTime = startTime
    newEvent.dataset.endTime = endTime

    const newEventTitle = document.createElement('span')
    newEvent.appendChild(newEventTitle)

    if (title == '') {
        title = 'No title'
    } 
    //else if (title.length > 15) {
    //    title = title.slice(0, 15) + '...'
    //}

    newEventTitle.innerHTML = title

    // Dont display time if event is too short for it to fit well
    if (height > cellHeight / 2) {
        const newEventTime = document.createElement('span')
        newEvent.appendChild(newEventTime)
        newEventTime.innerHTML = startTime + ' - ' + endTime
    }

    // Same with description
    if (height >= cellHeight * 0.9) {
        const desc = document.createElement('span')
        newEvent.appendChild(desc)
        desc.innerHTML = description
    }
}

function validateAndCreateEvent() {
    const title = eventForm.elements.title.value
    const desc = eventForm.elements.desc.value
    const day = eventForm.elements.days.value
    const startTime = eventForm.elements.start.value
    const endTime = eventForm.elements.end.value

    /* 
    regex to check that time is in format hh, hh.mm or hh:mm
    1. [01]?\d = either 0 or 1 as first digit, ? means its optional so first digit can also be empty, \d is any digit as second digit
    2. | = OR, if the first conditions dont apply, 2[0-3] is checked next 
    3. 2[0-4] = if first digit is 2, second digit can be from 0-4
    4. [:.] = either . or : as separator
    5. [0-5]\d = first digit of minutes can be 0-5 and second digit can be any from 0-9
    6. ? means its optional so separator and minutes don't have to be included 
    */
    const timeRegex = /^([01]?\d|2[0-4])([:.]([0-5]\d))?$/
    if (!timeRegex.test(startTime)) {
        console.log('Start time wrong format')
        return
    } else if (!timeRegex.test(endTime)) {
        console.log('End time wrong format')
        return
    }

    createEventElements(title, desc, day, startTime, endTime)
    closeNewEventWindow()
}

function updateCellSize() {
    const scheduleContainer = document.querySelector('.schedule-container')

    // Rounding because pixels with decimals make the grid lines look weird sometimes
    const width = Math.floor(scheduleContainer.clientWidth / 7)
    document.documentElement.style.setProperty('--schedule-cell-width', width + 'px')
}

function updateDates() {
    const date = new Date()
    let currentDay = date.getDay()
    // -1 since querySelectorAll first element index is 0
    if (currentDay == 0) {
        currentDay = 6
    } else {
        currentDay--
    }

    console.log(currentDay)

    const monday = new Date()
    monday.setDate(date.getDate() - currentDay)

    const dayElements = document.querySelectorAll('.day')
    dayElements[currentDay].classList.add('today')

    for (let i = 0; i < dayElements.length; i++) {
        const dateElement = dayElements[i].querySelector('.date')

        // Clone the Monday object so that we are working with previous Monday's date and not current date
        const tempDate = new Date(monday)
        tempDate.setDate(monday.getDate() + i)

        // January is 0 so we add one
        const date = String(tempDate.getDate())
        const month = String(tempDate.getMonth() + 1)

        dateElement.innerHTML = date + '.' + month + '.'
    }
}

createEventElements('test', 'test description', 1, '9:00', '10:00')
createEventElements('offset', 'test description', 1, '10.30', '11.20')
createEventElements('long', 'test description', 2, '10.20', '12.00')
createEventElements('long', 'test description', 7, '11.30', '12.00')
createEventElements('longggggggggggggggggggggggggggggggg', 'test description test oibdasoidbasoidabsiodasioasbdioasbdioasbdoiasbdoiasbodiasbiodasb', 3, '15:00', '16:20')