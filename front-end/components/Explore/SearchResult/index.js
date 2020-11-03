import React, { useState } from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import classnames from 'classnames'
import ReactPlayer from 'react-player'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import GridDisplay from '../../GridDisplay'
import { isVideo, isImage } from '../../../helpers/file'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    margin: 'auto',
    marginBottom: theme.spacing(15),
  },
  coverImage: {
    // paddingTop: '56.25%',
    width: '100%',
    height: '100%',
    borderRadius: '18px',
    opacity: 0.4,
  },
  boardMedia: {
    opacity: 0.4,
  },
  boardName: {
    position: 'absolute',
    top: '20%',
    textAlign: 'center',
    width: '100%',
  },
  boardDetail: {
    color: '#fff',
    width: '90%',
    margin: 'auto',
  },
  boardTitle: {
    fontSize: '20px',
    lineHeight: 'initial',
  },
  card: {
    width: '100%',
    height: '160px',
    borderRadius: '18px',
    background: '#333333',
    position: 'relative',
  },
  board: {
    height: '230px',
  },
  actionarea: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: '16px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  viewMoreArea: {
    width: '100%',
    textAlign: 'center',
  },
  viewMore: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  boardOwner: {
    position: 'absolute',
    bottom: 0,
  },
  suggest: {
    width: '100%',
    textAlign: 'center',
    paddingTop: theme.spacing(2),
  },
  suggestBtn: {
    borderRadius: 0,
    background: '#000',
    color: '#fff',
    textTransform: 'none',
    fontSize: '14px',
    '&:focus, &:hover': {
      background: '#000',
      color: '#fff',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))

const SearchResult = ({ filterCards, filterBoards, word }) => {
  const classes = useStyles()
  const [viewMore, setViewMore] = useState({ cardLimit: 4, boardLimit: 4 })
  const [viewLess, setViewLess] = useState({
    cardViewLess: false,
    boardViewLess: false,
  })
  const [showCardType, setShowCardType] = useState('media')

  const cards = filterCards
    .map((el) => {
      if (showCardType === 'media') {
        if (el.type === 'media') {
          return (
            el.type === 'media' && {
              coverimage:
                el.type === 'media' ? el.downloadFields[0].file.url : el.media,
              title: el.title,
              id: el.id,
              slug: el.slug,
              type: 'card',
              cardType: el.type,
            }
          )
        }
      } else {
        return (
          el.type !== 'media' && {
            coverimage:
              el.type === 'media' ? el.downloadFields[0].file.url : el.media,
            title: el.title,
            id: el.id,
            slug: el.slug,
            type: 'card',
            cardType: el.type,
          }
        )
      }
    })
    .filter((el) => el)

  const boards = filterBoards.map((el) => ({
    coverimage: el.coverimage,
    cards: [...el.cards.media, ...el.cards.action].length,
    title: el.name,
    id: el._id,
    fullName: el.fullName,
    owner: el.fullName,
    type: 'board',
    avatar: el.avatar,
  }))

  const iteration = [
    {
      type: 'card',
      subtitle: 'Results for cards with',
      emptyTitle: 'Results for all cards',
      chunk: cards,
    },
    {
      type: 'board',
      subtitle: 'Results for boards with',
      emptyTitle: 'Results for all boards',
      chunk: boards,
    },
  ]

  const handleViewMoreClick = (type) => {
    if (type === 'card') {
      const { cardLimit } = viewMore
      if (cardLimit < cards.length) {
        setViewMore({
          ...viewMore,
          cardLimit: cardLimit + 4,
        })
      }
      if (cardLimit + 4 > cards.length)
        setViewLess({ ...viewLess, cardViewLess: true })
    } else {
      const { boardLimit } = viewMore
      if (boardLimit < boards.length) {
        setViewMore({
          ...viewMore,
          boardLimit: boardLimit + 4,
        })
      }
      if (boardLimit + 4 > boards.length)
        setViewLess({ ...viewLess, boardViewLess: true })
    }
  }

  const handleViewLessClick = (type) => {
    if (type === 'card') {
      setViewMore({ ...viewMore, cardLimit: 4 })
      setViewLess({ ...viewLess, cardViewLess: false })
    } else {
      setViewMore({ ...viewMore, boardLimit: 4 })
      setViewLess({ ...viewLess, boardViewLess: false })
    }
  }

  const handleShowCardTypeChange = (event) => {
    setShowCardType(event.target.value)
  }

  return (
    <div className={classes.root}>
      {iteration.map((el, index) => {
        const limitedChunk =
          el.type === 'card'
            ? el.chunk.slice(0, viewMore.cardLimit)
            : el.chunk.slice(0, viewMore.boardLimit)

        return (
          <div key={index}>
            {el.chunk.length > 0 ? (
              word ? (
                <>
                  <Typography variant="body1" className={classes.subtitle}>
                    <strong>
                      {el.subtitle} "{word}"
                    </strong>
                  </Typography>
                  {el.type === 'card' && (
                    <FormControl className={classes.formControl}>
                      <InputLabel>Card Type</InputLabel>
                      <Select
                        value={showCardType}
                        onChange={handleShowCardTypeChange}
                      >
                        <MenuItem value={'media'}>media</MenuItem>
                        <MenuItem value={'action'}>action</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </>
              ) : (
                <Typography variant="body1" className={classes.subtitle}>
                  <strong>{el.emptyTitle}</strong>
                </Typography>
              )
            ) : (
              <Typography variant="body1" className={classes.subtitle}>
                <strong>No results found</strong>
              </Typography>
            )}
            <GridDisplay items={limitedChunk} hideAuthor={el.type === 'card'} />
            {el.type === 'card' && !limitedChunk.length && (
              <Link href={`/cards/suggest`}>
                <div className={classes.suggest}>
                  <Button variant="outlined" className={classes.suggestBtn}>
                    Suggest a card
                  </Button>
                </div>
              </Link>
            )}
            {el.type === 'board' && !limitedChunk.length && (
              <Link href={`/board/new`}>
                <div className={classes.suggest}>
                  <Button variant="outlined" className={classes.suggestBtn}>
                    Create a board
                  </Button>
                </div>
              </Link>
            )}
            {limitedChunk.length > 0 && (
              <div className={classes.viewMoreArea}>
                {(!viewLess.cardViewLess || !viewLess.boardViewLess) && (
                  <Button
                    variant="outlined"
                    className={classes.viewMore}
                    onClick={() => handleViewMoreClick(el.type)}
                  >
                    View More
                  </Button>
                )}
                {(viewLess.cardViewLess || viewLess.boardViewLess) && (
                  <Button
                    variant="outlined"
                    className={classes.viewMore}
                    onClick={() => handleViewLessClick(el.type)}
                  >
                    View Less
                  </Button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SearchResult
