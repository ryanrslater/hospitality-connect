import React from 'react'
import styles from './Posts.module.css'

const image = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80"

const Posts = () => {
    return (
    <div className={styles.wrapper}>
        <h2>Ryan Slater</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in nunc ut libero tempor pretium. Maecenas eu sapien tincidunt, pellentesque massa nec, tempor lorem. Proin ultricies nulla vel leo mollis, et sollicitudin dolor auctor. Maecenas quis enim a nibh venenatis dictum non eu magna. Maecenas metus elit, mollis a libero vulputate, tristique consequat risus. Suspendisse rhoncus porta tortor, ac posuere elit facilisis quis. Cras laoreet faucibus neque, a feugiat massa posuere eget.</p>
        <img className={styles.postImage} src={image}/> 
        {/* <img className={styles.postImage} style={{backgroundImage: `url("${image}")`}}/> */}
    </div>
    )
}

export default Posts