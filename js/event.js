export class Event {
    #title
    #description
    #day
    #startTime
    #endTime

    constructor(title, desc, day, startTime, endTime) {
        this.#title = title;
        this.#description = desc;
        this.#day = day;
        this.#startTime = startTime;
        this.#endTime = endTime;
    }
}