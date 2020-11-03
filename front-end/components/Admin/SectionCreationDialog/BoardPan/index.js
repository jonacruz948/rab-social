import React, { useContext } from 'react'
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
import _ from 'lodash/lang'

import AdminPanContext from '../../../../context/AdminPanContext'

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
  avatar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '56px',
  },
}))

const BoardPan = () => {
  const classes = useStyles()
  const { state: adminState, dispatch: adminPanDispatch } = useContext(
    AdminPanContext
  )

  const { boards, selectedBoards } = adminState

  const handleBoardClick = (ID, boardOwner) => {
    if (selectedBoards[ID]) {
      adminPanDispatch({
        type: 'SET_BOARDS_STATUS',
        payload: {
          selectedBoards: {
            ...selectedBoards,
            [ID]: {},
          },
        },
      })
    } else {
      adminPanDispatch({
        type: 'SET_BOARDS_STATUS',
        payload: {
          selectedBoards: {
            ...selectedBoards,
            [ID]: {
              boardID: ID,
              boardOwner,
            },
          },
        },
      })
    }
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          {boards.map((el, index) => (
            <Grid item xs={4} key={index}>
              <Card className={classes.card}>
                <Link href={`/board/${el.board._id}`}>
                  <>
                    <CardActionArea className={classes.actionArea}>
                      <CardMedia
                        image={el.board.coverimage}
                        className={classes.media}
                      />
                      {!_.isEmpty(selectedBoards[el.board._id]) && (
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
                        {el.board.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        className={classes.boardName}
                      >
                        (
                        {
                          [...el.board.cards.action, el.board.cards.media]
                            .length
                        }{' '}
                        Cards)
                      </Typography>
                    </div>
                  </>
                </Link>
              </Card>
              <List>
                <ListItem
                  button
                  onClick={() => handleBoardClick(el.board._id, el.boardOwner)}
                >
                  <ListItemAvatar>
                    <Avatar src={el.avatar} />
                  </ListItemAvatar>
                  <ListItemText primary={el.boardOwner} />
                </ListItem>
              </List>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  )
}

export default BoardPan
