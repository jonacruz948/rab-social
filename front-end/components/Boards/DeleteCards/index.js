import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Slide from '@material-ui/core/Slide'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Box from '@material-ui/core/Box'
import DialogActions from '@material-ui/core/DialogActions'
import RadioButtonUncheckedRoundedIcon from '@material-ui/icons/RadioButtonUncheckedRounded'

const useStyles = makeStyles((theme) => ({
  dlghead: {
    margin: 'auto',
    textAlign: 'center',
    fontSize: '14px',
    width: '80%',
  },
  close: {
    background: '#ffffff',
    color: '#000000',
    border: '1px #000000 solid',
    textTransform: 'none',
    fontSize: '14px',
  },
  delete: {
    background: '#ff0f0f',
    textTransform: 'none',
    fontSize: '14px',
    color: '#ffffff',
  },
  options: {
    width: '100%',
  },
  labelcontrol: {
    fontSize: '20px',
  },
  closedlg: {
    margin: 'auto',
    marginBottom: '20px',
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const DeleteCards = ({ open, handleClose, handleDelete }) => {
  const classes = useStyles()

  const handleCardsDelete = () => {
    handleDelete()
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle className={classes.dlghead}>
          Are you sure you want to delete these cards from your board?
        </DialogTitle>
        <DialogActions className={classes.closedlg}>
          <Button
            onClick={handleClose}
            variant="contained"
            className={classes.close}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCardsDelete}
            variant="contained"
            className={classes.delete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DeleteCards
