import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import Button from '@material-ui/core/Button'
import FormGroup from '@material-ui/core/FormGroup'

import * as userAPI from '../../../api/user'

const useStyles = makeStyles((theme) => ({
  takeaction: {
    background: '#00a8b4',
    color: '#ffffff',
    textTransform: 'none',
    fontSize: '14px',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  getStarted: {
    width: '60%',
    borderRadius: '0px',
    textTransform: 'none',
    fontSize: '14px',
    background: '#000000',
    marginBottom: theme.spacing(2),
  },
  startbtn: {
    justifyContent: 'center',
  },
  didaction: {
    justifyContent: 'center',
  },
  actioncheckbox: {
    fontSize: '14px',
  },
  keypoints: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '14px',
    width: '80%',
    margin: 'auto',
    marginTop: '20px',
  },
}))

const CardActionsPart = ({
  card,
  isDidAction,
  onSetDidAction,
  onUpdateCompleteCount,
}) => {
  const [expanded, setExpanded] = useState(true)
  const [isAuthorized, setAuthorized] = useState(false)

  const { users } = useSelector((state) => state)
  const router = useRouter()
  const classes = useStyles()

  useEffect(() => {
    setAuthorized(users.isAuthorized)
  }, [users.isAuthorized])

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  const handleUserAction = () => {
    //1: uncheck the action
    //0: check the action
    const { token, userId: userID } = users
    const Authorization = `Bearer ${token}`
    const actionID = card.id

    const type = 0 // add the action 1: remove the action
    if (!isDidAction) {
      const { badge } = card
      const { actionKeyword } = badge

      userAPI
        .updateActionsOnProfile({ userID, actionID, actionKeyword, type })
        .then((result) => {
          const { data } = result
          const { completed } = data
          onUpdateCompleteCount(completed)
          onSetDidAction(true)
        })
    }
  }

  return (
    <>
      {card.type === 'media' ? (
        <>
          <CardActions disableSpacing>
            <Typography variant="h5">Take Action</Typography>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
            >
              <ExpandMoreIcon style={{ fontSize: '40' }} />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <CardActions>
                {card.raActions.map((item) => (
                  <Button
                    key={item.raActionId}
                    variant="contained"
                    className={classes.takeaction}
                    onClick={() => router.push(`/cards/${item.raSlug}`)}
                  >
                    {item.raCardTitle}
                  </Button>
                ))}
              </CardActions>
            </CardContent>
          </Collapse>
        </>
      ) : (
        <>
          <div
            className={classes.keypoints}
            dangerouslySetInnerHTML={{ __html: card.keyPointsDescription }}
          />
          <>
            <FormGroup row className={classes.startbtn}>
              <Button
                variant="contained"
                color="primary"
                className={classes.getStarted}
                onClick={() => router.push(`${card.action}`)}
                disabled={!card.action}
              >
                Get Started
              </Button>
            </FormGroup>
            {isAuthorized && (
              <FormGroup row className={classes.startbtn}>
                <Button
                  variant="contained"
                  onClick={handleUserAction}
                  color="primary"
                  className={classes.getStarted}
                >
                  {isDidAction ? `I did this again` : `I did this`}
                </Button>
              </FormGroup>
            )}
          </>
        </>
      )}
    </>
  )
}

export default CardActionsPart
