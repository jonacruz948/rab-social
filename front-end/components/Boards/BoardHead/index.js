import React, { useState, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import ShareIcon from '@material-ui/icons/Share'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import classnames from 'classnames'

import BoardDataContext from '../../../context/BoardDataContext'

const font25Size = { fontSize: '25px' }
const bkStyle = {
  height: '200px',
  lineHeight: '200px',
}

const useStyles = makeStyles((theme) => ({
  closeicon: {
    marginTop: '10px',
  },
  title: {
    textAlign: 'center',
    height: '100%',
    lineHeight: '200px',
  },
  boardtitle: {
    verticalAlign: 'middle',
    display: 'inline-block',
    color: '#ffffff',
    width: '100%',
    textAlign: 'center',
  },
  backicon: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    background: '#ffffff',
    '&:focus, &:hover': {
      background: '#ffffff',
    },
    width: '40px',
    height: '40px',
  },
  root: {
    position: 'relative',
  },
  moreicon: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    background: '#ffffff',
    width: '40px',
    height: '40px',
  },
  funcicons: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    display: 'grid',
  },
  shareicon: {
    background: '#ffffff',
    '&:focus, &:hover': {
      background: '#ffffff',
    },
    marginTop: theme.spacing(1),
    width: '40px',
    height: '40px',
  },
  bookmarkicon: {
    background: '#ffffff',
    '&:focus, &:hover': {
      background: '#ffffff',
    },
    width: '40px',
    height: '40px',
  },
  boardTitleText: {
    fontFamily: 'Suisse Intl Bold',
  },
}))

const BoardHead = ({
  steps,
  boardCreator,
  boardTitle,
  onEditDlgOpen,
  onPrevious,
  boardCreatedUserID,
}) => {
  const classes = useStyles()
  const {
    state: { boardID, name, desc, tags, coverimage },
  } = useContext(BoardDataContext)
  const [isCreator, setCreator] = useState(false)
  const { users } = useSelector((state) => state)
  const [boardCoverImage, setBoardCoverImage] = useState(coverimage)
  const router = useRouter()

  const dispatch = useDispatch()
  const { token, userId: userID } = users
  const Authorization = `Bearer ${token}`
  const { boards: bkBoards, cards: bkCards } = users

  useEffect(() => {
    setCreator(boardCreator)
  }, [boardCreator])

  useEffect(() => {
    if (coverimage) setBoardCoverImage(coverimage)
  }, [coverimage])
  const handleBookmarkBoard = () => {
    if (users.isAuthorized) {
      if (bkBoards.includes(boardID)) {
        //remove bookmark
        dispatch({
          type: 'REMOVE_BOOKMARK_FROM_BOARD_WATCHER',
          payload: {
            Authorization,
            boardID,
            userID,
            creatorID: boardCreatedUserID,
          },
        })
      } else {
        //add bookmark
        dispatch({
          type: 'BOOKMARK_BOARD_WATCHER',
          payload: {
            Authorization,
            boardID,
            userID,
            creatorID: boardCreatedUserID,
          },
        })
      }
    } else {
      router.push({
        pathname: '/auth/login',
        query: { redirectTo: `${window.location.pathname}` },
      })
    }
  }

  const handleCloseClick = () => {
    if (steps === 1) {
      onPrevious()
    } else {
      router.back()
    }
  }

  const coverStyle = {
    background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),url(${boardCoverImage}) center top / cover no-repeat`,
  }

  return (
    <>
      <div
        style={
          !boardTitle && boardCoverImage
            ? {

                backgroundColor: "#000",
                backgroundImage: `url(${coverimage}) `,
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                backgroundRepeat: 'none',

                ...bkStyle,
              }
            : { ...bkStyle }
        }
        className={classes.root}
      >
        {steps !== 2 && (
          <div className={classes.boardtitle}>
            <Typography variant="h4" className={classes.boardTitleText}>
              Create Board
            </Typography>
          </div>
        )}
        <div className={classes.close}>
          {steps !== 2 ? (
            <IconButton
              onClick={handleCloseClick}
              className={classnames(classes.iconbtn, classes.backicon)}
            >
              <CloseOutlinedIcon style={font25Size} />
            </IconButton>
          ) : (
            <Grid container>
              <Grid item xs={9}>
                <IconButton
                  onClick={() => router.back()}
                  className={classes.backicon}
                >
                  <ArrowBackIosOutlinedIcon style={font25Size} />
                </IconButton>
              </Grid>

              {isCreator ? (
                <Grid item xs={3}>
                  <IconButton
                    onClick={() => onEditDlgOpen(true)}
                    className={classes.moreicon}
                  >
                    <MoreHorizIcon style={font25Size} />
                  </IconButton>
                </Grid>
              ) : (
                <div className={classes.funcicons}>
                  <IconButton
                    className={classes.bookmarkicon}
                    onClick={handleBookmarkBoard}
                  >
                    {bkBoards.includes(boardID) ? (
                      <BookmarkIcon style={font25Size} />
                    ) : (
                      <BookmarkBorderIcon style={font25Size} />
                    )}
                  </IconButton>
                  <IconButton
                    className={classes.shareicon}
                    onClick={() => onEditDlgOpen(false)}
                  >
                    <ShareIcon style={font25Size} />
                  </IconButton>
                </div>
              )}
            </Grid>
          )}
        </div>
      </div>
    </>
  )
}

export default BoardHead
