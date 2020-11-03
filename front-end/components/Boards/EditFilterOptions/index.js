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
import CheckIcon from '@material-ui/icons/Check'

const useStyles = makeStyles((theme) => ({
  dlghead: {
    margin: 'auto',
    textAlign: 'center',
    fontSize: '14px',
  },
  close: {
    background: '#000000',
    color: '#ffffff',
    textTransform: 'none',
    fontSize: '14px',
  },
  options: {
    width: '100%',
  },
  labelcontrol: {
    fontSize: '20px',
  },
  closedlg: {
    margin: 'auto',
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const EditFilterOptions = ({ open, handleClose, onSetSortMethod }) => {
  const classes = useStyles()

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle className={classes.dlghead}>Filter Options</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup row defaultValue="atoz">
              <Box className={classes.options}>
                <FormControlLabel
                  value="atoz"
                  control={
                    <Radio
                      color="default"
                      checkedIcon={<CheckIcon style={{ fontSize: '30px' }} />}
                      icon={
                        <RadioButtonUncheckedRoundedIcon
                          style={{ fontSize: '30px', color: '#ffffff' }}
                        />
                      }
                      onClick={() => onSetSortMethod('atoz')}
                    />
                  }
                  label={<span className={classes.labelcontrol}>A to Z</span>}
                  labelPlacement="start"
                />
              </Box>
              <Box className={classes.options}>
                <FormControlLabel
                  value="recent"
                  control={
                    <Radio
                      color="default"
                      checkedIcon={<CheckIcon style={{ fontSize: '30px' }} />}
                      icon={
                        <RadioButtonUncheckedRoundedIcon
                          style={{ fontSize: '30px', color: '#ffffff' }}
                        />
                      }
                      onClick={() => onSetSortMethod('recent')}
                    />
                  }
                  label={
                    <span className={classes.labelcontrol}>
                      More recently saved to
                    </span>
                  }
                  labelPlacement="start"
                />
              </Box>
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions className={classes.closedlg}>
          <Button
            onClick={handleClose}
            variant="contained"
            className={classes.close}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EditFilterOptions
