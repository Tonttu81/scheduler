const gridElement = document.getElementById('grid')
const dayElements = document.querySelectorAll('.day')
const previousDayButton = document.getElementById('previous-day-button')
const nextDayButton = document.getElementById('next-day-button')

const eventInfoWindow = document.getElementById('event-info-window')
const eventInfoCloseButton = document.getElementById('event-info-close-button')
const eventInfoTitle = document.getElementById('event-info-title')
const eventInfoTime = document.getElementById('event-info-time')
const eventInfoDescription = document.getElementById('event-info-description')
const eventInfoDeleteButton = document.getElementById('event-info-delete-button')

const newEventButton = document.getElementById('new-event-button')
const newEventWindow = document.getElementById('new-event-window')
const newEventCloseButton = document.getElementById('new-event-close-button')
const createEventButton = document.getElementById('create-new-event-button')
const eventForm = document.getElementById('new-event-form')

const mediaQuery = window.matchMedia('(max-width: 480px)')
let cellHeight = parseFloat(
    window.getComputedStyle(document.body).getPropertyValue('--schedule-cell-height')
)

previousDayButton.addEventListener('click', changeDay)
nextDayButton.addEventListener('click', changeDay)

eventInfoCloseButton.addEventListener('click', closeEventInfoWindow)
eventInfoDeleteButton.addEventListener('click', deleteEventElement)

newEventButton.addEventListener('click', showNewEventWindow)
newEventCloseButton.addEventListener('click', closeNewEventWindow)
eventForm.addEventListener('submit', (e) => {
    e.preventDefault()
    validateAndCreateEvent()
})

window.addEventListener('resize', updateCellSize)
mediaQuery.addEventListener('change', hideExtraEvents)

let events = []

// getDay() returns 0 for Sunday, if it's 0 we change it since our schedule uses 7 for Sunday 
const date = new Date()
const currentDay = date.getDay() === 0 ? 7 : date.getDay()
const currentDate = date.getDate()
const currentHour = date.getHours()

let visibleDay = currentDay

// Used for deleting events
let openEventIndex = null

updateCellSize()
updateDates()
loadEvents()
hideExtraEvents(mediaQuery)

function showNewEventWindow() {
    eventForm.elements.title.value = ''
    eventForm.elements.desc.value = ''
    eventForm.elements.days.value = visibleDay
    eventForm.elements.start.value = String(currentHour) + ':00'
    eventForm.elements.end.value = String(currentHour + 1) + ':00'

    newEventWindow.style.visibility = 'visible'
}

function closeNewEventWindow() {
    newEventWindow.style.visibility = 'hidden'
}

function showEventInfoWindow(e) {
    const eventId = e.currentTarget.id

    // Find which event was opened and populate it's fields
    openEventIndex = events.findIndex(event => event.id === eventId)

    eventInfoTitle.innerHTML = events[openEventIndex].title
    eventInfoTime.innerHTML = events[openEventIndex].startTime + ' - ' + events[openEventIndex].endTime
    eventInfoDescription.innerHTML = events[openEventIndex].desc

    eventInfoWindow.style.visibility = 'visible'
}

function closeEventInfoWindow() {
    openEventIndex = null
    eventInfoWindow.style.visibility = 'hidden'
}

