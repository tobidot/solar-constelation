import { AppEvent } from "./AppEvent";

export class AppInitialized extends AppEvent {
    public static readonly event_name: string = "app-initialized";

    public constructor() {
        super(AppInitialized.event_name);
    }
}