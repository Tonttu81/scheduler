const jsonTextExport = document.getElementById('json-text-export')
const jsonFileExport = document.getElementById('json-file-export')

const jsonTextImport = document.getElementById('json-text-import')
const jsonFileImport = document.getElementById('json-file-import')
const jsonImportButton = document.getElementById('json-import-button')
const jsonImportResult = document.getElementById('json-import-result')

const clearEventsButton = document.getElementById('clear-events-button')

jsonImportButton.addEventListener('click', importJson)

jsonTextExport.addEventListener('focus', () => {
    jsonTextExport.select()
})
clearEventsButton.addEventListener('click', clearEvents)

loadExports()

function loadExports() {
    let events = ''
    if (localStorage.getItem('events')) {
        events = localStorage.getItem('events')
    }

    jsonTextExport.value = events

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(events);
    jsonFileExport.setAttribute('href', dataStr)
}

function readJsonFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject

        reader.readAsText(file, 'UTF-8')
    })
}

function verifyJson(jsonStr) {
    let events

    try {
        events = JSON.parse(jsonStr)
    } catch (e) {
        return false
    }

    // Title and description should exist but can be empty
    const requiredFields = ['id', 'day', 'startTime', 'endTime'];
    const optionalFields = ['title', 'desc']

    for (const event of events) {
        // Check that required fields exist and are not empty
        for (const field of requiredFields) {
            if (!Object.hasOwn(event, field) || event[field] === '') {
                console.log(event, field)
                return false;
            }
        }

        // Check that title and description exist
        for (const field of optionalFields) {
            if (!Object.hasOwn(event, field)) {
                return false;
            }
        }
    }

    return true
}

async function importJson() {
    // Check which type is being imported
    let importContent = ''
    if (jsonFileImport.files.length > 0) {
        importContent = await readJsonFile(jsonFileImport.files[0])
    } else if (jsonTextImport.value.trim() !== '') {
        importContent = jsonTextImport.value
    } else {
        jsonImportResult.innerHTML = 'Please select a file or enter the JSON into the input field.'
        return
    }

    // Check validity of imported JSON
    if (verifyJson(importContent)) {
        // If JSON was valid, import events
        localStorage.setItem('events', importContent)

        jsonFileImport.value = ''
        jsonTextImport.value = ''

        jsonImportResult.innerHTML = 'Successfully imported events from JSON.'
    } else {
        jsonImportResult.innerHTML = 'Tried to import an invalid JSON.'
    }
}

function clearEvents() {
    // ask for confirmation
    localStorage.clear()
}