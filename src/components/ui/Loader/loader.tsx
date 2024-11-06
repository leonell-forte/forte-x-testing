import React from "react";
import styles from "./styles.module.scss";

const Loader = () => {
  return (
    <div className={styles["container"]}>
      <div className={styles["dot"]}></div>
      <div className={styles["dot"]}></div>
      <div className={styles["dot"]}></div>
      <div className={styles["dot"]}></div>
    </div>
  );
};

export default Loader;
