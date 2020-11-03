import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import Layout from '../../components/Layout'
import Navbar from '../../components/Navbar'
import ExploreHead from '../../components/Explore/Head'
import ExploreTrending from '../../components/Explore/Trending'
import ExploreFeaturedChallenge from '../../components/Explore/FeaturedChallenge'
import ExploreCardsFromBoard from '../../components/Explore/CardsFromBoard'
import ExploreTrendingActions from '../../components/Explore/TrendingActions'
import Typeform from '../../components/Explore/Typeform'
import * as exploreAPI from '../../api/explore'
import { TYPEFORM as t } from '../../constant'

const useStyles = makeStyles((theme) => ({
  head: {
    width: '90%',
    margin: 'auto',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  slick: {
    margin: 'auto',
    width: '90%',
  },
  btnArea: {
    paddingBottom: theme.spacing(20),
    paddingTop: theme.spacing(5),
    textAlign: 'center',
  },
}))

const Explore = ({ explore, trends, trendBoards }) => {
  const classes = useStyles()
  const router = useRouter()
  const { users } = useSelector((state) => state)
  const [cardsFromBoards, setCardsFromBoards] = useState((state) => state)
  const [cardsFromLocation, setCardsFromLocation] = useState((state) => state)

  useEffect(() => {
    if (users.isAuthorized) {
      const { token, userId: userID } = users
      const Authorization = `Bearer ${token}`

      exploreAPI
        .getExplorePageCardsByBoards({ Authorization, userID })
        .then((result) => {
          const { data } = result
          setCardsFromBoards(data)
        })

      exploreAPI
        .getExplorePageCardsByLocation({ Authorization, userID })
        .then((result) => {
          const { data } = result
          setCardsFromLocation(data)
        })
    }
  }, [users.isAuthorized])

  const { imagesToDisplay, title: mainTitle } = explore[0]

  const handleSearchByWords = (searchWords) => {
    router.push(`/explore/search?q=${searchWords}`)
  }

  return (
    <Layout>
      <div className={classes.head}>
        <ExploreHead onSearchByWords={handleSearchByWords} />
        <Typography variant="subtitle1">
          <strong>Trending this week</strong>
        </Typography>
        <ExploreTrending trendBoards={trendBoards} trendCards={trends} />
      </div>
      <Divider />
      <ExploreFeaturedChallenge
        imagesToDisplay={imagesToDisplay}
        mainTitle={mainTitle}
      />
      <div className={classes.slick}>
        <ExploreTrendingActions
          cardsFromLocation={cardsFromLocation}
          trends={trends}
          trendBoards={trendBoards}
        />
        {cardsFromBoards && (
          <ExploreCardsFromBoard cardsFromBoards={cardsFromBoards} />
        )}
      </div>
      <div className={classes.btnArea}>
        <Typeform
          title="Get Personalized Picks"
          formID={t.NEWS_FEEDS_AND_LEARNING_FORM_ID}
        />
      </div>
      <Navbar />
    </Layout>
  )
}

export const getServerSideProps = async () => {
  const { data } = await exploreAPI.getExplorePageCarousel()
  const { data: trendsData } = await exploreAPI.getExplorePageTrends()
  const { data: trendBoards } = await exploreAPI.getExploreTrendBoards()

  return {
    props: {
      explore: data,
      trends: trendsData,
      trendBoards,
    },
  }
}

export default Explore
