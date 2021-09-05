import { get_element_by_id, SignalSocket } from "@game.object/ts-game-toolbox";
import { EventSocket } from "../utils/EventSocket";
import { get_2d_context } from "../utils/utils";
import { Board } from "./components/Board";
import { GameLogic } from "./components/GameLogic";
import { Player } from "./components/Player";
import { PlayerID } from "./consts/GameStates";
import { AppInitialized } from "./events/AppInitialized";
import { GamePage } from "./pages/GamePage";
import { MenuPage } from "./pages/MenuPage";

interface Settings {

}

export enum PageName {
    MENU = "menu_page",
    GAME = "game_page",
}

/**
 * All Events that can be thrown in this component
 */
type AppEvents = AppInitialized;

export class Main {
    protected static readonly default_settings: Settings = {};

    public settings: Settings;
    public events: EventSocket<AppEvents>;
    public elements: Elements;
    public logic: Logic;
    public props: Properties;
    public components: Components;
    public listeners: Listeners;

    public constructor(
        config: Partial<Settings> = {}
    ) {
        this.settings = Object.assign({}, config);
        this.events = new EventSocket();
        this.elements = new Elements(this);
        this.logic = new Logic(this);
        this.props = new Properties(this);
        this.components = new Components(this);
        this.listeners = new Listeners(this);
    }

    public init() {
        this.logic.init();
    }
}

class Elements {
    public canvas: HTMLCanvasElement;

    constructor(
        public parent: Main
    ) {
        this.canvas = get_element_by_id('app', HTMLCanvasElement);
    }
}

class Logic {
    constructor(
        public parent: Main

    ) {

    }

    public init() {
        this.parent.events.dispatch(new AppInitialized);
    }

    public update_page() {
        const page = this.parent.components[this.parent.props.current_page];
        const now = performance.now();
        if ('update' in page.logic) {
            page.logic.update(now - this.parent.props.last_update);
            this.parent.props.last_update = now;
        } else {
            console.error("Page cannot update");
        }
    }
}

class Properties {
    public context: CanvasRenderingContext2D;
    public last_update: number = performance.now();
    public current_page: PageName = PageName.MENU;

    constructor(
        public parent: Main

    ) {
        this.context = get_2d_context(this.parent.elements.canvas);
    }
}

class Components {
    public game_page: GamePage;
    public menu_page: MenuPage;

    public board: Board;
    public game_logic: GameLogic;
    public player: Player;
    public opponent: Player;


    constructor(
        public parent: Main
    ) {
        this.menu_page = new MenuPage(this.parent);
        this.game_page = new GamePage(this.parent);
        this.game_logic = new GameLogic(this.parent);
        this.board = new Board(this.parent);

        this.player = new Player(this.parent);
        this.player.props.name = "Player";
        this.player.props.id = PlayerID.PLAYER;
        this.opponent = new Player(this.parent);
        this.opponent.props.name = "Opponent";
        this.opponent.props.id = PlayerID.OPPONTNET;
    }
}

class Listeners {
    constructor(
        public parent: Main

    ) {
        requestAnimationFrame(this.on_animation_frame);
    }

    protected on_animation_frame = () => {
        this.parent.logic.update_page();
        requestAnimationFrame(this.on_animation_frame);
    }
}
