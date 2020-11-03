import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import ReactPlayer from 'react-player'

import BoardHead from '../BoardHead'
import * as boardAPI from '../../../api/boards'
import { isVideo, isImage } from '../../../helpers/file'

const useStyles = makeStyles((theme) => ({
  title: {
    position: 'absolute',
    top: '10px',
    textAlign: 'center',
    marginTop: '10%',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '800',
  },
  headtitle: {
    textAlign: 'center',
    margin: '5% 0 5% 0',
  },
  cardboard: {
    position: 'relative',
    width: '137px',
    height: '128px',
    borderRadius: '18px',
    boxShadow: 'none',
  },
  gridboard: {
    position: 'relative',
  },
  cardmedia: {
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: '#4e4e4e',
    width: '100%',
    height: '100%',
    opacity: '0.7',
    textAlign: 'center',
  },
  overlayimg: {
    marginTop: '30px',
  },
  next: {
    width: '90%',
    margin: 'auto',
    textAlign: 'end',
    marginTop: '5%',
  },
  nextbtn: {
    textTransform: 'none',
    background: '#999999',
    fontSize: '14px',
    color: '#cccccc',
    paddingLeft: '30px',
    paddingRight: '30px',
  },
}))

const commonstyle = {
  width: '137px',
  height: '128px',
  borderRadius: '18px',
}
const createBoardStyle = {
  ...commonstyle,
  background: '#000000',
  borderColor: '#979797',
}

const BoardInit = ({
  boardName,
  boardDesc,
  hashTags,
  file,
  onNext,
  onPrevious,
  steps,
  recommendations,
}) => {
  const classes = useStyles()
  const router = useRouter()
  const [selectedCards, setSelectedCards] = useState([])
  const [isNextEnable, setNextEnable] = useState(false)
  const { users } = useSelector((state) => state)

  const handleCardSelect = ({ chosenID, type }) => {
    if (selectedCards.findIndex((el) => el.cardID === chosenID) > -1) {
      let selected = selectedCards
      selected.splice(
        selectedCards.findIndex((el) => el.cardID === chosenID),
        1
      )
      /**
       * @see https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render
       */
      setSelectedCards([...selected])
    } else {
      setSelectedCards([...selectedCards, { cardID: chosenID, type }])
    }
  }

  const handleNextToCreateBoard = () => {
    const { token, userId: userID } = users
    const Authorization = `Bearer ${token}`
    let tags = hashTags.replace(' ', '').split('#')
    tags.splice(0, 1)

    let media = []
    let action = []

    selectedCards.forEach((item) => {
      if (item.type === 'media') {
        media.push(item.cardID)
      } else {
        action.push(item.cardID)
      }
    })

    const formData = new FormData()
    if (file) formData.append('file', file, file.name)

    formData.append('userID', userID)
    formData.append('name', boardName)
    formData.append('bio', boardDesc)
    formData.append('tags', tags)
    formData.append('media', media)
    formData.append('action', action)

    boardAPI.createBoard({ Authorization, formData }).then((res) => {
      const { result, board } = res.data
      const { _id } = board
      router.push(`/board/${_id}`)
    })
  }

  return (
    <>
      <BoardHead boardTitle={boardName} steps={steps} onPrevious={onPrevious} />
      <div className={classes.headtitle}>
        {recommendations.length > 0 && (
          <Typography variant="h5">
            Get Started with these card recommendations
          </Typography>
        )}
      </div>
      <div>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>
              {recommendations.map((el) => (
                <Grid key={el.id} item className={classes.gridboard}>
                  <Card
                    className={classes.cardboard}
                    style={createBoardStyle}
                    onClick={() =>
                      handleCardSelect({ chosenID: el.id, type: el.type })
                    }
                  >
                    {el.type === 'media' ? (
                      <>
                        {el.downloadFields.length > 0 &&
                          isImage(el.downloadFields[0].file.url) && (
                            <CardMedia
                              image={el.downloadFields[0].file.url}
                              className={classes.cardmedia}
                            />
                          )}
                        {el.downloadFields &&
                          isVideo(el.downloadFields[0].file.url) && (
                            <ReactPlayer
                              url={el.downloadFields[0].file.url}
                              loop={true}
                              width="100%"
                              height="100%"
                            />
                          )}
                      </>
                    ) : (
                      <>
                        {el.media && isImage(el.media) && (
                          <CardMedia
                            image={el.media}
                            className={classes.cardmedia}
                          />
                        )}
                        {el.media && isVideo(el.media) && (
                          <ReactPlayer
                            url={el.media}
                            loop={true}
                            width="100%"
                            height="100%"
                          />
                        )}
                      </>
                    )}
                    <div className={classes.overlay}>
                      {selectedCards.findIndex(
                        (item) => item.cardID === el.id
                      ) > -1 && (
                        <img
                          src="https://rabble-dev.s3.amazonaws.com/assets/check.png"
                          className={classes.overlayimg}
                        />
                      )}
                    </div>
                    <Typography className={classes.title} variant="h5">
                      {el.title}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <div className={classes.next}>
          <Button
            variant="contained"
            className={classes.nextbtn}
            // disabled={!selectedCards.length}
            onClick={handleNextToCreateBoard}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}

export default BoardInit
