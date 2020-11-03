import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import Typography from '@material-ui/core/Typography'
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined'
import InstagramIcon from '@material-ui/icons/Instagram'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'

import EditBoards from '../Boards/EditBoards'
import SnackAlert from '../SnackAlert'
import * as boardAPI from '../../api/boards'
import { copySharableLink } from '../../helpers/share'

const FBSHAREURL = `http://www.facebook.com/sharer/sharer.php?u=`

const useStyles = makeStyles((theme) => ({
  iconbtn: {
    width: '50px',
    height: '50px',
    background: '#979797',
    margin: '15px',
    '&:focus, &:hover': {
      background: '#aaaaaa',
    },
  },
  icon: {
    color: '#ffffff',
  },
  iconpanel: {
    display: 'inline',
  },
  share: {
    paddingTop: theme.spacing(3),
  },
  dlgcontent: {
    textAlign: 'center',
  },
  dlgehead: {
    margin: 'auto',
  },
  dlgcancel: {
    margin: 'auto',
    paddingBottom: '5%',
  },
  editboard: {
    border: '2px #000000 solid',
    textTransform: 'none',
    fontSize: '14px',
  },
  cancel: {
    background: '#000000',
    color: '#ffffff',
    textTransform: 'none',
    fontSize: '14px',
  },
}))

const iconstyle = { fontSize: '30px' }
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function EditDialog({
  open,
  tags,
  bio,
  onClose,
  boardID,
  boardTitle,
  onUpdateDownloadCount,
  isEditBtnEnabled,
}) {
  const classes = useStyles()
  const { users } = useSelector((state) => state)
  const [editBoardOpen, setEditBoardOpen] = useState(false)
  const [isSnackOpen, setSnackOpen] = useState(false)

  const { token } = users
  const Authorization = `Bearer ${token}`

  const handleEditBoardClick = () => {
    setEditBoardOpen(true)
    onClose()
  }

  const handleGetSharableLink = () => {
    boardAPI
      .getShortenURL({ Authorization, url: window.location.href })
      .then((res) => {
        const { result, link } = res.data
        if (result === 0 && copySharableLink(link)) setSnackOpen(true)
        boardAPI.shareBoardCount({ Authorization, boardID }).then((result) => {
          const { data } = result
          const { downloads } = data
          onUpdateDownloadCount(downloads)
        })
      })
  }

  const handleTwitterShare = () => {
    boardAPI
      .getShortenURL({ Authorization, url: window.location.href })
      .then((res) => {
        const { result, link } = res.data
        if (!result && copySharableLink(link)) {
          setSnackOpen(true)

          const shareURL = 'http://twitter.com/share?'
          const url = encodeURIComponent('https://bit.ly/3fgGICZ')
          const text = encodeURIComponent(boardTitle)
          const hashTags = tags.join(',')
          window.open(
            `${shareURL}url=${url}&text=${text}&hashtags=${hashTags}`,
            '',
            'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0'
          )

          boardAPI
            .shareBoardCount({ Authorization, boardID })
            .then((result) => {
              const { data } = result
              const { downloads } = data
              onUpdateDownloadCount(downloads)
            })
        }
      })
  }

  const handleInstagramShare = async () => {
    boardAPI
      .getShortenURL({ Authorization, url: window.location.href })
      .then(async (res) => {
        const { result, link } = res.data
        if (result === 0 && copySharableLink(link)) setSnackOpen(true)
        const shareData = {
          title: boardTitle,
          url: 'https://www.instagram.com',
        }

        try {
          await navigator.share(shareData)
        } catch (e) {
          console.log(e)
        }
      })
  }

  const handleFacebookShare = () => {
    boardAPI
      .getShortenURL({ Authorization, url: window.location.href })
      .then((res) => {
        const { result, link } = res.data
        if (result === 0 && copySharableLink(link)) setSnackOpen(true)
        const params = 'menubar=no,toolbar=no,status=no,width=570,height=570'
        const shareUrl = `${FBSHAREURL}${link}`

        window.open(shareUrl, 'NewWindow', params)
      })
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
      >
        {isEditBtnEnabled && (
          <DialogTitle className={classes.dlgehead}>
            <Button
              variant="contained"
              className={classes.editboard}
              onClick={handleEditBoardClick}
            >
              Edit Board
            </Button>
          </DialogTitle>
        )}
        <Divider />
        <DialogContent className={classes.dlgcontent}>
          <Typography variant="h4" className={classes.share}>
            Share
          </Typography>
          {[
            {
              icon: (
                <IconButton
                  className={classes.iconbtn}
                  onClick={handleTwitterShare}
                >
                  <TwitterIcon style={iconstyle} className={classes.icon} />
                </IconButton>
              ),
            },
            {
              icon: (
                <IconButton
                  className={classes.iconbtn}
                  onClick={handleGetSharableLink}
                >
                  <LinkOutlinedIcon
                    style={iconstyle}
                    className={classes.icon}
                  />
                </IconButton>
              ),
            },
            {
              icon: (
                <IconButton
                  className={classes.iconbtn}
                  onClick={handleInstagramShare}
                >
                  <InstagramIcon style={iconstyle} className={classes.icon} />
                </IconButton>
              ),
            },
            {
              icon: (
                <IconButton
                  className={classes.iconbtn}
                  onClick={handleFacebookShare}
                >
                  <FacebookIcon style={iconstyle} className={classes.icon} />
                </IconButton>
              ),
            },
          ].map((el, index) => (
            <div key={index} className={classes.iconpanel}>
              {el.icon}
            </div>
          ))}
        </DialogContent>
        <DialogActions className={classes.dlgcancel}>
          <Button
            onClick={onClose}
            variant="contained"
            className={classes.cancel}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {isEditBtnEnabled && (
        <EditBoards
          open={editBoardOpen}
          boardID={boardID}
          handleClose={() => setEditBoardOpen(false)}
        />
      )}
      <SnackAlert
        vertical="top"
        horizontal="center"
        open={isSnackOpen}
        onClose={() => setSnackOpen(false)}
        message="link copied!"
      />
    </div>
  )
}
