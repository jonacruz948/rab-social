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
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'

import * as adminAPI from '../../../api/admin'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    width: '50%',
    margin: 'auto',
  },
  card: {
    boxShadow: 'none',
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
  tags: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))

const Section = ({ section }) => {
  const classes = useStyles()
  const { boards, cards, tags } = section

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography>{section.sectionTitle}</Typography>
        <div className={classes.tags}>
          {tags.length > 0 &&
            tags.map((tag, index) => (
              <Chip key={index} label={tag} clickable />
            ))}
        </div>
        <Divider />
        <Grid container spacing={1} style={{ justifyContent: 'center' }}>
          <Grid container item xs={12} spacing={3}>
            {console.log(boards)}
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
                      </CardActionArea>
                      <div className={classes.boardPan}>
                        <Typography
                          variant="subtitle1"
                          className={classes.boardName}
                        >
                          {el.name}
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
                  <ListItem button>
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
        <Grid container spacing={1} style={{ justifyContent: 'center' }}>
          <Grid container item xs={12} spacing={3}>
            {cards.map((el, index) => (
              <Grid item xs={4} key={index}>
                <Card className={classes.card}>
                  <Link href={`/board/${el.card._id}`}>
                    <>
                      <CardActionArea className={classes.actionArea}>
                        <CardMedia
                          image={
                            el.card.media || el.card.downloadFields[0].file.url
                          }
                          className={classes.media}
                        />
                      </CardActionArea>
                      <div className={classes.boardPan}>
                        <Typography
                          variant="subtitle1"
                          className={classes.boardName}
                        >
                          {el.card.title}
                        </Typography>
                      </div>
                    </>
                  </Link>
                </Card>
                <List>
                  <ListItem button>
                    <ListItemAvatar>
                      <Avatar src={el.bkAvatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <span>
                          bookmarked by {<strong>{el.bookmarker}</strong>}
                        </span>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const {
    data: { section },
  } = await adminAPI.getSection({ sectionID: query.id })

  return {
    props: {
      section,
    },
  }
}

export default Section
