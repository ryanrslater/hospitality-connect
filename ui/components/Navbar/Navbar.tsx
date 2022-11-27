import React from "react";
import styles from './Navbar.module.css'
import { signOut } from "next-auth/react";

const Navbar = () => {
    const logoutHandler = async () => {
        await signOut()
    }
    return (
        <div className={styles.wrapper}>
            <div>
                Navbar
            </div>
            <div className={styles.links}>
                <p>Chat</p>
                <p>Notifications</p>
                <p onClick={logoutHandler}>Logout</p>
            </div>

        </div>
    )
}

export default Navbar