import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { Carousel } from 'react-responsive-carousel'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import Divider from '@material-ui/core/Divider'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import moment from 'moment'
import ReactPlayer from 'react-player/lazy'
import classnames from 'classnames'
import CardPreview from '../../GridDisplay/CardPreview'
import GridDisplay from '../../GridDisplay'
import { isVideo, isImage } from '../../../helpers/file'

const useStyles = makeStyles((theme) => ({
  root: {
    // paddingBottom: theme.spacing(15),
  },
  cardgird: {
    display: 'grid',
    gridGap: '10px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
    gridAutoRows: '200px',
  },
  cardgirditem: {
    background: '#000',
  },
  info: {
    position: 'absolute',
    color: '#fff',
    textAlign: 'left',
    bottom: 40,
    left: 10,
  },
  today: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
    fontWeight: '800',
  },
  from: {
    color: '#fff',
  },
  date: {
    color: '#fff',
  },
  name: {
    color: '#fff',
    fontFamily: 'Suisse Intl Bold',
  },
  media: {
    height: '160px',
    objectFit: 'cover',
  },
  boardMedia: {
    height: '250px',
  },
  card: {
    borderRadius: '20px',
    background: theme.palette.grey[500],
    position: 'relative',
  },
  actionArea: {
    background: '#000',
    minHeight: '160px',
  },
  covermedia: {
    padding: theme.spacing(2),
    position: 'relative',
    textAlign: 'center',
  },
  boardname: {
    position: 'absolute',
    color: '#fff',
    top: '20%',
    width: '80%',
  },
  reactPlayer: {
    objectFit: 'cover',
  },
  sectionTitle: {
    padding: 20,
    fontFamily: 'Suisse Intl Bold',
    fontSize: '18px',
  },
  viewall: {
    width: '100%',
    textAlign: 'center',
    paddingBottom: theme.spacing(2),
  },
  chips: {
    marginLeft: '5%',
    paddingBottom: '5%',
  },
  cardAvatar: {
    minWidth: '40px',
  },
  boardAvatarArea: {
    position: 'absolute',
    bottom: 0,
  },
  viewallBtn: {
    textTransform: 'none',
    fontFamily: 'Suisse Intl Bold',
  },
  slider: {
    height: '300px',
  },
  hash: {
    fontWeight: 'bold',
    display: 'inline-block',
    padding: '2px',
    fontSize: '14px',
  },
}))

const Homehead = ({ feeds, boards, sections }) => {
  const classes = useStyles()
  const [limit, setLimit] = useState(4)

  return (
    <div className={classes.root}>
      {sections.map((section, index) => {
        const { boards, cards } = section
        const filteredBoards = boards.map((el) => ({
          name: el.board.name,
          coverimage: el.board.coverimage,
          cards: [...el.board.cards.media, el.board.cards.action].length,
          avatar: el.avatar,
          owner: el.boardOwner,
          id: el.board._id,
          type: 'board',
        }))

        const filteredCards = cards.map((el) => ({
          name: el.card.title,
          coverimage: el.card.media || el.card.downloadFields[0].file.url,
          owner: el.bookmarker,
          avatar: el.bkAvatar,
          id: el.card.id,
          slug: el.card.slug,
          type: 'card',
        }))

        return (
          <div key={index}>
            <Typography variant="h6" className={classes.sectionTitle}>
              {section.sectionTitle}
            </Typography>
            <Carousel
              showThumbs={false}
              showArrows={false}
              showStatus={false}
              autoPlay={true}
              infiniteLoop={true}
            >
              {feeds &&
                feeds.map((item, index) => (
                  <a target="_blank" href={item.originId} key={index}>
                    <Grid
                      container
                      style={
                        item.visual
                          ? {
                              backgroundSize: 'cover',
                              backgroundColor: '#000',
                              overflow: 'hidden',
                              height: '300px',
                              backgroundImage: `url(${item.visual.url})`,
                            }
                          : {
                              backgroundColor: '#000',
                              overflow: 'hidden',
                              height: '300px',
                            }
                      }
                    >
                      <Grid
                        item
                        xs={12}
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                      >
                        <div className={classes.info}>
                          <Typography
                            variant="subtitle1"
                            className={classes.from}
                          >
                            {item.origin.title}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            className={classes.date}
                          >
                            {moment(item.published).format('ll')}
                          </Typography>
                          <Typography variant="h5" className={classes.name}>
                            {item.title}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </a>
                ))}
            </Carousel>
            <div>
              <GridDisplay
                items={[...filteredBoards, ...filteredCards]}
                limit={limit}
              />
            </div>
            <div className={classes.viewall}>
              <Button
                variant="outlined"
                className={classes.viewallBtn}
                onClick={() => {
                  limit === 4 ? setLimit(999999) : setLimit(4)
                }}
              >
                {limit === 4 ? `View All` : `View Less`}
              </Button>
            </div>
            <div className={classes.chips}>
              {section.tags.length > 0 &&
                section.tags.map((tag, index) => (
                  <div key={index} className={classes.hash}>
                    {tag}
                  </div>
                ))}
            </div>
            <Divider />
          </div>
        )
      })}
    </div>
  )
}

export default Homehead
