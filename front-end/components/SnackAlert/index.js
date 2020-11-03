import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'

const useStyles = makeStyles((theme) => ({
  snackbar: {
    textAlign: 'center',
    maxWidth: '300px',
  },
  content: {
    background: '#ffffff',
  },
  message: {
    width: '100%',
    color: '#000000',
    fontSize: '14px',
  },
}))

const SnackAlert = ({ open, vertical, horizontal, onClose, message }) => {
  const classes = useStyles()
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={onClose}
        key={vertical + horizontal}
        ContentProps={{
          className: classes.snackbar,
        }}
        autoHideDuration={3000}
      >
        <SnackbarContent
          message={<span className={classes.message}>{message}</span>}
          className={classes.content}
        />
      </Snackbar>
    </div>
  )
}

export default SnackAlert
