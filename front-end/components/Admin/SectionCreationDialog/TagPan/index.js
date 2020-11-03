import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'

import AdminPanContext from '../../../../context/AdminPanContext'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '700px',
    width: '40%',
  },
}))

const TagPan = () => {
  const classes = useStyles()
  const [tagValue, setTagValue] = useState('')
  const { state: adminPanState, dispatch: adminPanDispatch } = useContext(
    AdminPanContext
  )
  const { tagCollection } = adminPanState

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      adminPanDispatch({
        type: 'SET_TAGS_STATUS',
        payload: {
          tagCollection: [...tagCollection, tagValue],
        },
      })
      setTagValue('')
    }
  }

  const handleDelete = (tag) => {
    const index = tagCollection.findIndex((tagItem) => tagItem === tag)
    let uTagCollection = tagCollection
    uTagCollection.splice(index, 1)
    adminPanDispatch({
      type: 'SET_TAGS_STATUS',
      payload: {
        tagCollection: uTagCollection,
      },
    })
  }

  return (
    <div className={classes.root}>
      <TextField
        id="filled-basic"
        label="keywords"
        placeholder="#keyword"
        fullWidth
        variant="filled"
        value={tagValue}
        onChange={(e) => setTagValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div>
        {tagCollection.length > 0 &&
          tagCollection.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              clickable
              onDelete={() => handleDelete(tag)}
            />
          ))}
      </div>
    </div>
  )
}

export default TagPan
