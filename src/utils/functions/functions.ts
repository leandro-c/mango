import { Converter } from '@/utils/interfaces/interfaces'
export const useConverter = (width: number | undefined, min: number, max: number): Converter => {
    const percentToValue = (value = 0): number => {
        if (typeof width !== 'undefined') {
            const pixels = value * width / 100;
            const resultado =  (pixels * (max - min) / width) + min;
            return Math.round(resultado * 100) / 100;
        }
        return 0;
    };

    const valueToPercent = (value: number): number => {
        if (typeof width !== 'undefined') {
            const real = (value - min) * width / (max - min);
            const resultado = real * 100 / width;
            return resultado;
        }
        return 0;
    };

    return { percentToValue, valueToPercent };
};