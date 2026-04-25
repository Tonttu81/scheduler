daily schedule viewer & maker?
not a calendar, can only mark activities for each day of the week, every week has the same configured activities

homepage shows current date&time and the entire weeks schedule 

second page is a settings page:
not sure what settings to add yet, maybe import/export?

second page shows entire schedule where the user can configure the schedule
should be able to add/remove/modify events for each day of the week

each event has fields:
- day of the week
- start time
- end time
- title
- note/description
- anything else?

schedule is saved to localstorage

page should scale well on mobile as well: use flexbox for schedule and change direction depending on screen size?

timezone problems?



how should the schedule be saved to storage?
should the entire week be saved as a json?

example:
localstorage.setItem(
    {
        "schedule": {"mon":{... , events:[], ...}, "tue":{...}}
    }
)


todo
media query to make schedule only 1 column wide when monitor size is smaller
javascript to show current day on grid if grid is only one column wide
javascript to let user scroll to different days if only one column is shown
make event divs clickable to open new window with more info and options
