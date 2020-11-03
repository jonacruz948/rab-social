import React, { useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import CloseIcon from '@material-ui/icons/Close'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import classnames from 'classnames'

import BoardDataContext from '../../../context/BoardDataContext'
import * as boardAPI from '../../../api/boards'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background: '#ffffff',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    fontFamily: 'Suisse Intl Semi-Bold',
  },
  boardbox: {
    width: '90%',
    margin: 'auto',
    marginTop: '20px',
  },
  card: {
    // width: '140px',
    // height: '140px',
  },
  media: {
    height: '140px',
    width: '100%',
  },
  actionarea: {
    height: '100%',
    width: '100%',
    background: '#a5a5a5',
    position: 'relative',
  },
  boardname: {
    marginTop: '10%',
  },
  savebox: {
    textAlign: 'center',
  },
  savebtn: {
    background: '#000000',
    color: '#ffffff',
    textTransform: 'none',
    fontSize: '14px',
    marginLeft: theme.spacing(2),
  },
  deletbtn: {
    background: '#ff0f0f',
    color: '#ffffff',
    textTransform: 'none',
    fontSize: '14px',
    marginRight: theme.spacing(2),
  },
  textfield: {
    width: '100%',
    fontSize: '20px',
  },
  input: {
    display: 'none',
  },
  label: {
    width: '100%',
  },
  uploadSymbol: {
    verticalAlign: 'middle',
    display: 'inline-block',
    color: '#ffffff',
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
  },
  uploadIcon: {
    fontSize: '40px',
    color: '#fff',
  },
  typography: {
    fontFamily: 'Suisse-Intl-Regular',
  },
}))

const icon = { fontSize: '30px', color: '#000000' }

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function EditBoards({ open, handleClose, boardID }) {
  const classes = useStyles()
  const {
    state: { name, desc, tags, coverimage },
    dispatch: boardDataDispatch,
  } = useContext(BoardDataContext)
  const router = useRouter()
  const [boardName, setBoardName] = useState('')
  const [boardDesc, setBoardDesc] = useState('')
  const [boardTags, setBoardTags] = useState('')
  const [selectedFile, setSelectedFile] = useState(
    'https://rabble-dev.s3.amazonaws.com/assets/reactangle.png'
  ) // used the broken url when there is no image url
  const { users } = useSelector((state) => state)
  const Authorization = `Bearer ${users.token}`

  useEffect(() => {
    const hashTags = tags && `#${tags.join(' #').replace(',', '')}`
    setBoardName(name)
    setBoardDesc(desc)
    setBoardTags(hashTags)
    if (coverimage) setSelectedFile(coverimage)
  }, [name, desc, tags, coverimage])

  const HandleFileChange = (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    formData.append('boardID', boardID)

    if (users.isAuthorized) {
      boardAPI
        .uploadBoardCoverImage({ Authorization, formData })
        .then((result) => {
          const { image } = result.data
          boardDataDispatch({
            type: 'SET_BOARD_DATA',
            payload: {
              name: boardName,
              bio: boardDesc,
              tags: tags,
              coverimage: image,
              boardID,
            },
          })
          setSelectedFile(image)
        })
        .catch((err) => console.log(err))
    }
  }

  const handleSaveChanges = () => {
    let tags = boardTags.replace(' ', '').split('#')
    tags.splice(0, 1)

    const payload = {
      boardID,
      name: boardName,
      bio: boardDesc,
      tags,
    }

    boardAPI
      .updateBoardMainContents({ Authorization, ...payload })
      .then((result) => {
        boardDataDispatch({
          type: 'SET_BOARD_DATA',
          payload: {
            ...payload,
            coverimage: selectedFile,
          },
        })
        handleClose()
      })
  }

  const handleDeleteBoard = () => {
    const { userId: userID } = users
    boardAPI.deleteBoard({ Authorization, boardID, userID }).then((result) => {
      router.back()
    })
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose}>
              <CloseIcon style={icon} />
            </IconButton>
            <Typography variant="h4" className={classes.title}>
              Edit Board
            </Typography>
          </Toolbar>
        </AppBar>
        <Box className={classes.boardbox}>
          <Box>
            <Typography variant="h5" className={classes.typography}>
              Board Cover
            </Typography>
            <div className={classes.btnroot}>
              <input
                accept="image/*"
                className={classes.input}
                type="file"
                id="contained-button-file"
                onChange={HandleFileChange}
              />
              <label htmlFor="contained-button-file" className={classes.label}>
                <Card className={classes.card}>
                  <CardActionArea
                    className={classes.actionarea}
                    component="span"
                  >
                    <CardMedia image={selectedFile} className={classes.media}>
                      <div className={classes.uploadSymbol}>
                        <AddCircleOutlineIcon className={classes.uploadIcon} />
                        <Typography
                          variant="subtitle1"
                          className={classes.typography}
                          color="inherit"
                        >
                          Upload Image
                        </Typography>
                      </div>
                    </CardMedia>
                  </CardActionArea>
                </Card>
              </label>
            </div>
          </Box>
          <Box className={classnames(classes.boardname)}>
            <Typography variant="h5" className={classes.typography}>
              Board Name
            </Typography>
            <TextField
              label="Required"
              value={boardName}
              className={classes.textfield}
              onChange={(e) => setBoardName(e.target.value)}
            />
          </Box>
          <Box className={classnames(classes.boardname)}>
            <Typography variant="h5" className={classes.typography}>
              Description
            </Typography>
            <TextField
              label="required"
              multiline
              value={boardDesc}
              className={classes.textfield}
              onChange={(e) => setBoardDesc(e.target.value)}
            />
          </Box>
          <Box className={classnames(classes.boardname)}>
            <Typography variant="h5" className={classes.typography}>
              Tags
            </Typography>
            <TextField
              label="Required"
              value={boardTags}
              className={classnames(classes.textfield, classes.typography)}
              onChange={(e) => setBoardTags(e.target.value)}
            />
          </Box>
          <Divider />
          <Box className={classes.savebox}>
            <Button
              variant="contained"
              className={classes.deletbtn}
              onClick={handleDeleteBoard}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              className={classes.savebtn}
              onClick={handleSaveChanges}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  )
}
