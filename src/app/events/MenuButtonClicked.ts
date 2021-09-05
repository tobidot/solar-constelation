import { Vector2I } from "@game.object/ts-game-toolbox";
import { AppEvent } from "./AppEvent";

export class MenuButtonClicked extends AppEvent {
    public static readonly event_name: string = "menu-button-click";

    public constructor(
        public position: Vector2I
    ) {
        super(MenuButtonClicked.event_name);
    }
}