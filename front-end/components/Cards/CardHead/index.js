import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { Carousel } from 'react-responsive-carousel'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined'
import ShareIcon from '@material-ui/icons/Share'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ReactPlayer from 'react-player/lazy'
import axios from 'axios'

import * as cardAPI from '../../../api/cards'

const font25Size = { fontSize: '25px' }

const useStyles = makeStyles((theme) => ({
  description: {
    position: 'absolute',
    top: '40%',
    width: '100%',
    margin: 'auto',
    color: '#ffffff',
    fontSize: '20px',
  },
  headroot: {
    position: 'relative',
  },
  backicon: {
    position: 'absolute',
    top: theme.spacing(3),
    left: theme.spacing(2),
    background: '#ffffff',
    width: '40px',
    height: '40px',
    '&:focus, &:hover': {
      background: '#ffffff',
    },
  },
  funcicons: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(2),
    display: 'grid',
  },
  bookmarkicon: {
    width: '40px',
    height: '40px',
    marginBottom: "5px",
    background: '#ffffff',
    '&:focus, &:hover': {
      background: '#ffffff',
    },
  },
  card: {
    width: '100%',
    height: '250px',
    background: '#36006e',
  },
  coverImage: {
    // paddingTop: '56.25%',
    width: '100%',
    height: '100%',
  },
  actionarea: {
    width: '100%',
    height: '100%',
  },
  downloadicon: {
    background: '#ffffff',
    marginBottom: "5px",
    width: '40px',
    height: '40px',
    // top: theme.spacing(1),
    '&:focus, &:hover': {
      background: '#ffffff',
    },
  },
  shareicon: {
    marginBottom: "5px",
    background: '#ffffff',
    width: '40px',
    height: '40px',
    // top: theme.spacing(1),
    '&:focus, &:hover': {
      background: '#ffffff',
    },
  },
  downloadMenu: {
    fontSize: '14px',
  },
}))

const CardHead = ({
  mediaType,
  card,
  url,
  onEditDlgOpen,
  isBookmarked,
  onCardBoardOpen,
  onSetBookmark,
  onSetCompletedCount,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isBookmark, setBookmark] = useState(false)
  const classes = useStyles()
  const router = useRouter()
  const { users } = useSelector((state) => state)
  const { token } = users
  const Authorization = `Bearer ${token}`

  useEffect(() => {
    setBookmark(isBookmarked)
  }, [isBookmarked])

  const handleOpenBoardToAddCard = () => {
    if (users.isAuthorized) {
      const { type, id } = card
      const cardsToAdd =
        type === `media`
          ? { media: [id], action: [] }
          : { action: [id], media: [] }
      onCardBoardOpen(cardsToAdd)
    } else {
      router.push('/auth/login')
    }
  }

  const handleRemoveBookmark = () => {
    const { type: cardType, id: cardID } = card
    const { userId: userID } = users

    cardAPI
      .removeCardBookmark({ Authorization, cardID, userID, cardType })
      .then((result) => {
        onSetBookmark(false)
      })
  }

  const handleDownloadCard = (downloadUrl, filename) => {
    setAnchorEl(null)

    axios({
      url: downloadUrl,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()

      const { id: cardID } = card
      cardAPI.updateDownloadCount({ Authorization, cardID }).then((result) => {
        const { completed } = result.data
        onSetCompletedCount(completed)
      })
    })
  }

  return (
    <div className={classes.headroot}>
      {mediaType === 'image' && (
        <Carousel
          showThumbs={false}
          showArrows={false}
          showStatus={false}
          autoPlay
          infiniteLoop
        >
          {[url, url, url, url, url].map((url, index) => (
            <Card className={classes.card} key={index}>
              <CardActionArea className={classes.actionarea}>
                <CardMedia image={url} className={classes.coverImage} />
              </CardActionArea>
            </Card>
          ))}
        </Carousel>
      )}
      {mediaType === 'video' && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ReactPlayer url={url} loop={true} width="100%" height="100%" />
          </Grid>
        </Grid>
      )}
      <IconButton onClick={() => router.back()} className={classes.backicon}>
        <ArrowBackIosOutlinedIcon style={font25Size} />
      </IconButton>
      <div className={classes.funcicons}>
        {isBookmarked ? (
          <IconButton
            className={classes.bookmarkicon}
            onClick={handleRemoveBookmark}
          >
            <BookmarkIcon style={font25Size} />
          </IconButton>
        ) : (
          <IconButton
            className={classes.bookmarkicon}
            onClick={handleOpenBoardToAddCard}
          >
            <BookmarkBorderIcon style={font25Size} />
          </IconButton>
        )}
        <IconButton
          className={classes.shareicon}
          onClick={() => onEditDlgOpen(false)}
        >
          <ShareIcon style={font25Size} />
        </IconButton>
        {card.type === 'media' && (
          <>
            <IconButton
              className={classes.downloadicon}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <CloudDownloadOutlinedIcon style={font25Size} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {card.downloadFields.map((item) => (
                <MenuItem
                  key={item.file.url}
                  onClick={() =>
                    handleDownloadCard(item.file.url, item.file.fileName)
                  }
                >
                  {item.title}
                </MenuItem>
              ))}
              {card.downloadJpgFiles.map((item) => (
                <MenuItem
                  key={item.file.url}
                  onClick={() =>
                    handleDownloadCard(item.file.url, item.file.fileName)
                  }
                  className={classes.downloadMenu}
                >
                  {item.title}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </div>
    </div>
  )
}

export default CardHead
