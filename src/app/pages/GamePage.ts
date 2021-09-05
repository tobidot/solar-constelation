import { Colors, get_element_by_id, RgbColor, throw_expression, Vector2 } from "@game.object/ts-game-toolbox";
import { get_2d_context } from "../../utils/utils";
import { Field, FieldColor } from "../components/Field";
import { MenuButton } from "../components/MenuButton";
import { PlayerID } from "../consts/GameStates";
import { MenuButtonClicked } from "../events/MenuButtonClicked";
import { Main, PageName } from "../Main";

interface Settings {

}

export class GamePage {
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
        this.settings = Object.assign({}, config);
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
        public parent: GamePage
    ) {
        this.canvas = get_element_by_id('app', HTMLCanvasElement);
    }
}

class Logic {
    constructor(
        public parent: GamePage
    ) {

    }

    public update(delta_ms: number) {
        const context = this.parent.props.context;
        this.parent.props.context.clearRect(0, 0, 800, 600);
        this.parent.main.components.board.logic.draw();
        this.parent.components.bottom_interface_container.logic.draw();
        this.parent.components.right_interface_container.logic.draw();

        context.translate(550, 200);
        if (this.parent.main.components.game_logic.props.active_player === PlayerID.PLAYER) {
            context.fillStyle = Colors.BLUE.to_hex();
            context.fillRect(0, 0, 230, 30);
        }
        this.parent.main.components.player.logic.draw();
        // context.translate(0, 50);
        // if (this.parent.main.components.game_logic.props.active_player === PlayerID.OPPONTNET) {
        //     context.fillStyle = Colors.BLUE.to_hex();
        //     context.fillRect(0, 0, 230, 50);
        // }
        // this.parent.main.components.opponent.logic.draw();
        context.resetTransform();
        this.draw_constelations();
        this.draw_success_rays();
    }

    public draw_success_rays() {
        const context = this.parent.props.context;
        const lifetime = 500;
        const now = performance.now();
        this.parent.props.success_rays = this.parent.props.success_rays.map((ray): SuccessRay => {
            const age_ms = now - ray.created_at;
            const t = age_ms / lifetime;
            const canvas_pos = this.parent.main.components.board.logic.center_field_to_canvas(ray.start);
            context.beginPath();
            context.moveTo(canvas_pos.x, canvas_pos.y);
            const end = canvas_pos.cpy().add(ray.dir.cpy().mul(800));
            context.lineTo(end.x, end.y);
            context.strokeStyle = new RgbColor(255, 255, 255, 255).to_hex();
            context.lineWidth = Math.round(2 + 10 * t * t);
            context.stroke();
            return ray;
        }).filter(ray => {
            const age_ms = now - ray.created_at;
            return age_ms < lifetime;
        });
    }

    public draw_constelations() {
        const context = this.parent.props.context;
        const constelations = this.parent.main.components.player.props.wanted_constelations;
        for (let i = 0; i < 3; ++i) {
            context.translate(50 + i * 100, 550);
            context.textAlign = "center";
            context.textBaseline = "bottom";
            context.font = "14px monospace";
            context.fillStyle = Colors.WHITE.to_hex();
            context.fillText("Constelation", 50, 0);
            const constelation = constelations[i];
            constelation.forEach((color, i) => {
                const real_color = this.get_rgb_color_for_field_color(color);
                const x_pos = 30 + i * 15;
                context.fillStyle = real_color.to_hex();
                context.beginPath();
                context.arc(x_pos + 10, 10, 5, 0, 2 * Math.PI);
                context.fill();
            });
            context.resetTransform();
        }
    }

    public get_rgb_color_for_field_color(color: FieldColor): RgbColor {
        switch (color) {
            default:
            case FieldColor.NONE: return Colors.BLACK;
            case FieldColor.RED: return Colors.RED;
            // case FieldColor.GREEN: return Colors.GREEN;
            case FieldColor.BLUE: return Colors.BLUE;
            case FieldColor.YELLOW: return new RgbColor(255, 255, 0);
            case FieldColor.PURPLE: return new RgbColor(200, 0, 200);
        }
    }

    public spawn_ray(field: Field, dir: Vector2) {
        this.parent.props.success_rays.push({
            start: field.props.position,
            dir,
            created_at: performance.now(),
        });
    }

}

interface SuccessRay {
    start: Vector2,
    dir: Vector2,
    created_at: number,
};

class Properties {
    public context: CanvasRenderingContext2D;
    public success_rays: Array<SuccessRay> = [];

    constructor(
        public parent: GamePage
    ) {
        this.context = get_2d_context(this.parent.elements.canvas);
    }
}

class Components {
    public right_interface_container: MenuButton;
    public bottom_interface_container: MenuButton;
    public menu_button: MenuButton;

    constructor(
        public parent: GamePage
    ) {
        this.right_interface_container = new MenuButton(this.parent.main);
        this.right_interface_container.props.backround_color = Colors.BLACK;
        this.right_interface_container.props.border_color = Colors.WHITE;
        this.right_interface_container.props.border_width = 5;
        this.right_interface_container.props.rect.set({
            x: 512 + 5, y: 0,
            w: 288 - 5, h: 600
        });
        this.bottom_interface_container = new MenuButton(this.parent.main);
        this.bottom_interface_container.props.backround_color = Colors.BLACK;
        this.bottom_interface_container.props.border_color = Colors.WHITE;
        this.bottom_interface_container.props.border_width = 5;
        this.bottom_interface_container.props.rect.set({
            x: 0, y: 512 + 5,
            w: 650, h: 88 - 5
        });
        this.menu_button = new MenuButton(this.parent.main);
        this.menu_button.props.backround_color = Colors.RED;
        this.menu_button.props.border_width = 0;
        this.menu_button.props.text = "Menu";
        this.menu_button.props.font_size = 24;
        this.menu_button.props.rect.set({
            x: 512 + 5, y: 0,
            w: 288, h: 50
        });
        this.right_interface_container.components.children.push(this.menu_button);
    }
}

class Listeners {
    constructor(
        public parent: GamePage
    ) {
        this.parent.components.menu_button.events.attach(MenuButtonClicked, this.on_menu_clicked);
        this.parent.elements.canvas.addEventListener('click', this.on_click);
    }

    protected on_click = (event: MouseEvent) => {
        if (this.parent.main.props.current_page !== PageName.GAME) {
            return;
        }
        const boundries = this.parent.elements.canvas.getBoundingClientRect();
        const position = {
            x: (event.clientX - boundries.x) * 800 / boundries.width,
            y: (event.clientY - boundries.y) * 600 / boundries.height,
        }
        this.parent.components.right_interface_container.logic.click(position);
        this.parent.components.bottom_interface_container.logic.click(position);
        this.parent.main.components.game_logic.logic.click(position);
    }

    protected on_menu_clicked = () => {
        this.parent.main.props.current_page = PageName.MENU;
    }
}
