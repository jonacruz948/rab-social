import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import moment from 'moment'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import { cyan, orange, blue } from '@material-ui/core/colors'

import Layout from '../../components/Layout'
import Navbar from '../../components/Navbar'
import * as actionAPI from '../../api/action'

const ITEM_COLORS = [cyan[800], orange[800], blue[800]]

const useStyles = makeStyles((theme) => ({
  card: {
    objectFit: 'cover',
    height: '400px',
    borderRadius: '20px',
    boxShadow: 'none',
    background: '#000',
  },
  root: {
    position: 'relative',
    width: '90%',
    margin: 'auto',
    marginBottom: theme.spacing(5),
  },
  media: {
    paddingTop: '56.25%',
    height: '100%',
    opacity: '0.4',
  },
  head: {
    marginLeft: '5%',
    paddingTop: theme.spacing(2),
  },
  upcoming: {
    width: '90%',
    margin: 'auto',
    marginTop: '5%',
    marginBottom: theme.spacing(15),
  },
  listItem: {
    marginTop: theme.spacing(1),
    borderRadius: '10px',
    display: 'grid',
  },
  actionName: {
    color: '#fff',
  },
  username: {
    fontFamily: 'Suisse Intl Semi-Bold',
  },
  curoted: {
    position: 'absolute',
    bottom: theme.spacing(1),
    left: theme.spacing(2),
  },
  order: {
    color: '#b8063e',
    paddingRight: theme.spacing(2),
    fontSize: '20px',
    fontWeight: '400',
    fontFamily: 'Suisse Intl Semi-Bold',
  },
  point: {
    color: '#0c559b',
    fontSize: '20px',
    fontWeight: '400',
  },
  placeInvite: {
    textAlign: 'center',
    paddingTop: theme.spacing(5),
  },
  eventDate: {
    color: '#fff',
  },
}))

const Actions = ({ action }) => {
  const classes = useStyles()
  const { users } = useSelector((state) => state)
  const [actionList, setActionList] = useState([])
  const [userByPoints, setUserByPoints] = useState([])
  const [isAuthorized, setAuthorized] = useState(false)

  useEffect(() => {
    actionAPI.getUserByPoints().then((result) => {
      const {
        data: { profiles },
      } = result
      setUserByPoints(profiles)
    })
  }, [])

  useEffect(() => {
    if (users.isAuthorized) {
      setAuthorized(true)
      const { token, userId: userID } = users
      const Authorization = `Bearer ${token}`
      actionAPI.getActionList({ Authorization, userID }).then((result) => {
        const { data } = result
        if (!data.result) {
          setActionList(data.actionList)
        } else {
        }
      })
    }
  }, [users.isAuthorized])

  return (
    <Layout>
      <div className={classes.head}>
        <Typography variant="h6">
          <strong>Action</strong>
        </Typography>
        <Typography variant="h6">Leaderboard</Typography>
        <Typography variant="subtitle1">
          Copy here will take about the leaderboard. See how other Rabble users
          did this weeke. Lorem ipsum
        </Typography>
        <List>
          {userByPoints.map((el, index) => (
            <Link href={`/profile/${el.userID}`}>
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography variant="body1" className={classes.order}>
                    {index === 0 && '1st'}
                    {index === 1 && '2nd'}
                    {index === 2 && '3rd'}
                    {index === 3 && '4th'}
                    {index === 4 && '5th'}
                  </Typography>
                </ListItemIcon>
                <ListItemAvatar>
                  <Avatar src={el.avatar} alt="avatar" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <span className={classes.username}>{el.userName}</span>
                  }
                />
                <ListItemSecondaryAction>
                  <Typography variant="body1" className={classes.point}>
                    {el.points}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
      <Divider />
      {isAuthorized ? (
        <div className={classes.upcoming}>
          <Typography variant="h6">Upcoming Actions</Typography>
          <List>
            {actionList ? (
              actionList.map((item, index) => {
                const { dateOfEvent } = item
                const eventDateTime = new Date(dateOfEvent).getTime()
                const nowTime = Date.now()

                return (
                  <>
                    {dateOfEvent ? (
                      <>
                        {eventDateTime > nowTime ? (
                          <Link key={index} href={`/cards/${item.slug}`}>
                            <ListItem
                              button
                              className={classes.listItem}
                              style={{ background: ITEM_COLORS[index % 3] }}
                            >
                              <Typography
                                variant="subtitle1"
                                className={classes.actionName}
                              >
                                <strong>{item.title}</strong>
                              </Typography>
                              <Typography
                                color="inherit"
                                className={classes.eventDate}
                              >
                                {moment(eventDateTime).format('llll')}
                              </Typography>
                            </ListItem>
                          </Link>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        <Link key={index} href={`/cards/${item.slug}`}>
                          <ListItem
                            button
                            className={classes.listItem}
                            style={{ background: ITEM_COLORS[index % 3] }}
                          >
                            <Typography
                              variant="subtitle1"
                              className={classes.actionName}
                            >
                              <strong>{item.title}</strong>
                            </Typography>
                            <Typography
                              color="inherit"
                              className={classes.eventDate}
                            >
                              Anytime
                            </Typography>
                          </ListItem>
                        </Link>
                      </>
                    )}
                  </>
                )
              })
            ) : (
              <Typography variant="subtitle1">
                No Upcoming Action list
              </Typography>
            )}
          </List>
        </div>
      ) : (
        <Typography variant="body1" className={classes.placeInvite}>
          To do something about the news,&nbsp;
          <Link href="/auth/register">
            <a>sign-up</a>
          </Link>
          &nbsp;or&nbsp;
          <Link href="/auth/login">
            <a>login</a>
          </Link>
        </Typography>
      )}

      <Navbar />
    </Layout>
  )
}

export const getServerSideProps = async () => {
  const { data } = await actionAPI.getActionPageCarousel()

  return {
    props: {
      action: data,
    },
  }
}

export default Actions
