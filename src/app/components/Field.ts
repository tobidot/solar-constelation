import { get_element_by_id, Vector2 } from "@game.object/ts-game-toolbox";
import { get_image } from "../../utils/utils";
import { Main } from "../Main";

interface Settings {

}

export enum FieldType {
    EMPTY,
    HABITABLE_PLANET,
    GAS_GIANT,
    BLACK_HOLE,
    YELLOW_DWARF,
    RED_GIANT,
}


export enum FieldColor {
    NONE,
    RED,
    BLUE,
    YELLOW,
    // GREEN,
    PURPLE
}

export class Field {
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
        this.settings = Object.assign({}, Field
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
        public parent: Field

    ) {
    }
}

class Logic {
    constructor(
        public parent: Field

    ) {

    }

    public draw() {
        const image = this.get_image();
        if (image === null) return;
        this.parent.props.context.drawImage(
            image,
            this.parent.props.position.x * 64,
            this.parent.props.position.y * 64,
        );
    }

    public get_image(): HTMLImageElement | null {
        switch (this.parent.props.type) {
            case FieldType.EMPTY:
                return null;
            case FieldType.BLACK_HOLE:
                return get_image('black-hole');
            case FieldType.YELLOW_DWARF:
                return get_image('yellow-dwarf');
            case FieldType.RED_GIANT:
                return get_image('red-giant');
            case FieldType.GAS_GIANT:
                return get_image('gas-giant');
            case FieldType.HABITABLE_PLANET:
                return get_image('habitable-planet');
        }
        throw new Error("Unkown image" + this.parent.props.type);
    }

}

class Properties {
    public context: CanvasRenderingContext2D;
    public position: Vector2 = new Vector2;
    public type: FieldType = FieldType.EMPTY;
    public gravity_radius: number = 0;
    public color: FieldColor = FieldColor.NONE;

    constructor(
        public parent: Field
    ) {
        this.context = parent.main.props.context;
    }
}

class Components {
    constructor(
        public parent: Field

    ) {

    }
}

class Listeners {
    constructor(
        public parent: Field

    ) {

    }
}
