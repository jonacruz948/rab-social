import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'next/link'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import ReactPlayer from 'react-player'

import AdminPanContext from '../../../../context/AdminPanContext'
import { isVideo, isImage } from '../../../../helpers/file'
import _ from 'lodash/array'

const CHECKMARK_ICON = 'https://rabble-dev.s3.amazonaws.com/assets/check.png'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    textAlign: 'center',
    position: 'relative',
    color: theme.palette.text.secondary,
    borderRadius: '20px',
  },
  actionArea: {
    height: '300px',
    background: '#000',
  },
  media: {
    height: '100%',
    opacity: '0.4',
  },
  boardPan: {
    position: 'absolute',
    bottom: 0,

    width: '100%',
  },
  boardName: {
    color: '#fff',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  reactPlayer: {
    opacity: '0.4',
  },
  avatar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '56px',
  },
}))

const Cardpan = ({ index }) => {
  const classes = useStyles()
  const { state: adminPanState, dispatch: adminPanDispatch } = useContext(
    AdminPanContext
  )

  const {
    mediaCards,
    actionCards,
    users,
    selectedCards,
    selectedUser,
  } = adminPanState

  const cards = index === 1 ? mediaCards : actionCards

  useEffect(() => {
    let bkState = {}

    const bkCardIDs = [...new Set(cards.map((el) => el.card.id))]

    bkCardIDs.forEach((el) => {
      bkState[el] = ''
    })

    bkState = {
      ...bkState,
      ...selectedCards,
    }

    adminPanDispatch({
      type: 'SET_CARDS_STATUS',
      payload: { selectedCards: bkState },
    })
  }, [])

  const handleMenuChange = (e, ID) => {
    adminPanDispatch({
      type: 'SET_CARDS_STATUS',
      payload: { selectedCards: { ...selectedCards, [ID]: e.target.value } },
    })
  }

  const handleSelectedUser = (cardID, userID, avatar) => {
    adminPanDispatch({
      type: 'SET_SELECTED_USERS',
      payload: {
        selectedUser: {
          ...selectedUser,
          [cardID]: { userID, avatar },
        },
      },
    })
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          {cards.map((el, index) => {
            const media =
              el.card.type === 'media'
                ? el.card.downloadFields[0].file.url
                : el.card.media

            const { bkUsers } = el
            let bkUserIDs = [...new Set(bkUsers)]
            const bkDetails = bkUserIDs
              .map((userID) => users.find((item) => item.userID === userID))
              .filter((detail) => detail)

            return (
              <Grid item xs={4} key={index}>
                <Link href={`/cards/${el.card.id}`}>
                  <Card className={classes.card}>
                    <CardActionArea className={classes.actionArea}>
                      {isImage(media) && (
                        <CardMedia
                          image={media || '/images/3.png'}
                          className={classes.media}
                        />
                      )}
                      {isVideo(media) && (
                        <ReactPlayer
                          url={media}
                          loop={true}
                          height="none"
                          className={classes.reactPlayer}
                        />
                      )}
                      {selectedCards[el.card.id] && (
                        <Avatar
                          src={CHECKMARK_ICON}
                          className={classes.avatar}
                        />
                      )}
                    </CardActionArea>
                    <div className={classes.boardPan}>
                      <Typography
                        variant="subtitle1"
                        className={classes.boardName}
                      >
                        {el.card.title}
                      </Typography>
                    </div>
                  </Card>
                </Link>
                <FormControl className={classes.formControl} fullWidth>
                  {bkDetails.length > 0 ? (
                    <>
                      <InputLabel id="select-bookmarker">Select one</InputLabel>
                      <Select
                        labelId="select-bookmarker"
                        id="demo-simple-select"
                        value={selectedCards[el.card.id] || ''}
                        inputProps={{
                          name: el.card.id,
                          className: 'bookmarkerSelect',
                        }}
                        onChange={(e) => handleMenuChange(e, el.card.id)}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {bkDetails.map((bkEl, index) => (
                          <MenuItem
                            key={index}
                            value={bkEl.fullName}
                            onClick={() =>
                              handleSelectedUser(
                                el.card.id,
                                bkEl.userID,
                                bkEl.avatar
                              )
                            }
                          >
                            <ListItemAvatar>
                              <Avatar src={bkEl.avatar} />
                            </ListItemAvatar>
                            <ListItemText>by {bkEl.fullName}</ListItemText>
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <List>
                      <ListItem>
                        <ListItemText>
                          <em>No one bookmarked</em>
                        </ListItemText>
                      </ListItem>
                    </List>
                  )}
                </FormControl>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    </div>
  )
}

export default Cardpan
