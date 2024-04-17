import React from "react";
import styles from './Tracks.module.css'

const Tracks = ({ values }: { values: number[] }) => {
    return <div className={styles.tracks}>
        {
            values.map((v, i) => <span key={i} style={{
                position: "absolute",
                top: "-2px",
                width: "1px",
                height: "5px",
                background: "white",
                left: `${v}%`
            }} />)
        }
    </div>;
};
export default Tracks;