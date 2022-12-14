import React from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import Posts from "../../../components/Posts";
import styles from './LoggedIn.module.css'
const LoggedIn = () => {
    return (
        <div>
            <Navbar />
            <div className={styles.content}>
                <div className={styles.sidebar}>
                    <Sidebar />
                </div>
                <div className={styles.centerContent}>

                    <div className={styles.posts}>
                        <Posts />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoggedIn