import React from 'react'
import Link from 'next/link'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import GridDisplay from '../../GridDisplay'

const longStyle = {
  height: '270px',
}

const smallStyle = {
  height: '200px',
}

const useStyles = makeStyles((theme) => ({
  actionArea: {
    height: '100%',
  },
  trendingMedia: {
    height: '100%',
    opacity: '0.4',
  },
  trendingBoards: {
    marginTop: theme.spacing(2),
    background: '#000',
    borderRadius: '20px',
    boxShadow: 'none',
    width: '100%',
    position: 'relative',
  },
  boardAvatar: {
    position: 'absolute',
    bottom: 0,
  },
  boardTitle: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    textAlign: 'center',
  },
  desc: {
    color: '#fff',
    fontSize: '20px',
    fontFamily: 'Suisse-Intl-Regular',
  },
}))

const Trending = ({ trendBoards, trendCards }) => {
  const classes = useStyles()

  console.log(trendCards)

  const trends = [
    ...trendBoards.slice(0, 2).map((el) => ({
      type: 'board',
      url: el.coverimage,
      avatar: el.avatar,
      owner: el.fullName,
      coverimage: el.coverimage,
      name: el.fullName,
      title: el.name,
      id: el.id,
      cardCount: [...el.cards.media, el.cards.action].length,
    })),
    ...trendCards.slice(0, 2).map((el) => ({
      type: 'card',
      slug: el.slug,
      url: el.media,
      coverimage: el.media,
      owner: el.fullName,
      avatar: el.avatar,
      name: el.fullName,
      title: el.title,
    })),
  ]

  return (
      <GridDisplay items={trends}></GridDisplay> 
  )
}

export default Trending
