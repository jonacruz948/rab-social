import React, { useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import AdminPanContext from '../../../context/AdminPanContext'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  addBtn: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}))

const AddSection = ({
  onOpenSectionCreation,
  allBoards,
  allMediaCards,
  allActionCards,
  userData,
  sections,
}) => {
  const classes = useStyles()
  const { dispatch: adminpanDispatch } = useContext(AdminPanContext)

  useEffect(() => {
    adminpanDispatch({
      type: 'SET_ADMIN_DATA',
      payload: {
        allBoards,
        allMediaCards,
        allActionCards,
        userData,
        sections,
      },
    })
  }, [])
  return (
    <div className={classes.root}>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.addBtn}
        onClick={onOpenSectionCreation}
      >
        <AddIcon />
      </Fab>
    </div>
  )
}

export default AddSection
