import classNames from "classnames";

import styles from "./styles.module.scss";

interface IProp {
  dark?: boolean;
}

const Spinner = ({ dark }: IProp) => {
  return (
    <div
      className={classNames(styles["container"], dark && styles["-dark"])}
      role="status"
      aria-live="polite"
      aria-label="loading"
    >
      <div className={styles["dot"]}></div>

      <div className={styles["dot"]}></div>

      <div className={styles["dot"]}></div>

      <div className={styles["dot"]}></div>
    </div>
  );
};

export default Spinner;
