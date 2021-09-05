import { Vector2, Vector2I } from "@game.object/ts-game-toolbox";
import { rorate_setting } from "../consts/GameSettings";
import { PlayerID } from "../consts/GameStates";
import { Main } from "../Main";
import { Field, FieldColor, FieldType } from "./Field";
import { Player } from "./Player";

interface Settings {

}

export class GameLogic {
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
        this.settings = Object.assign({}, GameLogic.default_settings, config);
        this.elements = new Elements(this);
        this.logic = new Logic(this);
        this.props = new Properties(this);
        this.components = new Components(this);
        this.listeners = new Listeners(this);
    }
}

class Elements {
    public canvas: HTMLCanvasElement;

    constructor(
        public parent: GameLogic
    ) {
        this.canvas = parent.main.elements.canvas;
    }
}

class Logic {
    constructor(
        public parent: GameLogic
    ) {

    }

    public click(canvas_position: Vector2I) {
        const field_pos = new Vector2({
            x: Math.trunc(canvas_position.x * this.parent.main.components.board.props.width / 512),
            y: Math.trunc(canvas_position.y * this.parent.main.components.board.props.height / 512),
        });
        const field = this.parent.main.components.board.logic.at(field_pos);
        if (!field || field.props.gravity_radius <= 0) return;
        let rotated = false;
        for (let i = 1; i < field.props.gravity_radius; ++i) {
            rotated = this.rotate_ring(field_pos, i) || rotated;
        }
        if (rotated) {
            this.earn_points();
            this.next_turn();
        }
        // invalid move if nothing rotated
        // field.props.type = rorate_setting(FieldType, field.props.type);
    }

    public earn_points() {
        const habitable_planets = this.parent.main.components.board.components.fields.filter((field) => {
            return field.props.type === FieldType.HABITABLE_PLANET;
        });
        const constelations = this.parent.main.components.player.props.wanted_constelations;
        const add = (a: number, b: number) => a + b;
        const part_points = constelations.map((constelation, index) => {
            const hits = habitable_planets.map((field) => this.count_hits_for(constelation, field)).reduce(add, 0);
            if (hits === 0) return 0;
            constelations[index] = this.parent.main.components.player.logic.random_constelation();
            return (hits + 2) * (hits + 1);
        }, 0);

        const points = part_points.reduce(add);
        this.parent.main.components.player.props.points += points;
    }

    public count_hits_for(constelation: [FieldColor, FieldColor, FieldColor], field: Field): number {
        const color_ray_up = this.get_color_ray(field, Vector2.UP);
        const color_ray_right = this.get_color_ray(field, Vector2.RIGHT);
        const color_ray_down = this.get_color_ray(field, Vector2.DOWN);
        const color_ray_left = this.get_color_ray(field, Vector2.LEFT);
        const dirs = [Vector2.UP, Vector2.RIGHT, Vector2.DOWN, Vector2.LEFT];
        const rays = [color_ray_up, color_ray_right, color_ray_down, color_ray_left];
        const hits = rays.map((ray, index): number => {
            const hit = this.does_ray_contain_constelation(ray, constelation);
            if (hit) {
                this.parent.main.components.game_page.logic.spawn_ray(field, dirs[index]);
            }
            return hit ? 1 : 0;
        });
        const add = (a: number, b: number) => a + b;
        return hits.reduce(add);
    }

    public does_ray_contain_constelation(ray: Array<FieldColor>, constelation: [FieldColor, FieldColor, FieldColor]): boolean {
        let states = new Array<number>();
        ray.forEach((color) => {
            states = states.map((state: number) => {
                if (state === 3) return 3;      // found a hit
                if (state === -1) return -1;    // dead trace
                const expect = constelation[state];
                if (expect !== color) return -1;    // missmatch => kill
                return state + 1;               // match => next step
            });
            if (constelation[0] === color) {
                states.push(1);
            }
        });
        // is any state machine at point 2
        return states.includes(3);
    }

    public get_color_ray(start: Field, dir: Vector2): Array<FieldColor> {
        let current: Field | null = start;
        const ray = new Array<FieldColor>();
        while (current = this.parent.main.components.board.logic.at(current.props.position.cpy().add(dir))) {
            if (current.props.color !== FieldColor.NONE) {
                ray.push(current.props.color);
            }
        }
        return ray;
    }

    public next_turn() {
        this.parent.props.turn++;
        const loss = Math.ceil((5 + this.parent.props.turn) ** 2 / 125);
        this.parent.main.components.player.props.points -= loss;
        this.parent.main.components.player.props.high_score = Math.max(
            this.parent.main.components.player.props.high_score,
            this.parent.main.components.player.props.points,
        );
    }

    public rotate_ring(center: Vector2I, radius: number): boolean {
        const fields = new Array<Field | null>();
        const field_pos = new Vector2(center).sub({ x: radius, y: radius });
        [
            Vector2.RIGHT,
            Vector2.DOWN,
            Vector2.LEFT,
            Vector2.UP,
        ].forEach((direction) => {
            for (let i = 0; i < radius * 2; ++i) {
                fields.push(this.parent.main.components.board.logic.at(field_pos));
                field_pos.add(direction);
            }
        });
        const valid_fields = fields.filter((f): f is Field => f !== null);
        if (valid_fields.length <= 0) return false;
        valid_fields.reduce((a: Field, b: Field): Field => {
            [a.props.position, b.props.position] = [b.props.position, a.props.position];
            return a;
        });
        return true;
    }

    public reset() {
        this.parent.props.turn = 0;
        this.parent.props.active_player = PlayerID.PLAYER;
    }
}

class Properties {
    public active_player: PlayerID = PlayerID.PLAYER;
    public turn: number = 0;

    constructor(
        public parent: GameLogic

    ) {

    }
}

class Components {

    constructor(
        public parent: GameLogic

    ) {
    }
}

class Listeners {
    constructor(
        public parent: GameLogic

    ) {
    }

}
