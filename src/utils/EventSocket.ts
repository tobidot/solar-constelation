import { Class } from "@game.object/ts-game-toolbox";

export class EventBase {
    constructor(
        public readonly event_name: string
    ) { }
}

type EventClass<T extends EventBase> = Class<T> & {
    readonly event_name: string;
};

type EventCallback<T extends EventBase> = (event: T) => void;

interface Listener<T extends EventBase> {
    type: EventClass<T>,
    callback: EventCallback<T>,
}

/**
 * An EventSocket provides an easy way to 
 */
export class EventSocket<T extends EventBase> {
    protected listeners: Array<Listener<T>> = [];

    /**
     * Dispatches an event to all listeners that are listening to this specific event.
     * 
     * @param event The dispatched event
     */
    public dispatch(event: T) {
        this.listeners.forEach((next: Listener<T>) => {
            if (event.event_name !== next.type.event_name) return;
            next.callback(event);
        });
    }

    /**
     * Attaches a new Eventlistener to this Eventsocket.
     * 
     * @param type The EventClass to listen for
     * @param callback The function to call when event occurs
     */
    public attach<EVENT extends T>(
        type: EventClass<EVENT>,
        callback: EventCallback<EVENT>,
    ): Listener<T> {
        const listener = {
            type,
            // i cannot staticly ensure that a listener for event A gets called with event B.
            // But this will be ensured in the dispatch method.
            // so i have to tell the compiler this is ok.
            callback: callback as EventCallback<T>,
        };
        this.listeners.push(listener);
        return listener;
    };
}