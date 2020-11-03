import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Card from '@material-ui/core/Card'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background: '#fff',
    color: '#000',
    boxShadow: 'none',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  card: {
    padding: theme.spacing(3, 2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  close: {
    marginTop: theme.spacing(5),
  },
  closebtn: {
    background: '#000',
    color: '#fff',
    textTransform: 'none',
    width: '30%',
    borderRadius: 0,
    '&:focus, &:hover': {
      background: '#000',
      color: '#fff',
    },
  },
  thankyou: {
    fontWeight: 800,
  },
  submitted: {
    width: '60%',
    margin: 'auto',
    paddingTop: theme.spacing(3),
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const SuggestCardThanks = ({ open, onClose }) => {
  const classes = useStyles()
  const router = useRouter()

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => router.back()}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Card className={classes.card}>
          <Typography variant="h5" className={classes.thankyou}>
            Thank you! :)
          </Typography>
          <div>
            <Typography variant="body1" className={classes.submitted}>
              Thank you for submitting! There will be copy here describing a but
              more. Lorem ipsum dolor.
            </Typography>
          </div>
          <div className={classes.close}>
            <Button
              onClick={onClose}
              variant="outlined"
              className={classes.closebtn}
              onClick={() => router.back()}
            >
              Close
            </Button>
          </div>
        </Card>
      </Dialog>
    </div>
  )
}

export default SuggestCardThanks
