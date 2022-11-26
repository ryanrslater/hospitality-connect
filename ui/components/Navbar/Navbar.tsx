import React from "react";
import styles from './Navbar.module.css'
const Navbar = () => {
    return (
        <div className={styles.wrapper}>
            <div>
                Navbar
            </div>
            <div className={styles.links}>
                <p>Chat</p>
                <p>Notifications</p>
                <p>Logout</p>
            </div>

        </div>
    )
}

export default Navbar