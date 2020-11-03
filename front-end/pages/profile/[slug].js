import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import AppBar from '@material-ui/core/AppBar'
import SwipeableViews from 'react-swipeable-views'

import {
  Created,
  Saved,
  Dashboard,
  UserIntro,
  Settings,
} from '../../components/Profile'
import Layout from '../../components/Layout'
import Navbar from '../../components/Navbar'
import * as userAPI from '../../api/user'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}))

const Profile = ({ profile }) => {
  const router = useRouter()
  const { slug } = router.query
  const [settings, setSettings] = useState({})
  const [settingDlgOpen, setSettingDlgOpen] = useState(false)
  const [profileAvatar, setProfileAvatar] = useState('')
  const {
    users: { token, userId: userID },
  } = useSelector((state) => state)

  const Authorization = `Bearer ${token}`

  const {
    fullName,
    userName,
    level,
    points,
    avatar,
    city,
    state,
    bio,
    badgeData,
    badges,
    createdboards,
    bookmarkedboards,
  } = profile

  useEffect(() => {
    setSettings({
      fullName,
      userName,
      city,
      state,
      bio,
      level,
    })
  }, [profile])
  useEffect(() => {
    setProfileAvatar(avatar)
  }, [avatar])

  const handleUpdateProfile = ({
    profileBio,
    profileFullName,
    profileCity,
    profileState,
    profileUserName,
  }) => {
    const profileToUpdate = {
      ...profile,
      bookmarkedboards: bookmarkedboards.map((item) => item.boardID),
      createdboards: createdboards.map((item) => item.boardID),
      fullName: profileFullName,
      city: profileCity,
      state: profileState,
      bio: profileBio,
      userName: profileUserName,
    }

    userAPI
      .updateProfileInfo({ Authorization, profile: profileToUpdate, userID })
      .then((res) => {
        const { data } = res
        const { result, profile } = data
        const { fullName, userName, city, state, bio, level } = profile
        if (!result) {
          setSettingDlgOpen(false)
          setSettings({
            fullName,
            userName,
            city,
            state,
            bio,
            level,
          })
        }
      })
  }

  return (
    <Layout>
      <UserIntro
        {...settings}
        avatar={profileAvatar}
        points={points}
        slug={slug}
        onUpdateProfile={handleUpdateProfile}
        onSettingDlgOpen={() => setSettingDlgOpen(true)}
      />
      <UserProfileBoards
        createdboards={createdboards}
        bookmarkedboards={bookmarkedboards}
        points={points}
        badgeData={badgeData}
        badges={badges}
      />
      <Settings
        {...settings}
        avatar={profileAvatar}
        open={settingDlgOpen}
        onSetProfileAvatar={(newAvatar) => setProfileAvatar(newAvatar)}
        onUpdateProfile={handleUpdateProfile}
        onClose={() => setSettingDlgOpen(false)}
      />
      <Navbar />
    </Layout>
  )
}

export const UserProfileBoards = ({
  createdboards,
  bookmarkedboards,
  points,
  badgeData,
  badges,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  return (
    <Layout>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {['Created', 'Saved', 'Dashboard'].map((item) => (
              <Tab key={item} label={item} />
            ))}
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          {[
            { component: <Created boards={createdboards} /> },
            {
              component: <Saved boards={bookmarkedboards} />,
            },
            {
              component: (
                <Dashboard
                  points={points}
                  badgeData={badgeData}
                  badges={badges}
                />
              ),
            },
          ].map((item, index) => (
            <TabPanel
              key={index}
              value={value}
              index={index}
              dir={theme.direction}
            >
              {item.component}
            </TabPanel>
          ))}
        </SwipeableViews>
      </div>
    </Layout>
  )
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const { data } = await userAPI.getProfile(query.slug)

  return {
    props: { profile: data },
  }
}

export default Profile
