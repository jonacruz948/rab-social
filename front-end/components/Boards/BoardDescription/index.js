import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

import BoardDataContext from '../../../context/BoardDataContext'

const useStyles = makeStyles((theme) => ({
  desc: {
    width: '90%',
    margin: 'auto',
  },
  hashTags: {
    marginTop: '20px',
    marginBottom: theme.spacing(2),
  },
}))

const BoardDescription = () => {
  const classes = useStyles()
  const {
    state: { desc, tags },
  } = useContext(BoardDataContext)

  return (
    <div className={classes.desc}>
      <Typography variant="body1">{desc}</Typography>
      <div className={classes.hashTags}>

        {tags > 0 &&
          tags.map((tag, index) => (
            <div className="hash">#{tag}</div>  

          ))}
      </div>
    </div>
  )
}

export default BoardDescription
