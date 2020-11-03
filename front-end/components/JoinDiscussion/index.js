import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Typeform from '../Explore/Typeform'

const useStyles = makeStyles((theme) => ({
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
  idea: {
    marginTop: theme.spacing(3),
  },
}))

const JoinDiscussion = ({ title, formID }) => {
  const classes = useStyles()
  const [isAuthorized, setAuthorized] = useState(false)
  const { users } = useSelector((state) => state)

  useEffect(() => {
    setAuthorized(users.isAuthorized)
  }, [users.isAuthorized])
  return (
    <div className={classes.joinDiscussion}>
      <Typeform title={title} formID={formID} />
      {isAuthorized && (
        <div className={classes.idea}>
          <Typography variant="body1">
            Have an Idea? &nbsp;
            <Link href={`/cards/suggest`}>
              <Button variant="outlined" className={classes.suggest}>
                {' '}
                Suggest a card
              </Button>
            </Link>
          </Typography>
        </div>
      )}
    </div>
  )
}

export default JoinDiscussion
