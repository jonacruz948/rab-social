import React from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined'

const DEFAULT_COVER_IMAGE =
  'https://rabble-dev.s3.amazonaws.com/assets/reactangle.png'

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
  desc: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    color: '#ffffff',
  },
  cards: {
    position: 'absolute',
    top: '60%',
    left: '20%',
    color: '#ffffff',
  },
  createboardbtn: {
    textAlign: 'center',
    marginBottom: '10%',
  },
  btn: {
    borderRadius: '0',
    background: '#000000',
    color: '#ffffff',
    textTransform: 'none',
    fontSize: '14px',
  },
}))

const Created = ({ boards }) => {
  const classes = useStyles()
  const router = useRouter()

  const handleCreateBoard = () => {
    router.push('/board/new')
  }

  return (
    <>
      <div className={classes.createboardbtn}>
        <Button
          variant="contained"
          onClick={handleCreateBoard}
          className={classes.btn}
        >
          <AddCircleOutlineOutlinedIcon style={{ fontSize: '30px' }} />
          &nbsp;&nbsp;Create a Board
        </Button>
      </div>
      <Grid container justify="center" spacing={3}>
        {boards.map((item, index) => (
          <Grid key={index} item xs={6} sm={6} md={4}>
            <Card className={classes.card}>
              <CardActionArea
                className={classes.actionarea}
                onClick={() => router.push(`/board/${item.boardID}`)}
              >
                <CardMedia
                  image={item.coverimage}
                  className={classes.coverImage}
                />
                <Typography variant="body2" className={classes.desc}>
                  {item.name}
                </Typography>
                <Typography variant="body1" className={classes.cards}>
                  {[...item.cards.media, ...item.cards.action].length} Cards
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Created
