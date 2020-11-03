import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
  info: {
    position: 'absolute',
    color: '#fff',
    textAlign: 'left',
    bottom: 10,
    left: 10,
  },
  name: {
    color: '#fff',
    fontWeight: '1000',
    marginBottom: "20px"
  },
}))

const HomeCarousels = ({ carData }) => {
  const classes = useStyles()
  console.log(carData)
  return (
    <Carousel
      showThumbs={false}
      showArrows={false}
      showStatus={false}
      autoPlay={true}
      infiniteLoop={true}
    >
      {carData &&
        carData.map((item, index) => (
          <Grid
            container
            key={index}
            style={{ background: '#000', overflow: 'hidden' }}
          >
            <Grid item xs={12}>
              <div className={classes.info}>
                <Typography variant="h5" className={classes.name}>
                  {item.title}
                </Typography>
              </div>
              <img
                src={item.imagesToDisplay[0].url}
                alt="Media Action"
                style={{ objectFit: 'cover' }}
              />
            </Grid>
          </Grid>
        ))}
    </Carousel>
  )
}

export default HomeCarousels
