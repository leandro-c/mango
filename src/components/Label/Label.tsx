import React from 'react';
import styles from './Label.module.css';

const Label = ({ text, onClick }: { className?: string, text: string, onClick?: () => void }) => {
    return <span style={{cursor: onClick ? `${styles.pointer}`: `${styles.default}`}} onClick={onClick} className={`${styles.label}`}>
        {text}
    </span>;
};
export default Label