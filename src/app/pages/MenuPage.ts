import { Main, PageName } from "../Main";
import { AppInitialized } from "../events/AppInitialized";
import { MenuButton } from "../components/MenuButton";
import { Colors, get_element_by_id, RgbColor, throw_expression } from "@game.object/ts-game-toolbox";
import { MenuButtonClicked } from "../events/MenuButtonClicked";
import { EnemyPlayerSetting, MapSizeSetting, MusicSetting, rorate_setting } from "../consts/GameSettings";
import { GamePage } from "./GamePage";
import { get_2d_context } from "../../utils/utils";

interface Settings {

}

export class MenuPage {
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
        public parent: MenuPage

    ) {
        this.canvas = get_element_by_id('app', HTMLCanvasElement);
    }
}

class Logic {
    constructor(
        public parent: MenuPage

    ) {

    }

    public update(delta_ms: number) {
        this.parent.props.context.clearRect(0, 0, 800, 600);
        this.parent.components.all_buttons.forEach(
            (button) => {
                button.logic.draw();
            }
        );
    }

    public generate_menu_button(y: number, text: string): MenuButton {
        const button = new MenuButton(this.parent.main);
        button.props.text = text;
        button.props.font_size = 24;
        this.parent.props.context.font = "24px monospace";
        button.props.rect.w = this.parent.props.context.measureText(text).width + 10;
        button.props.rect.h = 30;
        button.props.rect.set_center({ x: 400, y });
        return button;
    }

    public update_menu_button(button: MenuButton, text: string) {
        button.props.text = text;
        button.props.rect.w = this.parent.props.context.measureText(text).width + 10;
        button.props.rect.set_center({ x: 400, y: button.props.rect.center.y });
    }
}

class Properties {
    public context: CanvasRenderingContext2D;
    public setting_music_enabled: MusicSetting = MusicSetting.OFF;
    public setting_enemy_player: EnemyPlayerSetting = EnemyPlayerSetting.AI_EASY;
    public setting_map_size: MapSizeSetting = MapSizeSetting.MEDIUM;

    constructor(
        public parent: MenuPage

    ) {
        this.context = get_2d_context(this.parent.elements.canvas);
    }
}

class Components {
    public continue_button: MenuButton;
    public play_button: MenuButton;
    public enemy_button: MenuButton;
    public music_button: MenuButton;
    public map_size_button: MenuButton;
    public all_buttons: Array<MenuButton>;

    constructor(
        public parent: MenuPage

    ) {
        this.play_button = this.parent.logic.generate_menu_button(150, "Neues Spiel");
        this.continue_button = this.parent.logic.generate_menu_button(200, "Spiel Fortfahren");
        this.enemy_button = this.parent.logic.generate_menu_button(250, "Enemy: AI - Easy");
        this.enemy_button.props.backround_color = Colors.BLACK;
        this.enemy_button.props.text_color = Colors.BLACK;
        this.music_button = this.parent.logic.generate_menu_button(300, "Music: Off");
        this.music_button.props.backround_color = Colors.BLACK;
        this.music_button.props.text_color = Colors.BLACK;
        this.map_size_button = this.parent.logic.generate_menu_button(350, "Map: Small");
        this.all_buttons = [];
        for (const key in this) {
            const button = this[key];
            if (button instanceof MenuButton) {
                this.all_buttons.push(button);
            }
        }
    }

}

class Listeners {
    constructor(
        public parent: MenuPage

    ) {
        this.parent.main.events.attach(AppInitialized, this.on_application_init);
        this.parent.components.continue_button.events.attach(MenuButtonClicked, this.on_continue_clicked);
        this.parent.components.play_button.events.attach(MenuButtonClicked, this.on_play_clicked);
        this.parent.components.music_button.events.attach(MenuButtonClicked, this.on_music_clicked);
        this.parent.components.map_size_button.events.attach(MenuButtonClicked, this.on_map_size_clicked);
        this.parent.components.enemy_button.events.attach(MenuButtonClicked, this.on_enemy_clicked);
        this.parent.elements.canvas.addEventListener('click', this.on_click);
    }

    protected on_click = (event: MouseEvent) => {
        if (this.parent.main.props.current_page !== PageName.MENU) {
            return;
        }
        const boundries = this.parent.elements.canvas.getBoundingClientRect();
        const position = {
            x: (event.clientX - boundries.x) * 800 / boundries.width,
            y: (event.clientY - boundries.y) * 600 / boundries.height,
        }
        this.parent.components.all_buttons.forEach((button) => {
            button.logic.click(position);
        })
    }

    protected on_play_clicked = (event: MenuButtonClicked) => {
        this.parent.main.props.current_page = PageName.GAME;
        this.parent.main.components.board.logic.create_board();
        this.parent.main.components.game_logic.logic.reset();
        this.parent.main.components.player.logic.reset();
        this.parent.main.components.opponent.logic.reset();
    }

    protected on_continue_clicked = (event: MenuButtonClicked) => {
        this.parent.main.props.current_page = PageName.GAME;
    }

    protected on_music_clicked = (event: MenuButtonClicked) => {
        this.parent.props.setting_music_enabled = rorate_setting(MusicSetting, this.parent.props.setting_music_enabled);
        const state = {
            [MusicSetting.ON]: "on",
            [MusicSetting.OFF]: "off",
        }[this.parent.props.setting_music_enabled];
        const text = ["Music:", state].join(' ');
        this.parent.logic.update_menu_button(this.parent.components.music_button, text);
    }

    protected on_map_size_clicked = (event: MenuButtonClicked) => {
        this.parent.props.setting_map_size = rorate_setting(MapSizeSetting, this.parent.props.setting_map_size);
        const state = {
            [MapSizeSetting.SMALL]: "small",
            [MapSizeSetting.MEDIUM]: "medium",
            [MapSizeSetting.BIG]: "big",
        }[this.parent.props.setting_map_size];
        const text = ["Map:", state].join(' ');
        this.parent.logic.update_menu_button(this.parent.components.map_size_button, text);
    }

    protected on_enemy_clicked = (event: MenuButtonClicked) => {
        this.parent.props.setting_enemy_player = rorate_setting(EnemyPlayerSetting, this.parent.props.setting_enemy_player);
        const state = {
            [EnemyPlayerSetting.AI_EASY]: "easy",
            [EnemyPlayerSetting.AI_MEDIUM]: "medium",
            [EnemyPlayerSetting.AI_HARD]: "hard",
            [EnemyPlayerSetting.Player]: "human",
        }[this.parent.props.setting_enemy_player];
        const text = ["Enemy:", state].join(' ');
        this.parent.logic.update_menu_button(this.parent.components.enemy_button, text);
    }

    protected on_application_init = (event: AppInitialized) => {

    }
}
