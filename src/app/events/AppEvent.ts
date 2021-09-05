import { EventBase } from "../../utils/EventSocket";

export class AppEvent extends EventBase {
    constructor(
        event_name: string
    ) {
        super(event_name);
    }
}