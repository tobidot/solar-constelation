import { Vector2, Vector2I } from "@game.object/ts-game-toolbox";
import { MapSizeSetting } from "../consts/GameSettings";
import { FieldFactory } from "../factories/FieldFactory";
import { Main } from "../Main";
import { Field } from "./Field";

interface Settings {

}

export class Board {
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
        this.settings = Object.assign({}, Board
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
        public parent: Board

    ) {

    }
}

class Logic {
    constructor(
        public parent: Board

    ) {

    }

    public create_board() {
        let has_planet = false;
        let count_red = 0;
        let count_yellow = 0;
        let count_purple = 0;
        this.parent.components.fields = [];
        for (let x = 0; x < this.parent.props.width; ++x) {
            for (let y = 0; y < this.parent.props.height; ++y) {
                const factory = new FieldFactory(this.parent.main);
                factory.empty().position(x, y);
                if (x === Math.trunc(this.parent.props.width / 2)
                    && y === Math.trunc(this.parent.props.height / 2)) {
                    factory.black_hole();
                } else if (Math.random() < 0.01) {
                    factory.red_giant();
                    count_red++;
                } else if (Math.random() < 0.03) {
                    factory.yellow_dwarf();
                    count_yellow++;
                } else if (Math.random() < 0.1) {
                    factory.gas_giant();
                    count_purple++;
                } else if (Math.random() < 0.01) {
                    factory.habitable_planet();
                    has_planet = true;
                }
                this.parent.components.fields.push(factory.create());
            }
        }
        // try again
        if (!has_planet
            || count_red < 3
            || count_yellow < 3
            || count_purple < 3
        ) this.create_board();
    }

    public draw() {
        const context = this.parent.main.props.context;
        // pixels => 640
        // field_s => 512
        // * 8
        const scale_x = 8 / this.parent.props.width;
        const scale_y = 8 / this.parent.props.height;
        context.scale(scale_x, scale_y);
        this.parent.components.fields.forEach((field: Field) => {
            field.logic.draw();
        });
        context.resetTransform();
    }

    public center_field_to_canvas(field: Vector2I): Vector2 {
        return new Vector2(field).mul(64).add({ x: 32, y: 32 }).mul(8 / this.parent.props.width);
    }

    public at(pos: Vector2I): Field | null {
        return this.parent.components.fields.find((field) => {
            return field.props.position.x === pos.x && field.props.position.y === pos.y;
        }) ?? null;
    }
}

class Properties {
    constructor(
        public parent: Board

    ) {

    }

    public get width(): number {
        switch (this.parent.main.components.menu_page.props.setting_map_size) {
            case MapSizeSetting.BIG:
                return 15;
            case MapSizeSetting.MEDIUM:
                return 11;
            case MapSizeSetting.SMALL:
                return 7;
        }
    }

    public get height(): number {
        switch (this.parent.main.components.menu_page.props.setting_map_size) {
            case MapSizeSetting.BIG:
                return 15;
            case MapSizeSetting.MEDIUM:
                return 11;
            case MapSizeSetting.SMALL:
                return 7;
        }
    }

}

class Components {
    public fields: Array<Field> = [];

    constructor(
        public parent: Board

    ) {

    }


}

class Listeners {
    constructor(
        public parent: Board

    ) {

    }
}
