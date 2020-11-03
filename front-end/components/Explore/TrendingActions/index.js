import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import ReactPlayer from 'react-player/lazy'
import Slider from 'react-slick'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'

import { isVideo, isImage } from '../../../helpers/file'

const mockCard = [
  { media: 'https://rabble-dev.s3.amazonaws.com/assets/card.png' },
  { media: 'https://rabble-dev.s3.amazonaws.com/assets/card.png' },
  { media: 'https://rabble-dev.s3.amazonaws.com/assets/card.png' },
  { media: 'https://rabble-dev.s3.amazonaws.com/assets/card.png' },
]
const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
}

const useStyles = makeStyles((theme) => ({
  root: {
    // marginBottom: theme.spacing(15),
  },
  subtitle: {
    marginTop: theme.spacing(2),
  },
  carousel: {
    textAlign: 'center',
  },
  slickRoot: {
    width: '90% !important',
    background: theme.palette.grey[500],
    borderRadius: '20px',
  },
  slickcard: {
    position: 'relative',
    objectFit: 'cover',
    height: '140px',
    borderRadius: '20px',
    boxShadow: 'none',
    background: theme.palette.grey[500],
  },
  slickBoard: {
    position: 'relative',
    objectFit: 'cover',
    height: '230px',
    borderRadius: '20px',
    boxShadow: 'none',
    // opacity: '0.4',
    background: theme.palette.grey[500],
  },
  boardTitle: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    textAlign: 'center',
  },
  slickmedia: {
    height: '100%',
  },
  actionArea: {
    height: '100%',
  },
  desc: {
    color: '#fff',
    fontSize: '20px',
  },
  boardAvatar: {
    position: 'absolute',
    bottom: 0,
  },
}))

const TrendingActions = ({ cardsFromLocation, trends, trendBoards }) => {
  const classes = useStyles()
  const [isAuthorized, setAuthorized] = useState(false)
  const { users } = useSelector((state) => state)
  let trendBoardData = trendBoards

  trendBoardData = trendBoardData.map((el) => ({
    type: 'board',
    media: el.coverimage,
    avatar: el.avatar,
    name: el.fullName,
    title: el.name,
    id: el.id,
    cardCount: [...el.cards.media, el.cards.action].length,
  }))

  useEffect(() => {
    if (users.isAuthorized) setAuthorized(true)
  }, [users.isAuthorized])

  return (
    <div className={classes.root}>
      {[
        {
          topic: 'Happening in your city',
          cards: isAuthorized ? cardsFromLocation || mockCard : [],
          autoplaySpeed: 1500,
        },
        { topic: 'Trending Actions', cards: trends, autoplaySpeed: 2000 },
        {
          topic: 'Trending Boards',
          cards: trendBoardData,
          autoplaySpeed: 2500,
        },
      ].map(
        (item, index) =>
          item.cards.length > 0 && (
            <div key={index}>
              <Typography variant="subtitle1" className={classes.subtitle}>
                <strong>{item.topic}</strong>
              </Typography>
              <Slider
                {...settings}
                slidesToShow={item.cards.length > 1 ? 2 : 1}
                autoplaySpeed={item.autoplaySpeed}
                className={classes.carousel}
              >
                {item.cards.map((el, index) => (
                  <Link
                    href={
                      el.type === 'board'
                        ? `/board/${el.id}`
                        : `/cards/${el.slug}`
                    }
                    key={index}
                  >
                    <a>
                      <div className={classes.slickRoot}>
                        <Card
                          className={
                            el.type === 'board'
                              ? classes.slickBoard
                              : classes.slickcard
                          }
                        >
                          <CardActionArea className={classes.actionArea}>
                            {isImage(el.media) && (
                              <CardMedia
                                className={classes.slickmedia}
                                image={el.media}
                              />
                            )}
                            {isVideo(el.media) && (
                              <ReactPlayer
                                url={el.media}
                                loop={true}
                                width="100%"
                                height="100%"
                              />
                            )}
                            {el.type === 'board' && (
                              <div className={classes.boardTitle}>
                                <Typography
                                  variant="body2"
                                  className={classes.desc}
                                >
                                  <strong>{el.title}</strong>
                                </Typography>
                                {el.cardCount && (
                                  <Typography
                                    variant="body1"
                                    className={classes.desc}
                                  >
                                    {el.cardCount} Cards
                                  </Typography>
                                )}
                              </div>
                            )}
                            {el.avatar && (
                              <List className={classes.boardAvatar}>
                                <ListItem>
                                  <ListItemAvatar>
                                    <Avatar src={el.avatar} />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <span style={{ color: '#fff' }}>
                                        {el.name}
                                      </span>
                                    }
                                  />
                                </ListItem>
                              </List>
                            )}
                          </CardActionArea>
                        </Card>
                      </div>
                    </a>
                  </Link>
                ))}
              </Slider>
            </div>
          )
      )}
    </div>
  )
}

export default TrendingActions
