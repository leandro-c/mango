import { Converter } from '@/utils/interfaces/interfaces'

export const useConverter = (width: number | undefined, min: number, max: number): Converter => {
    const percentToValue = (value = 0): number => {
        if (typeof width !== 'undefined') {
            const pixels = value * width / 100;
            const result =  (pixels * (max - min) / width) + min;
            return Math.round(result * 100) / 100;
        }
        return 0;
    };

    const valueToPercent = (value: number): number => {
        if (typeof width !== 'undefined') {
            const real = (value - min) * width / (max - min);
            const result = real * 100 / width;
            return result;
        }
        return 0;
    };

    return { percentToValue, valueToPercent };
};