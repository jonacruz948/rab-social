import React from 'react'
import Slider from 'react-slick'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

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
  card: {
    objectFit: 'cover',
    height: '300px',
    borderRadius: '20px',
    boxShadow: 'none',
    background: '#000',
    width: '90% !important',
    position: 'relative',
  },
  featuredSubtitle: {
    marginLeft: '5%',
  },
  root: {
    position: 'relative',
    margin: 'auto',
    marginBottom: theme.spacing(5),
  },
  carousel: {
    textAlign: 'center',
  },
  media: {
    paddingTop: '56.25%',
    height: '100%',
    opacity: '0.4',
  },
  viewActionCard: {
    width: '100%',
    position: 'absolute',
    bottom: theme.spacing(2),
  },
  viewButton: {
    background: '#000',
    color: '#fff',
    textTransform: 'none',
    borderRadius: '0px',
  },
  mainTitle: {
    lineHeight: '100%',
    height: '80%',
    color: '#fff',
    position: 'absolute',
    bottom: '0px',
  },
}))
const FeaturedChallenge = ({ imagesToDisplay, mainTitle }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.featuredSubtitle}>
        Featured Challenges
      </Typography>
      <Slider
        {...settings}
        slidesToShow={1}
        autoplaySpeed={3000}
        className={classes.carousel}
      >
        {imagesToDisplay.map((image, index) => (
          <Card className={classes.card} key={index}>
            <CardMedia className={classes.media} image={image.url} />

            <Typography variant="h4" className={classes.mainTitle}>
              {mainTitle}
            </Typography>

            <div className={classes.viewActionCard}>
              <Button variant="outlined" className={classes.viewButton}>
                View Action Card
              </Button>
            </div>
          </Card>
        ))}
      </Slider>
    </div>
  )
}

export default FeaturedChallenge
