import styles from "../Styles/Header.module.scss"
import { useScreenSize } from '../Services/MediaQuery.js'
import { useEffect, useState } from 'react'
import {Link, useNavigate} from "react-router-dom";
import {
  AppBar, Divider,
  Drawer,
  Toolbar,
  Typography
} from "@mui/material";
import GridViewIcon from '@mui/icons-material/GridView';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const Header = () => {
  const [open, setOpen] = useState(false);
  let navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    handleDrawerClose()

  },[navigate])

  return (
    <div>
      <AppBar position="fixed" open={open} className={styles.header}>
        <Toolbar className={styles.toolbar}>
          <a className={styles.toolbarIcon} onClick={handleDrawerOpen}>
            <MenuIcon className={styles.icon}/>
          </a>
          <Typography variant="h5" noWrap component="div">
            Extrator de Faturas
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
      >
        <div className={styles.drawerContainer}>
          <div className={styles.drawerHeader}>
            <a className={styles.menuLink} onClick={handleDrawerClose}>
              <ChevronLeftIcon/>
            </a>
          </div>
          <Divider/>
          <div className={styles.menu}>
            <ul className={styles.menuList}>
              <li className={styles.menuItem}>
                <Link
                  to="/"
                  style={{ textDecoration: "none" }}
                >
                  <a className={styles.menuLink}>
                    <GridViewIcon className={styles.menuIcon}/>
                    <span className={styles.text}>Dashboard</span>
                  </a>
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link
                  to="/invoices"
                  style={{ textDecoration: "none" }}
                >
                  <a className={styles.menuLink}>
                    <ReceiptIcon className={styles.menuIcon}/>
                    <span className={styles.text}>Faturas</span>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          <Divider/>
        </div>
      </Drawer>
    </div>
  )
}

export default Header
