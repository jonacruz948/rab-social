import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import SwipeableViews from 'react-swipeable-views'

import { wrapper } from '../store'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'
import Typeform from '../components/Explore/Typeform'
import { Homehead, BoardsFollowing, HomeCarousels } from '../components/Home'
import * as boardAPI from '../api/boards'
import * as feedlyAPI from '../api/feedly'
import * as adminAPI from '../api/admin'
import * as cardAPI from '../api/cards'
import auth0 from '../helpers/auth0'
import { TYPEFORM as t } from '../constant'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflow: "none"
  },
  tab: {
    textTransform: 'none',
    fontSize: '14px',
  },
  mainTitle: {
    background: '#000',
    color: '#fff',
    padding: '10px 10px 10px 20px',
    fontSize: '20px',
    fontFamily: 'Druk Wide Bold',
  },
  introText: {
    marginLeft: '5%',
    paddingTop: '20%',
    textAlign: 'left',
    fontWeight: '800',
  },
  btnArea: {
    paddingBottom: theme.spacing(20),
    paddingTop: theme.spacing(5),
    textAlign: 'center',
  },
  todayOn: {
    fontFamily: 'Suisse Intl Semi-Bold',
  },
  tabItem: {
    fontFamily: 'Suisse Intl Bold',
  },
}))

const Home = ({ feeds, boards, sections }) => {
  const { users } = useSelector((state) => state)
  const router = useRouter()
  const theme = useTheme()
  const classes = useStyles()
  const [value, setValue] = useState(0)
  const [bookmarkBoardData, setBookmarkBoardData] = useState([])
  const [cardData, setCardData] = useState([])
  const [homeCarousel, setHomeCarousel] = useState([])
  const dispatch = useDispatch()
  const [isAuthorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (window.location.hash) {
      auth0.parseHash({ hash: window.location.hash }, (err, authResult) => {
        if (err) return console.log(err)
        auth0.client.userInfo(authResult.accessToken, (err, authResult) => {
          const {
            email,
            family_name,
            given_name,
            name,
            nickname,
            picture,
          } = authResult

          const payload = {
            email,
            fullName: `${given_name} ${family_name}`,
            userName: `${nickname}`.replace(' ', '_').toLowerCase(),
            avatar: picture,
          }

          dispatch({
            type: 'SOCIAL_LOGIN_WATCHER',
            payload,
          })
        })
      })
    }
  }, [])

  useEffect(() => {
    if (users.isAuthorized) {
      const { token, userId: userID } = users
      const Authorization = `Bearer ${token}`
      setAuthorized(true)

      boardAPI.getBookmarkBoard({ Authorization, userID }).then((res) => {
        const { data } = res

        if (res.data) {
          setBookmarkBoardData(data.boards)
          setCardData(data.cardData)
        }
      })
    } else {
      cardAPI.getHomeCarousel().then((result) => {
        const { data } = result
        setHomeCarousel(data)
      })
    }
  }, [users.isAuthorized])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  return (
    <Layout>
      {isAuthorized ? (
        <div className={classes.root}>
          <Typography variant="body1" className={classes.mainTitle}>
            <span className={classes.todayOn}>Today on</span>&nbsp;rabble
          </Typography>

            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              variant="fullWidth"
            >
              {['For You', 'Following'].map((item) => (
                <Tab
                  key={item}
                  label={<span className={classes.tabItem}>{item}</span>}
                  className={classes.tab}
                />
              ))}
            </Tabs>

          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
            style={{overflow: 'none'}}
            slideStyle={{ overflow: 'visible'}}
          >
            {[
              {
                component: (
                  <Homehead feeds={feeds} boards={boards} sections={sections} />
                ),
              },
              {
                component: (
                  <BoardsFollowing
                    bookmarkBoardData={bookmarkBoardData}
                    cardData={cardData}
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
          <div className={classes.btnArea}>
            <Typeform
              title="Get Personalized Picks"
              formID={t.NEWS_FEEDS_AND_LEARNING_FORM_ID}
            />
          </div>
        </div>
      ) : (
        <div className={classes.root}>
          <Typography variant="body1" className={classes.mainTitle}>
            Today on rabble
          </Typography>
          <HomeCarousels carData={homeCarousel} />
          <Homehead feeds={feeds} boards={boards} sections={sections} />
        </div>
      )}
      <Navbar />
    </Layout>
  )
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export const getServerSideProps = async () => {
  const { data } = await feedlyAPI.getFeeds()
  const {
    data: { sections },
  } = await adminAPI.getAllSections()

  return {
    props: {
      feeds: data.items,
      boards: data.tempBoard,
      sections,
    },
  }
}

export default Home
