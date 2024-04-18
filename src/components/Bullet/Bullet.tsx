import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle }  from "react";
import { BulletValues } from '@/utils/interfaces/interfaces'
import styles from './Bullet.module.css'

const Bullet  = forwardRef(({ values, sliderRect, onChange }: { values: BulletValues, sliderRect: DOMRect, onChange: (value: number) => void, className?: string }, ref) => {
    const [dragging, setDragging] = useState(false);
    const bulletRef = useRef<HTMLSpanElement>(null);
    const lastPosX = useRef<number>();
    const widthRef = useRef(12);
    const { min, max, value, dataTestId } = values;
    
    useImperativeHandle(
        ref,
        () => ({
            update: (v: number) => move(v)
        }),
        [],
    );

    useEffect(() => {
         move(value);
    }, [value]);

    useEffect(() => {
        if (dragging) {
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener('mouseup', mouseUp);
            return  () => document.removeEventListener("mousemove", mouseMove);
        }
    }, [dragging]);

    const mouseUp = () => {
        document.removeEventListener('mouseup', mouseUp);
        setDragging(false);
        if (onChange) {
            onChange(lastPosX.current!);
        }
    };

    const mouseDown = () => {
        widthRef.current = bulletRef.current!.getBoundingClientRect().width / 2;
        setDragging(true);
    };

    const mouseMove = (event: MouseEvent) => { 
        if (dragging) {
            const newPosX = event.clientX - sliderRect.left;
            let percent = newPosX * 100 / sliderRect.width;
            if (percent < min!) {
                percent = min!;
            } else if (percent > max!) {
                percent = max!;
            }
            move(percent);
        }
        
    };

    const move = (value: number) => {
        if (!isNaN(value)) {
            const pos = `calc(${value}% - ${widthRef.current}px)`;
            bulletRef.current!.style.left = pos;
            lastPosX.current = value;
        }
    };

    return <span
        style={{cursor: dragging ? `ew-resize` : "col-resize"}}
        onMouseDown={mouseDown}
        className={`${styles.bullet}`}
        ref={bulletRef}
        data-testid={dataTestId}
    />;
});


Bullet.displayName = 'Bullet';

export default Bullet