import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import Divider from '@material-ui/core/Divider'
import ReactPlayer from 'react-player/lazy'

import * as boardAPI from '../../../api/boards'
import { isVideo, isImage } from '../../../helpers/file'

const commonstyle = {
  width: '137px',
  height: '128px',
  borderRadius: '18px',
}

const useStyles = makeStyles((theme) => ({
  cards: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  moreideatitle: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    color: '#ffffff',
    fontSize: '14px',
    marginTop: '20%',
  },
  cardboard: {
    width: '137px',
    height: '128px',
    borderRadius: '25px',
    position: 'relative',
    textAlign: 'center',
    boxShadow: 'none',
    background: '#000',
  },
  actionarea: {
    width: '100%',
    height: '100%',
    textTransform: 'none',
  },
  media: {
    ...commonstyle,
    paddingTop: '56.25%',
    opacity: 0.4,
  },
  cardcontent: {
    color: '#ffffff',
    position: 'absolute',
    top: '20px',
    color: '#ffffff',
  },
  reactplayer: {
    opacity: 0.4,
  },
}))

const BoardMoreIdeas = ({ boardID }) => {
  const classes = useStyles()
  const [moreIdeas, setMoreIdeas] = useState([])

  useEffect(() => {
    boardAPI.findMoreIdeas(boardID).then((result) => {
      setMoreIdeas(result.data)
    })
  }, [])

  return (
    <div className={classes.root}>
      <Divider />
      <Box className={classes.cards}>
        <Box className={classes.moreideatitle}>
          <Typography variant="h6">Find More Ideas</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>
              {moreIdeas.map((el) => {
                const media =
                  el.type === `media`
                    ? el.downloadFields[0].file.url
                    : el.media || '/images/3.png'

                return (
                  <Grid key={el.id} item>
                    <Card className={classes.cardboard}>
                      <CardActionArea className={classes.actionarea}>
                        {isImage(media) && (
                          <CardMedia
                            className={classes.media}
                            image={media}
                            title={el.title}
                          />
                        )}
                        {isVideo(media) && (
                          <ReactPlayer
                            url={media}
                            loop={true}
                            width="100%"
                            height="100%"
                            className={classes.reactplayer}
                          />
                        )}
                      </CardActionArea>
                      <div className={classes.cardcontent}>
                        <Typography
                          variant="body1"
                          style={{ color: '#ffffff' }}
                        >
                          {el.title}
                        </Typography>
                      </div>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default BoardMoreIdeas
