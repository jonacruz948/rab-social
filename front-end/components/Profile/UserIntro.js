import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined'
import SettingsIcon from '@material-ui/icons/Settings'

import { LEVELS } from '../../constant/points'
const DEFAULT_AVATAR = 'https://rabble-dev.s3.amazonaws.com/assets/user.jpeg'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  bio: {
    marginTop: theme.spacing(3),
  },
  avatar: {
    textAlign: 'center',
  },
  cardmedia: {
    height: '100%',
  },
  card: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    boxShadow: 'none',
    margin: 'auto',
  },
  actionarea: {
    height: theme.spacing(10),
    width: theme.spacing(10),
  },
  setting: {
    position: 'absolute',
    right: '10px',
    display: 'grid',
    justifyContent: 'end',
  },
  iconbutton: {
    // position: 'absolute',
    width: '35px',
    height: '35px',
    boxShadow:
      '0 0.46875rem 2.1875rem rgba(90,97,105,.1), 0 0.9375rem 1.40625rem rgba(90,97,105,.1), 0 0.25rem 0.53125rem rgba(90,97,105,.12), 0 0.125rem 0.1875rem rgba(90,97,105,.1)',
  },
  input: {
    display: 'none',
  },
  containerRoot: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  location: {
    paddingLeft: '0',
  },
  listitemavatar: {
    minHeight: '0',
    minWidth: '30px',
  },
  listitemtext: {
    fontSize: '14px',
  },

  editnames: {
    display: 'flex',
    marginTop: theme.spacing(2),
  },
  biocontent: {
    fontSize: '14px',
  },
}))

const UserIntro = ({
  level,
  avatar,
  fullName,
  userName,
  city,
  state,
  bio,
  slug,
  points,
  onSettingDlgOpen,
}) => {
  const classes = useStyles()
  const [profileAvatar, setProfileAvatar] = useState(DEFAULT_AVATAR)
  const [profileBio, setBio] = useState('')
  const [profileUserName, setProfileUserName] = useState('')
  const [profileFullName, setFullName] = useState('')
  const [profileState, setState] = useState('')
  const [profileCity, setCity] = useState('')
  const { users } = useSelector((state) => state)

  useEffect(() => {
    setBio(bio)
    setFullName(fullName)
    setCity(city)
    setState(state)
    setProfileAvatar(avatar)
    setProfileUserName(userName)
  }, [bio, fullName, city, state, userName, avatar])

  const handleSettingsClick = () => {
    onSettingDlgOpen()
  }

  const index = LEVELS.findIndex((level) => points < level)

  return (
    <div className={classes.root}>
      <div className={classes.setting}>
        {users.userId === slug && (
          <IconButton
            className={classes.iconbutton}
            onClick={handleSettingsClick}
          >
            <SettingsIcon style={{ fontSize: '25px' }} />
          </IconButton>
        )}
      </div>
      <Grid container className={classes.containerRoot}>
        <Grid item xs={4} className={classes.avatar}>
          <Card className={classes.card}>
            <CardActionArea className={classes.actionarea} component="span">
              <CardMedia
                image={profileAvatar ? profileAvatar : DEFAULT_AVATAR}
                className={classes.cardmedia}
              />
            </CardActionArea>
          </Card>
          <Typography variant="body1"> Level </Typography>
          <Typography variant="h5" style={{ color: '#00a8b4' }}>
            {index}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <div className={classes.editnames}>
            <Typography variant="body1">{profileUserName}</Typography>
          </div>
          <div className={classes.editnames}>
            <Typography variant="body1">{profileFullName}</Typography>
          </div>
          <div className={classes.bio}>
            <Typography variant="body1">{profileBio}</Typography>
          </div>
          <List>
            <ListItem className={classes.location}>
              <ListItemAvatar className={classes.listitemavatar}>
                <LocationOnOutlinedIcon style={{ fontSize: '30px' }} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <span className={classes.listitemtext}>
                    {profileCity}, {profileState}
                  </span>
                }
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </div>
  )
}

export default UserIntro
