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

layout

2 by 2 grid

top left empty

bottom left contains times

top right contains horizontal flex day of the week and date

bottom right contains schedule grid