function deleteEventElement() {
    if (openEventIndex !== null) {
        const eventElement = document.getElementById(events[openEventIndex].id)

        // Remove event from our events list and then remove the element
        events = events.filter(event => event.id !== eventElement.id)
        eventElement.remove()
        
        saveEvents()
        closeEventInfoWindow()
    }
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

function createEventElements(id, title, desc, day, startTime, endTime) {
    const newEvent = document.createElement('div')
    newEvent.className = 'event-container'
    newEvent.id = id
    gridElement.appendChild(newEvent)
    newEvent.addEventListener('click', showEventInfoWindow)

    const { row: startRow, offset: startOffset } = timeStrToGrid(startTime)
    const { row: endRow, offset: endOffset } = timeStrToGrid(endTime)

    // If screen is small, only one day is visible so set to column one
    if (mediaQuery.matches) {
        newEvent.style.gridColumnStart = 1
    } else {
        newEvent.style.gridColumnStart = day
    }
    
    newEvent.style.gridRowStart = startRow
  
    // Applying offset to the start of the event in case event for example starts at 10:25
    newEvent.style.top = String(cellHeight * startOffset) + 'px'

    // Calculating how long the cell should be so
    // this way we can have events that for example start at 10:25 and end at 12:25
    const startY = startRow * cellHeight + startOffset * cellHeight
    const endY = endRow * cellHeight + endOffset * cellHeight
    const height = endY - startY
    newEvent.style.height = String(height) + 'px'

    const newEventTitle = document.createElement('span')
    newEvent.appendChild(newEventTitle)

    if (title == '') {
        title = 'No title'
    } 

    newEventTitle.innerHTML = title

    // Dont display time if event is too short for it to fit well
    if (height > cellHeight / 2) {
        const newEventTime = document.createElement('span')
        newEvent.appendChild(newEventTime)
        newEventTime.innerHTML = startTime + ' - ' + endTime
    }

    // Same with description
    if (height >= cellHeight * 0.9) {
        const descElement = document.createElement('span')
        newEvent.appendChild(descElement)
        descElement.innerHTML = desc
    }
}

function formatTime(timeStr) {
    // Replace . with :, if number does not have minutes adds :00
    timeStr = timeStr.replace('.', ':')

    const split = timeStr.split(':')
    if (split.length === 1) {
        return split[0] + ':00' 
    }
    
    return timeStr
}

function validateAndCreateEvent() {
    const id = 'event-' + String(events.length)
    const title = eventForm.elements.title.value
    const desc = eventForm.elements.desc.value
    const day = eventForm.elements.days.value
    let startTime = eventForm.elements.start.value
    let endTime = eventForm.elements.end.value

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

    startTime = formatTime(startTime)
    endTime = formatTime(endTime)

    createEventElements(id, title, desc, day, startTime, endTime)

    // Saving event information to an object and saving to localstorage
    const eventObject = {
        id: id,
        title: title,
        desc: desc,
        day: day,
        startTime: startTime,
        endTime: endTime
    }
    events.push(eventObject)
    console.log(events)
    saveEvents()

    closeNewEventWindow()
}

function updateCellSize() {
    const scheduleContainer = document.querySelector('.schedule-container')

    // Rounding because pixels with decimals make the grid lines look weird sometimes
    const width = Math.floor(scheduleContainer.clientWidth / 7)
    document.documentElement.style.setProperty('--schedule-cell-width', width + 'px')
}

function hideExtraEvents() {
    // If window size gets too small and only one day is shown on the screen, this hides events from days that are not currently visible
    if (mediaQuery.matches) {
        // Hide all other dates except for the current date
        for (let i = 0; i < dayElements.length; i++) {
            // i + 1 since querySelectorAll starts from 0 and visibleDay is from 1-7
            if (i + 1 != visibleDay) {
                dayElements[i].style.display = 'none'
            } else {
                dayElements[i].style.display ='flex'
            }
        }

        // Hide events from other days
        events.forEach(event => {
            const eventElement = document.getElementById(event.id)

            if (event.day == visibleDay) {
                eventElement.style.display = 'flex'
                eventElement.style.gridColumnStart = 1
            } else {
                eventElement.style.display = 'none'
            }
        })

    } else {
        visibleDay = currentDay

        dayElements.forEach(dayElem => {
            dayElem.style.display = 'flex'
        })

        // All days are visible so make all events visible and move them to the correct day
        events.forEach(event => {
            const eventElement = document.getElementById(event.id)
            
            eventElement.style.display = 'flex'
            eventElement.style.gridColumnStart = event.day
        })
    }
}

function updateDates() {
    // -1 since querySelectorAll first element index is 0
    const day = currentDay - 1

    const previousMonday = new Date()
    previousMonday.setDate(currentDate - day)

    // Highlight current day
    dayElements[day].classList.add('today')

    for (let i = 0; i < dayElements.length; i++) {
        const dateElement = dayElements[i].querySelector('.date')

        // Clone the Monday object so that we are working with previous Monday's date and not current date
        const tempDate = new Date(previousMonday)
        tempDate.setDate(previousMonday.getDate() + i)

        // January is 0 so we add one
        const date = String(tempDate.getDate())
        const month = String(tempDate.getMonth() + 1)
        const year = String(tempDate.getFullYear())

        dateElement.innerHTML = date + '.' + month + '.' + year
    }
}

function changeDay(e) {
    const buttonId = e.currentTarget.id

    // Increment or decrement visibleDay, values are clamped 1-7
    if (buttonId === 'previous-day-button') {
        visibleDay = Math.max(1, visibleDay - 1)
    } else if (buttonId === 'next-day-button') {
        visibleDay = Math.min(7, visibleDay + 1)
    }

    hideExtraEvents()
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events))
}

function loadEvents() {
    // get "events" key from localStorage
    // loop through them and call create event on each one
    if (localStorage.getItem('events') != null) {
        events = JSON.parse(localStorage.getItem('events'))

        events.forEach(event => {
            createEventElements(event.id, event.title, event.desc, event.day, event.startTime, event.endTime)
        })
    }

    console.log(events)   
}