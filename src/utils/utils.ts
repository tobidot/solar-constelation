import { get_element_by_id, throw_expression } from "@game.object/ts-game-toolbox";

export function get_2d_context(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    return canvas.getContext('2d') ?? throw_expression('Could not create context');
}

export function get_image(id: string): HTMLImageElement {
    return get_element_by_id(id, HTMLImageElement);
}