import styles from "./styles.module.scss";
import classNames from "classnames";

interface IProp {
  dark?: boolean;
}

const Loader = ({ dark }: IProp) => {
  return (
    <div className={classNames(styles["container"], dark && styles["-dark"])}>
      <div className={styles["dot"]}></div>
      <div className={styles["dot"]}></div>
      <div className={styles["dot"]}></div>
      <div className={styles["dot"]}></div>
    </div>
  );
};

export default Loader;
