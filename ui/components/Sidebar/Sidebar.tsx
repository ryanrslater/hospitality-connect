import React from 'react'
import styles from './Sidebar.module.css'


const Sidebar = () => {
    return (
    <div className={styles.wrapper}>
        <div className={styles.links}>Home</div>
        <div className={styles.links}>Orders</div>
        <div className={styles.links}>Home</div>
    </div>
    )
}

export default Sidebar