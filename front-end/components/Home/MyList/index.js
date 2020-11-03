import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'

import * as userAPI from '../../../api/user'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(3),
  },
  mylist: {
    width: '100%',
    marginLeft: theme.spacing(3),
  },
  list: {
    width: '100%',
    textAlign: 'center',
    paddingBottom: theme.spacing(3),
  },
  listitem: {
    background: '#ff0f0f',
    marginTop: theme.spacing(1),
    width: '90%',
    margin: 'auto',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: '700',
    '&:focus, &:hover': {
      color: '#fff',
      background: '#ff0f0f',
    },
  },
  btn: {
    marginTop: theme.spacing(1),
  },
}))

const MyList = () => {
  const classes = useStyles()
  const { users } = useSelector((state) => state)
  const [userActions, setUserActions] = useState([])

  useEffect(() => {
    if (users.isAuthorized) {
      const { token, userId: userID } = users
      const Authorization = `Bearer ${token}`

      userAPI.getActionsData({ Authorization, userID }).then((res) => {
        const { actionData } = res.data
        setUserActions(actionData)
      })
    }
  }, [users.isAuthorized])

  return (
    <div className={classes.root}>
      <Grid container>
        <div className={classes.mylist}>
          <Typography variant="subtitle1">
            <strong>My List</strong>
          </Typography>
        </div>
        <div className={classes.list}>
          <List>
            {userActions &&
              userActions.map((action, index) => (
                <ListItem button className={classes.listitem} key={index}>
                  {action.title}
                </ListItem>
              ))}
          </List>
          <Link href="/actions">
            <Button variant="outlined" className={classes.btn}>
              Go to Action List
            </Button>
          </Link>
        </div>
      </Grid>
      <Divider />
    </div>
  )
}

export default MyList
