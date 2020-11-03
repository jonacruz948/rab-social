import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

import JoinDiscussion from '../../JoinDiscussion'
import { TYPEFORM as t } from '../../../constant'

const useStyles = makeStyles((theme) => ({
  tagroot: {
    justifyContent: 'center',
  },
  join: {
    background: '#000000',
    color: '#ffffff',
    fontSize: '15px',
    textTransform: 'none',
    borderRadius: '0px',
    '&:focus, &:hover': {
      background: '#000000',
    },
  },
  joinDiscussion: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '20px',
  },
  suggest: {
    textTransform: 'none',
    fontSize: '15px',
    border: 'none',
    textDecoration: 'underline',
    cursor: 'point',
    padding: 0,
    '&:focus, &:hover': {
      textDecoration: 'underline',
      border: 'none',
    },
  },
  tags: {
    margin: '0 0 5% 12%',
  },
  idea: {
    marginTop: theme.spacing(3),
  },
}))

const CardTags = ({ card }) => {
  const classes = useStyles()
  const formID = t.CARD_DISCUSSION_FORM_ID

  return (
    <div>
      <Typography variant="subtitle1" className={classes.tags}>
        {card.tags?.map((tag, index) => (
          <div key={index} class="hash" clickable >#{tag}</div>
        ))}
      </Typography>
      <JoinDiscussion title="Join the Discussion" formID={formID} />
    </div>
  )
}

export default CardTags
