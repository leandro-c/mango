import React, { useEffect, useState, useRef} from "react";
import { BulletValues, RangeProps, BulletRef } from '@/utils/interfaces/interfaces';
import { useConverter } from "@/utils/functions/functions";
import Label from '@/components/Label/Label';
import Bullet from '@/components/Bullet/Bullet';
import Slider from '@/components/Slider/Slider';
import Tracks from '@/components/Tracks/Tracks';
import styles from './Range.module.css';

const Range = ({
    onChange,
    defaultValue,
    rangeValues,
    min = 0,
    max = 100,
    clickOnLabel,
    minDistance,
}: RangeProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [sliderRect, setSliderRect] = useState<DOMRect | undefined>();
    const [minimo, setMinimo] = useState<number>();
    const [maximo, setMaximo] = useState<number>();

    const [bullet1, setBullet1] = useState<BulletValues>();
    const [bullet2, setBullet2] = useState<BulletValues>();
    const bullet1Ref = useRef<BulletRef>(null);
    const bullet2Ref = useRef<BulletRef>(null);
    

    useEffect(() => {
        const rect = sliderRef.current?.getBoundingClientRect();
        setSliderRect(rect);
    }, [rangeValues]);

    useEffect(() => {
        reset();
    }, [defaultValue, rangeValues, min, max, clickOnLabel, minDistance, sliderRect]);

    useEffect(() => {
        if (bullet1Ref?.current && bullet2Ref.current) {
            bullet1Ref.current.update(bullet1?.value ?? 0);
            bullet2Ref.current.update(bullet2?.value ?? 0);
        }
        if (typeof bullet1?.value === "undefined" || typeof bullet2?.value === "undefined" || typeof onChange === "undefined") return;
        onChange?.({
            min: Math.round((bullet1.value ?? 0) * 100) / 100,
            max: Math.round((bullet2.value ?? 0) * 100) / 100
        });
    }, [bullet1, bullet2]);

    const { percentToValue, valueToPercent } = useConverter(sliderRect?.width, minimo ?? 0, maximo ?? 100);

    const reset = () => {
        if (!sliderRect) return;
        const minimoAbsoluto = Array.isArray(rangeValues) && rangeValues.length > 0 ? rangeValues[0] : min || 0;
        const maximoAbsoluto = Array.isArray(rangeValues) && rangeValues.length > 0 ? rangeValues[rangeValues.length - 1] : max || 100;
        setMinimo(minimoAbsoluto);
        setMaximo(maximoAbsoluto);
        const valorBullet1 = typeof defaultValue?.min !== "undefined" && defaultValue.min! >= minimoAbsoluto ? defaultValue.min! : minimoAbsoluto;
        const valorBullet2 = typeof defaultValue?.max !== "undefined" && defaultValue.max! <= maximoAbsoluto ? defaultValue.max! : maximoAbsoluto;
        setBullet1({
            min: valueToPercent(minimoAbsoluto),
            max: valueToPercent(maximoAbsoluto),
            value: valueToPercent(valorBullet1),
            dataTestId: 'bullet1'
        });
        setBullet2({
            min: valueToPercent(minimoAbsoluto),
            max: valueToPercent(maximoAbsoluto),
            value: valueToPercent(valorBullet2),
            dataTestId: 'bullet2'
        });
    };

    const normalizar = (value: number, arr?: number[]): number => {
        const real = percentToValue(value);
        if (Array.isArray(arr) && arr.length > 0) {
            const proximo = arr.reduce((prev, curr) => Math.abs(curr - real) < Math.abs(prev - real) ? curr : prev);
            return valueToPercent(proximo);
        }
        const proximo = Math.round(real * 100) / 100;
        return valueToPercent(proximo);
    };

    const getPosiblesValores = (desde?: number, hasta?: number): number[] | undefined => {
        if (Array.isArray(rangeValues) && rangeValues.length > 0) {
            if (typeof desde !== "undefined") {
                const index = rangeValues.indexOf(percentToValue(desde));
                return rangeValues.slice(index + 1);
            }
            if (typeof hasta !== "undefined") {
                const index = rangeValues.indexOf(percentToValue(hasta));
                return rangeValues.slice(0, index);
            }
        }
        return undefined;
    };

    const handlerChange = (value: number, bullet: string) => {
        const realBullet1 = percentToValue(bullet1!.value);
        const realBullet2 = percentToValue(bullet2!.value);

        if (bullet === "bullet1") {
            let newValue = normalizar(value, getPosiblesValores(undefined, bullet2!.value));
            if (minDistance! > 0 && Math.abs(percentToValue(newValue) - realBullet2) < minDistance!) {
                newValue = valueToPercent(realBullet2 - minDistance!);
            }
            setBullet1(prev => ({ ...prev!, value: newValue }));
            setBullet2(prev => ({ ...prev!, min: newValue }));
        } else if (bullet === "bullet2") {
            let newValue = normalizar(value, getPosiblesValores(bullet1!.value));

            if (minDistance! > 0 && Math.abs(percentToValue(newValue) - realBullet1) < minDistance!) {
                newValue = valueToPercent(realBullet1 + minDistance!);
            }
            setBullet2(prev => ({ ...prev!, value: newValue }));
            setBullet1(prev => ({ ...prev!, max: newValue }));
        }
    };

    const renderBullets = sliderRect && bullet1 && bullet2;
    return (
        <div className={`${styles.range}`} >
            <div className={styles.rangeWrapper}>
                <Label
                    text={`${minimo}`}
                    onClick={!clickOnLabel ? undefined : () => handlerChange(valueToPercent(minimo!), "bullet1")}
                />
                <Slider ref={sliderRef}>
                    {renderBullets &&
                        <>
                            <Bullet
                                values={bullet1!}
                                sliderRect={sliderRect}
                                onChange={(value) => handlerChange(value, "bullet1")}
                                ref={bullet1Ref}
                                data-testid="bullet1"
                            />
                            <Bullet
                                values={bullet2!}
                                sliderRect={sliderRect}
                                onChange={(value) => handlerChange(value, "bullet2")}
                                ref={bullet2Ref}
                                data-testid="bullet2"
                            />
                        </>
                    }
                    {rangeValues && <Tracks values={rangeValues.map(v => valueToPercent(v))} />}
                </Slider>
                <Label
                    text={`${maximo}`}
                    onClick={!clickOnLabel ? undefined : () => handlerChange(valueToPercent(maximo!), "bullet2")}
                />
            </div>
        </div>
    );
};

export default Range;
