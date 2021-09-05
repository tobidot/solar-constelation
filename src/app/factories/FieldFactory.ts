import { Field, FieldColor, FieldType } from "../components/Field";
import { Main } from "../Main";

export class FieldFactory {

    protected model: Field;

    public constructor(
        public main: Main
    ) {
        this.model = new Field(main);
    }

    public empty(): FieldFactory {
        this.model.props.type = FieldType.EMPTY;
        this.model.props.color = FieldColor.NONE;
        this.model.props.gravity_radius = 0;
        return this;
    }


    public black_hole(): FieldFactory {
        this.model.props.type = FieldType.BLACK_HOLE;
        this.model.props.color = FieldColor.NONE;
        this.model.props.gravity_radius = 99;
        return this;
    }

    public red_giant(): FieldFactory {
        this.model.props.type = FieldType.RED_GIANT;
        this.model.props.color = FieldColor.RED;
        this.model.props.gravity_radius = 5;
        return this;
    }

    public yellow_dwarf(): FieldFactory {
        this.model.props.type = FieldType.YELLOW_DWARF;
        this.model.props.color = FieldColor.YELLOW;
        this.model.props.gravity_radius = 3;
        return this;
    }

    public gas_giant(): FieldFactory {
        this.model.props.type = FieldType.GAS_GIANT;
        this.model.props.color = FieldColor.PURPLE;
        this.model.props.gravity_radius = 0;
        return this;
    }

    public habitable_planet(): FieldFactory {
        this.model.props.type = FieldType.HABITABLE_PLANET;
        this.model.props.color = FieldColor.BLUE;
        this.model.props.gravity_radius = 0;
        return this;
    }

    public position(x: number, y: number): FieldFactory {
        this.model.props.position.set(x, y);
        return this;
    }

    public create(): Field {
        return this.model;
    }

}