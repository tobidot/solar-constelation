import { Colors, get_element_by_id, MenuButtonModel, Rect, RgbColor, throw_expression, Vector2, Vector2I } from "@game.object/ts-game-toolbox";
import { EventSocket } from "../../utils/EventSocket";
import { MenuButtonClicked as MenuButtonClicked } from "../events/MenuButtonClicked";
import { Main } from "../Main";

interface Settings {

}

type MenuButtonEvents = MenuButtonClicked;

export class MenuButton {
    protected static readonly default_settings: Settings = {};

    public settings: Settings;
    public elements: Elements;
    public logic: Logic;
    public props: Properties;
    public components: Components;
    public listeners: Listeners;
    public events: EventSocket<MenuButtonEvents>;

    public constructor(
        public main: Main,
        config: Partial<Settings> = {}
    ) {
        this.settings = Object.assign({}, MenuButton.default_settings, config);
        this.elements = new Elements(this);
        this.logic = new Logic(this);
        this.props = new Properties(this);
        this.components = new Components(this);
        this.listeners = new Listeners(this);
        this.events = new EventSocket();
    }
}

class Elements {
    public canvas: HTMLCanvasElement;

    constructor(
        public parent: MenuButton

    ) {
        this.canvas = get_element_by_id('app', HTMLCanvasElement);
    }
}

class Logic {
    constructor(
        public parent: MenuButton

    ) {

    }

    /**
     * Draws this Button to the canvas
     */
    public draw() {
        const ctx = this.parent.props.context;
        ctx.strokeStyle = this.parent.props.border_color.to_hex();
        ctx.fillStyle = this.parent.props.backround_color.to_hex();
        ctx.lineWidth = this.parent.props.border_width;
        const rect = this.parent.props.rect;
        if (this.parent.props.border_width > 0) {
            ctx.strokeRect(
                rect.x - ctx.lineWidth / 2,
                rect.y - ctx.lineWidth / 2,
                rect.w + ctx.lineWidth,
                rect.h + ctx.lineWidth
            );
        }
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        if (!!this.parent.props.text) {
            // only if text exists
            ctx.fillStyle = this.parent.props.text_color.to_hex();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = this.parent.props.font_size + "px monospace";
            ctx.fillText(this.parent.props.text, rect.center.x, rect.center.y, rect.width);
        }
        this.parent.components.children.forEach((button) => {
            button.logic.draw();
        });
    }

    /**
     * Triggers an event that this button has been clicked
     * @param position The global position of the click
     */
    public trigger(position: Vector2I) {
        this.parent.events.dispatch(new MenuButtonClicked(position));
    }

    /**
     * Propagates the click to the correct button and triggers it.
     * @param position The global position of the click
     * @returns 
     *  True  => The click was inside of this element
     *  False => The click was outside
     */
    public click(position: Vector2I): boolean {
        // check if click is inside me
        if (!this.is_hit(position)) return false;
        // check if any of my children managed the click
        const is_child_hit = this.parent.components.children.reduce((is_hit: boolean, element: MenuButton) => {
            if (is_hit) return is_hit;
            return element.logic.click(position);
        }, false);
        // if i am receipient of event trigger me
        if (!is_child_hit) {
            this.trigger(position);
        }
        return true;
    }

    /**
     * Check wether $position is inside this element
     * @param position the global position
     * @returns is the position inside this element
     */
    public is_hit(position: Vector2I): boolean {
        return this.parent.props.rect.contains(position);
    }

    public change_text_anchored_center(context: CanvasRenderingContext2D, text: string, padding: number = 10) {
        this.parent.props.text = text;
        this.parent.props.rect.w = this.parent.props.context.measureText(text).width + padding;
        this.parent.props.rect.set_center({ x: 400, y: this.parent.props.rect.center.y });
    }
}

class Properties {
    public context: CanvasRenderingContext2D;
    public rect: Rect = new Rect();
    public text: string = "";
    public font_size: number = 14;
    public border_width: number = 2;
    public border_color: RgbColor = Colors.BLACK;
    public backround_color: RgbColor = Colors.WHITE;
    public text_color: RgbColor = Colors.BLACK;

    constructor(
        public parent: MenuButton

    ) {
        this.context = this.parent.elements.canvas.getContext('2d') ?? throw_expression('Context not Created');
    }
}

class Components {
    public children: Array<MenuButton> = [];

    constructor(
        public parent: MenuButton

    ) {

    }
}

class Listeners {
    constructor(
        public parent: MenuButton

    ) {
    }
}
