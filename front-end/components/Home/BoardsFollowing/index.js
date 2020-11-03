import React from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import { Button } from '@material-ui/core'
import ReactPlayer from 'react-player/lazy'
import { isImage, isVideo } from '../../../helpers/file'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    paddingBottom: theme.spacing(15),
  },
  media: {
    height: '140px',
    objectFit: 'cover',
  },
  covermedia: {
    padding: theme.spacing(2),
  },
  card: {
    borderRadius: '20px',
    height: '100%',
    minHeight: '140px',
    background: theme.palette.grey[500],
  },
  actionarea: {
    height: '100%',
  },
  viewboard: {
    textAlign: 'center',
  },
  viewboardBtn: {
    fontFamily: 'Suisse Intl Bold',
    textTransform: 'none',
    fontWeight: 800,
    border: `1px solid #060606`,
    fontSize: '12px',
    borderRadius: 0,
  },
}))

const BoardsFollowing = ({ bookmarkBoardData, cardData }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {bookmarkBoardData &&
        bookmarkBoardData.map((item, index) => {
          const { cards } = item
          const cardToDisplay = [
            ...cards.media,
            ...cards.action,
          ].map((cardID) => cardData.find((card) => card.id === cardID))

          return (
            <div key={index}>
              <div>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={item.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          Saved to <strong>{item.name}</strong>
                        </Typography>
                      }
                      secondary={
                        <Typography variant="subtitle2">
                          <strong>by {item.fullName}</strong>
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
                <Grid container>
                  {cardToDisplay.map(
                    (card, index) =>
                      card && (
                        <Grid
                          item
                          xs={6}
                          className={classes.covermedia}
                          key={index}
                        >
                          <Card className={classes.card}>
                            <Link href={`/cards/${card.slug}`}>
                              <CardActionArea className={classes.actionarea}>
                                {isImage(
                                  card.media || card.downloadFields[0].file.url
                                ) ? (
                                  <CardMedia
                                    className={classes.media}
                                    image={card.media}
                                  />
                                ) : (
                                  <ReactPlayer
                                    url={
                                      card.media ||
                                      card.downloadFields[0].file.url
                                    }
                                    loop={true}
                                    width="100%"
                                    height="100%"
                                  />
                                )}
                              </CardActionArea>
                            </Link>
                          </Card>
                        </Grid>
                      )
                  )}
                </Grid>
              </div>
              <div className={classes.viewboard}>
                <Link href={`/board/${item.boardID}`}>
                  <Button variant="outlined" className={classes.viewboardBtn}>
                    View Board
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default BoardsFollowing
