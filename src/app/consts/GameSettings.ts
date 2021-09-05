import { Class } from "@game.object/ts-game-toolbox";

export enum EnemyPlayerSetting {
    AI_EASY,
    AI_MEDIUM,
    AI_HARD,
    Player,
}

export enum MusicSetting {
    ON,
    OFF,
}

export enum MapSizeSetting {
    SMALL,
    MEDIUM,
    BIG,
}

type AnyEnum = { [key: string]: string | number };

export function rorate_setting<ENUM extends AnyEnum>(enum_class: ENUM, value: ENUM[keyof ENUM]): ENUM[keyof ENUM] {
    const values = Object.values(enum_class).filter(e => typeof e === "number");
    const index = values.indexOf(value);
    if (index < 0) throw new Error("Invalid Enum Value");
    const next_index = (index + 1) % values.length;
    return values[next_index] as ENUM[keyof ENUM];
}