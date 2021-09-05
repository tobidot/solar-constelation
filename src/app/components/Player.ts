import { Colors } from "@game.object/ts-game-toolbox";
import { PlayerID } from "../consts/GameStates";
import { AppInitialized } from "../events/AppInitialized";
import { Main } from "../Main";
import { FieldColor, FieldType } from "./Field";

interface Settings {

}

export class Player {
    protected static readonly default_settings: Settings = {};

    public settings: Settings;
    public elements: Elements;
    public logic: Logic;
    public props: Properties;
    public components: Components;
    public listeners: Listeners;

    public constructor(
        public main: Main,
        config: Partial<Settings> = {}
    ) {
        this.settings = Object.assign({}, Player
            .default_settings, config);
        this.elements = new Elements(this);
        this.logic = new Logic(this);
        this.props = new Properties(this);
        this.components = new Components(this);
        this.listeners = new Listeners(this);

    }
}

class Elements {
    constructor(
        public parent: Player

    ) {

    }
}

class Logic {
    constructor(
        public parent: Player

    ) {

    }

    public draw() {
        const context = this.parent.props.context;
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillStyle = Colors.WHITE.to_hex();
        this.parent.props.context.fillText(this.parent.props.name + " : " + this.parent.props.points, 10, 4);
        this.parent.props.context.fillText("High Score : " + this.parent.props.high_score, 10, 34);
    }

    public reset() {
        this.parent.props.points = 100;
        this.parent.props.high_score = 100;
        this.parent.props.wanted_constelations = [
            this.random_constelation(),
            this.random_constelation(),
            this.random_constelation(),
        ];
    }

    public random_constelation(): [FieldColor, FieldColor, FieldColor] {
        return [
            this.random_color(),
            this.random_color(),
            this.random_color(),
        ];
    }

    public random_color(): FieldColor {
        const values = Object.values(FieldColor).filter((v): v is FieldColor => typeof v === "number" && v !== FieldColor.NONE && v !== FieldColor.BLUE);
        const index = Math.floor(Math.random() * values.length);
        return values[index];
    }
}

class Properties {
    public id: PlayerID = PlayerID.PLAYER;
    public name: string = "Unkown";
    public context: CanvasRenderingContext2D;
    public points: number = 0;
    public wanted_constelations: Array<[FieldColor, FieldColor, FieldColor]> = [];
    public high_score: number = 0;

    constructor(
        public parent: Player
    ) {
        this.context = this.parent.main.props.context;
    }
}

class Components {
    constructor(
        public parent: Player
    ) {

    }
}

class Listeners {
    constructor(
        public parent: Player
    ) {
        this.parent.main.events.attach(AppInitialized, this.on_init);
    }

    protected on_init = () => {
        this.parent.logic.reset();
    }
}
