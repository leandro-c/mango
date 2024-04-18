export interface Converter {
    percentToValue: (value: number) => number;
    valueToPercent: (value: number) => number;
}

export interface BulletValues {
    min: number;
    max: number;
    value: number;
    dataTestId: string;
}

export interface RangeProps {
    onChange?: ({min, max}: {min: number, max: number}) => void;
    defaultValue?: {min?: number, max?: number};
    rangeValues?: number[];
    min?: number;
    max?: number;
    clickOnLabel?: boolean;
    minDistance?: number;
}

export interface BulletRef extends HTMLSpanElement {
    update: (value: number) => void;
}