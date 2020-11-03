import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined'
import CallToActionOutlinedIcon from '@material-ui/icons/CallToActionOutlined'
import ChatBubbleOutlineSharpIcon from '@material-ui/icons/ChatBubbleOutlineSharp'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined'

import SnackAlert from '../SnackAlert'

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    background: '#000000',
  },
  navitem: {
    textAlign: 'center',
    opacity: 0.5,
    '&:focus, &:hover': {
      opacity: 1,
    },
  },
  menuitem: {
    fontSize: '18px',
    paddingTop: 0,
  },
}))

const Navbar = () => {
  const classes = useStyles()
  const { users } = useSelector((state) => state)
  const [isAuthorized, setAuthorized] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [snackOpen, setSnackOpen] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const open = Boolean(anchorEl)

  useEffect(() => {
    setAuthorized(users.isAuthorized)
  }, [users.isAuthorized])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogOut = () => {
    dispatch({
      type: 'LOGOUT_WATCHER',
    })
    router.push('/')
    setSnackOpen(true)
    setAnchorEl(null)
  }

  const handleRouteChange = (route) => {
    if (route === window.location.pathname) {
      router.reload()
    } else {
      router.replace(route)
    }
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <Grid container justify="center" spacing={1}>
            {[
              {
                icon: (
                  <IconButton
                    color="inherit"
                    onClick={() => handleRouteChange('/')}
                  >
                    <HomeOutlinedIcon style={{ fontSize: '30px' }} />
                  </IconButton>
                ),
                name: 'Home',
              },
              {
                icon: (
                  <IconButton
                    color="inherit"
                    onClick={() => handleRouteChange('/explore')}
                  >
                    <ExploreOutlinedIcon style={{ fontSize: '30px' }} />
                  </IconButton>
                ),
                name: 'Explore',
              },
              {
                icon: (
                  <IconButton
                    color="inherit"
                    onClick={() => handleRouteChange('/actions')}
                  >
                    <CallToActionOutlinedIcon style={{ fontSize: '30px' }} />
                  </IconButton>
                ),
                name: 'Actions',
              },
              {
                icon: (
                  <IconButton
                    color="inherit"
                    onClick={() => handleRouteChange('/discussion')}
                  >
                    <ChatBubbleOutlineSharpIcon style={{ fontSize: '30px' }} />
                  </IconButton>
                ),
                name: 'Discussion',
              },
            ].map((item, index) => (
              <Grid item key={index}>
                <div className={classes.navitem}>
                  {item.icon}
                  <Typography variant="body2">{item.name}</Typography>
                </div>
              </Grid>
            ))}
            <Grid item>
              {isAuthorized ? (
                <div className={classes.navitem}>
                  <IconButton color="inherit" onClick={handleMenu}>
                    <AccountCircleOutlinedIcon style={{ fontSize: '30px' }} />
                  </IconButton>
                  <Typography variant="body2">Profile</Typography>
                </div>
              ) : (
                <div className={classes.navitem}>
                  <IconButton
                    color="inherit"
                    onClick={() => handleRouteChange('/auth/login')}
                  >
                    <AccountCircleOutlinedIcon style={{ fontSize: '30px' }} />
                  </IconButton>
                  <Typography variant="body2">Login</Typography>
                </div>
              )}
            </Grid>
          </Grid>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => handleRouteChange(`/profile/${users.userId}`)}
              className={classes.menuitem}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogOut} className={classes.menuitem}>
              Log Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <SnackAlert
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        vertical="top"
        horizontal="right"
        message="You logged out!"
      />
    </>
  )
}

export default Navbar
