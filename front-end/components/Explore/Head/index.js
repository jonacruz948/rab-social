import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdorment from '@material-ui/core/InputAdornment'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme) => ({
  margin: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))

const ExploreHead = ({ onSearchByWords, showClose }) => {
  const classes = useStyles()
  const [searchWords, setSearchWords] = useState('')
  const router = useRouter()

  const handleSearchbarKeydown = (e) => {
    if (e.key === 'Enter') {
      onSearchByWords(searchWords)
    }
  }

  return (
    <>
      <List>
        <ListItem>
          <ListItemText>
            <Typography variant="h6">
              <strong>Explore</strong>
            </Typography>
          </ListItemText>
          {showClose && (
            <ListItemSecondaryAction>
              <IconButton onClick={() => router.push('/explore')}>
                <CloseIcon />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </List>
      <FormControl fullWidth className={classes.margin} variant="outlined">
        <OutlinedInput
          placeholder="Start typing..."
          startAdornment={
            <InputAdorment position="start">
              <SearchIcon />
            </InputAdorment>
          }
          value={searchWords}
          onChange={(e) => setSearchWords(e.target.value)}
          onKeyDown={handleSearchbarKeydown}
        />
      </FormControl>
    </>
  )
}

export default ExploreHead
