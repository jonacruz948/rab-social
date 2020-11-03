import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ToggleButton from '@material-ui/lab/ToggleButton'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItemText'
import Icon from '@material-ui/core/Icon'

import AppsSharpIcon from '@material-ui/icons/AppsSharp'
import StopRoundedIcon from '@material-ui/icons/StopRounded'

const useStyles = makeStyles((theme) => ({
  controls: {
    display: 'flex',
    marginTop: '20px',
  },
  maincontrols: {
    width: '60%',
    position: 'relative',
  },
  appsharp: {
    padding: 0,
    marginLeft: theme.spacing(2),
  },
  view: {
    padding: 0,
  },
  selectbtn: {
    border: '1px #000000 solid',
    borderRadius: '20px',
    paddingTop: 0,
    paddingBottom: 0,
    color: '#000',
    '&: focus, $: hover': {
      background: '#000',
      color: '#fff',
    },
  },
  filtercontrols: {
    width: '30%',
    textAlign: 'end',
  },
}))

const Controlbar = ({
  onSetViewMethod,
  onToggleSelect,
  onSetDlgOpen,
  onSetFileterDlgOpen,
  handleCardsToAdd,
  selected,
  boardCreator,
  cardsToDelOrAdd,
}) => {
  const classes = useStyles()

  return (
    <Box className={classes.controls}>
      <Box className={classes.maincontrols}>
        <List>
          <ListItem>
            <IconButton
              onClick={() => onSetViewMethod(false)}
              className={classes.appsharp}
            >
              <AppsSharpIcon style={{ fontSize: '30px' }} />
            </IconButton>
            <IconButton
              className={classes.view}
              onClick={() => onSetViewMethod(true)}
            >
              <StopRoundedIcon style={{ fontSize: '30px' }} />
            </IconButton>
            <ToggleButton
              selected={selected}
              value="check"
              onChange={onToggleSelect}
              className={classes.selectbtn}
            >
              Select
            </ToggleButton>
            {selected ? (
              boardCreator ? (
                <IconButton
                  onClick={onSetDlgOpen}
                  className={classes.view}
                  disabled={cardsToDelOrAdd.length > 0 ? false : true}
                >
                  <DeleteOutlineOutlinedIcon style={{ fontSize: '30px' }} />
                </IconButton>
              ) : (
                <IconButton className={classes.view} onClick={handleCardsToAdd}>
                  <AddCircleOutlineIcon style={{ fontSize: '30px' }} />
                </IconButton>
              )
            ) : (
              <></>
            )}
          </ListItem>
        </List>
      </Box>
      <Box className={classes.filtercontrols}>
        <Icon onClick={onSetFileterDlgOpen}>
          <img src="/images/filter.svg" />
        </Icon>
      </Box>
    </Box>
  )
}

export default Controlbar
