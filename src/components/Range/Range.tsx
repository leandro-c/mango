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
    const [localMin, setLocalMin] = useState<number>();
    const [localMax, setLocalMax] = useState<number>();

    const [xPositionBullet1, setXPositionBullet1] = useState<BulletValues>();
    const [xPositionBullet2, setXPositionBullet2] = useState<BulletValues>();
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
            bullet1Ref.current.update(xPositionBullet1?.value ?? 0);
            bullet2Ref.current.update(xPositionBullet2?.value ?? 0);
        }
        if (typeof xPositionBullet1?.value === "undefined" || typeof xPositionBullet2?.value === "undefined" || typeof onChange === "undefined") return;
        onChange?.({
            min: Math.round((xPositionBullet1.value ?? 0) * 100) / 100,
            max: Math.round((xPositionBullet2.value ?? 0) * 100) / 100
        });
    }, [xPositionBullet1, xPositionBullet2]);

    const { percentToValue, valueToPercent } = useConverter(sliderRect?.width, localMin ?? 0, localMax ?? 100);

    const reset = () => {
        if (!sliderRect) return;
        const absoluteMinimum = Array.isArray(rangeValues) && rangeValues.length > 0 ? rangeValues[0] : min || 0;
        const absoluteMaximum = Array.isArray(rangeValues) && rangeValues.length > 0 ? rangeValues[rangeValues.length - 1] : max || 100;
        setLocalMin(absoluteMinimum);
        setLocalMax(absoluteMaximum);
        const valorBullet1 = typeof defaultValue?.min !== "undefined" && defaultValue.min! >= absoluteMinimum ? defaultValue.min! : absoluteMinimum;
        const valorBullet2 = typeof defaultValue?.max !== "undefined" && defaultValue.max! <= absoluteMaximum ? defaultValue.max! : absoluteMaximum;
        setXPositionBullet1({
            min: valueToPercent(absoluteMinimum),
            max: valueToPercent(absoluteMaximum),
            value: valueToPercent(valorBullet1),
            dataTestId: 'bullet1'
        });
        setXPositionBullet2({
            min: valueToPercent(absoluteMinimum),
            max: valueToPercent(absoluteMaximum),
            value: valueToPercent(valorBullet2),
            dataTestId: 'bullet2'
        });
    };

    const normalize = (value: number, arr?: number[]): number => {
        const real = percentToValue(value);
        if (Array.isArray(arr) && arr.length > 0) {
            const proximo = arr.reduce((prev, curr) => Math.abs(curr - real) < Math.abs(prev - real) ? curr : prev);
            return valueToPercent(proximo);
        }
        const proximo = Math.round(real * 100) / 100;
        return valueToPercent(proximo);
    };

    const getPotentialValues = (from?: number, to?: number): number[] | undefined => {
        if (Array.isArray(rangeValues) && rangeValues.length > 0) {
            if (typeof from !== "undefined") {
                const index = rangeValues.indexOf(percentToValue(from));
                return rangeValues.slice(index + 1);
            }
            if (typeof to !== "undefined") {
                const index = rangeValues.indexOf(percentToValue(to));
                return rangeValues.slice(0, index);
            }
        }
        return undefined;
    };

    const handlerChange = (value: number, bullet: string) => {
        const realBullet1 = percentToValue(xPositionBullet1!.value);
        const realBullet2 = percentToValue(xPositionBullet2!.value);

        if (bullet === "bullet1") {
            let newValue = normalize(value, getPotentialValues(undefined, xPositionBullet2!.value));
            if (minDistance! > 0 && Math.abs(percentToValue(newValue) - realBullet2) < minDistance!) {
                newValue = valueToPercent(realBullet2 - minDistance!);
            }
            setXPositionBullet1(prev => ({ ...prev!, value: newValue }));
            setXPositionBullet2(prev => ({ ...prev!, min: newValue }));
        } else if (bullet === "bullet2") {
            let newValue = normalize(value, getPotentialValues(xPositionBullet1!.value));

            if (minDistance! > 0 && Math.abs(percentToValue(newValue) - realBullet1) < minDistance!) {
                newValue = valueToPercent(realBullet1 + minDistance!);
            }
            setXPositionBullet2(prev => ({ ...prev!, value: newValue }));
            setXPositionBullet1(prev => ({ ...prev!, max: newValue }));
        }
    };

    const renderBullets = sliderRect && xPositionBullet1 && xPositionBullet2;

    return (
        <div className={`${styles.range}`} >
            <div className={styles.rangeWrapper}>
                <Label
                    text={`${localMin}`}
                    onClick={!clickOnLabel ? undefined : () => handlerChange(valueToPercent(localMin!), "bullet1")}
                />
                <Slider ref={sliderRef}>
                    {renderBullets &&
                        <>
                            <Bullet
                                values={xPositionBullet1!}
                                sliderRect={sliderRect}
                                onChange={(value) => handlerChange(value, "bullet1")}
                                ref={bullet1Ref}
                                data-testid="bullet1"
                            />
                            <Bullet
                                values={xPositionBullet2!}
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
                    text={`${localMax}`}
                    onClick={!clickOnLabel ? undefined : () => handlerChange(valueToPercent(localMax!), "bullet2")}
                />
            </div>
        </div>
    );
};

export default Range;
