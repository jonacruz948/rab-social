import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Slider from 'react-slick'
import Link from 'next/link'
import CardActionArea from '@material-ui/core/CardActionArea'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import ReactPlayer from 'react-player/lazy'

import { isImage, isVideo } from '../../../helpers/file'

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
  subtitle: {
    marginTop: theme.spacing(2),
  },
  carousel: {
    textAlign: 'center',
  },
  slickcard: {
    objectFit: 'cover',
    height: '140px',
    borderRadius: '20px',
    boxShadow: 'none',
    background: theme.palette.grey[500],
  },
  slickmedia: {
    height: '100%',
  },
  actionArea: {
    height: '100%',
  },
  slickRoot: {
    width: '90% !important',
  },
}))

const CardsFromBoard = ({ cardsFromBoards }) => {
  const classes = useStyles()

  return (
    <>
      {cardsFromBoards.map((el, index) => (
        <div key={index}>
          <Typography variant="subtitle1" className={classes.subtitle}>
            <strong>Because you follow {el.name}</strong>
          </Typography>
          <Slider
            {...settings}
            slidesToShow={el.filteredCards.length > 1 ? 2 : 1}
            autoplaySpeed={3000 * Math.random()}
            className={classes.carousel}
          >
            {el.filteredCards.map((item, index) => (
              <Link href={`/cards/${item.slug}`} key={index}>
                <div className={classes.slickRoot}>
                  <Card className={classes.slickcard}>
                    <CardActionArea className={classes.actionArea}>
                      {isImage(item.media) && (
                        <CardMedia
                          className={classes.slickmedia}
                          image={item.media}
                        />
                      )}
                      {isVideo(item.media) && (
                        <ReactPlayer
                          url={item.media}
                          loop={true}
                          width="100%"
                          height="100%"
                        />
                      )}
                    </CardActionArea>
                  </Card>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      ))}
    </>
  )
}

export default CardsFromBoard
