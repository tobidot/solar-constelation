import { ClassEntityFactory } from "@game.object/ts-class-entities";
import { Field, FieldColor, FieldType } from "../components/Field";
import { Main } from "../Main";

export class FieldFactory extends ClassEntityFactory<Field> {

    public constructor(
        public parent: Main
    ) {
        super(Field, parent);
    }

    public empty(): FieldFactory {
        return this.after_create((entity: Field) => {
            entity.props.type = FieldType.EMPTY;
            entity.props.color = FieldColor.NONE;
            entity.props.gravity_radius = 0;
            return entity;
        });
    }


    public black_hole(): FieldFactory {
        return this.after_create((entity: Field) => {
            entity.props.type = FieldType.BLACK_HOLE;
            entity.props.color = FieldColor.NONE;
            entity.props.gravity_radius = 99;
            return entity;
        });
    }

    public red_giant(): FieldFactory {
        return this.after_create((entity: Field) => {
            entity.props.type = FieldType.RED_GIANT;
            entity.props.color = FieldColor.RED;
            entity.props.gravity_radius = 5;
            return entity;
        });
    }

    public yellow_dwarf(): FieldFactory {
        return this.after_create((entity: Field) => {
            entity.props.type = FieldType.YELLOW_DWARF;
            entity.props.color = FieldColor.YELLOW;
            entity.props.gravity_radius = 3;
            return entity;
        });
    }

    public gas_giant(): FieldFactory {
        return this.after_create((entity: Field) => {
            entity.props.type = FieldType.GAS_GIANT;
            entity.props.color = FieldColor.PURPLE;
            entity.props.gravity_radius = 0;
            return entity;
        });
    }

    public habitable_planet(): FieldFactory {
        return this.after_create((entity: Field) => {
            entity.props.type = FieldType.HABITABLE_PLANET;
            entity.props.color = FieldColor.BLUE;
            entity.props.gravity_radius = 0;
            return entity;
        });
    }

    public position(x: number, y: number): FieldFactory {
        return this.after_create((entity: Field) => {
            entity.props.position.set(x, y);
            return entity;
        });
        return this;
    }

}