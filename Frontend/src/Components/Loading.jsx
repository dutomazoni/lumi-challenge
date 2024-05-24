import styles from "../Styles/Loading.module.scss"
import {CircularProgress} from "@mui/material";

const Loading = () => {
  return (
    <>
      <div className={styles.center}>
        <CircularProgress color="success" />
      </div>
    </>
  )
}

export default Loading
