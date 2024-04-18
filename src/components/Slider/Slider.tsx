import React from 'react';
import styles from './Slider.module.css';

// eslint-disable-next-line react/display-name
const Slider = React.forwardRef(({ children }: { children: React.ReactNode, className?: string }, ref: React.Ref<HTMLDivElement>) => {
    return <div className={`${styles.sliderWrapper}`} >
        <div className={`${styles.slider}`} ref={ref}>
            {children}
        </div>
    </div>;
});
export default Slider;