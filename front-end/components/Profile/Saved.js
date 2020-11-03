import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles((theme) => ({
  coverImage: {
    // paddingTop: '56.25%',
    width: '100%',
    height: '100%',
    borderRadius: '18px',
  },
  card: {
    width: '100%',
    height: '250px',
    borderRadius: '18px',
    background: '#36006e',
  },
  actionarea: {
    width: '100%',
    height: '100%',
  },
  cardcover: {
    position: 'relative',
    borderRadius: '18px',
    overflow: 'hidden',
  },
  cards: {
    position: 'absolute',
    top: '60%',
    left: '20%',
    color: '#ffffff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: '#4e4e4e',
    width: '100%',
    height: '100%',
    opacity: '0.5',
    textAlign: 'center',
    borderRadius: '18px',
  },
  someoneavatar: {
    width: '30px',
    height: '30px',
  },
  listitemavatar: {
    minWidth: '40px',
  },
  ownerArea: {
    position: 'absolute',
    bottom: 0,
  },
  boardInfo: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '80%',
    color: '#ffffff',
  },
}))

const DEFAULT_COVER_IMAGE =
  'https://rabble-dev.s3.amazonaws.com/assets/reactangle.png'

const DEFAULT_AVATAR = 'https://rabble-dev.s3.amazonaws.com/assets/user.jpeg'

const Saved = ({ boards }) => {
  const classes = useStyles()
  const router = useRouter()

  return (
    <>
      <Grid container justify="center" spacing={2}>
        {boards.map((item, index) => (
          <Grid key={index} item xs={6}>
            <Link href={`/board/${item.boardID}`}>
              <div className={classes.cardcover}>
                <Card className={classes.card}>
                  <CardActionArea
                    className={classes.actionarea}
                    onClick={() => router.push(`/board/${item.boardID}`)}
                  >
                    <CardMedia
                      image={item.coverimage}
                      className={classes.coverImage}
                    />
                  </CardActionArea>
                  <List className={classes.ownerArea}>
                    <ListItem>
                      <ListItemAvatar className={classes.listitemavatar}>
                        <Avatar
                          src={item.avatar ? item.avatar : DEFAULT_AVATAR}
                          className={classes.someoneavatar}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <span>
                            By&nbsp;
                            <strong>{item.fullName}</strong>
                          </span>
                        }
                        style={{ color: '#fff' }}
                      />
                    </ListItem>
                  </List>
                </Card>
                <div className={classes.boardInfo}>
                  <Typography variant="h6" style={{ color: '#fff' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body1">
                    {[...item.cards.media, ...item.cards.action].length} Cards
                  </Typography>
                </div>
              </div>
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Saved
