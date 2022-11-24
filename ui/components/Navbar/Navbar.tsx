import React from "react";
import styles from './Navbar.module.css'
const Navbar = () => {
    return (
        <div className={styles.wrapper}>
            <div>
                Navbar
            </div>
            <div className={styles.links}>
                <p>link</p>
                <p>link</p>
                <p>link</p>
            </div>

        </div>
    )
}

export default Navbar