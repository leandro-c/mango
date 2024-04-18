import React from 'react';
import styles from './Slider.module.css';

const Slider = React.forwardRef(({ children }: { children: React.ReactNode, className?: string }, ref: React.Ref<HTMLDivElement>) => {
    return <div className={`${styles.sliderWrapper}`} >
        <div className={`${styles.slider}`} ref={ref}>
            {children}
        </div>
    </div>;
});

Slider.displayName = 'Slider';

export default Slider;