import React from 'react'
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid'
import CardActionArea from '@material-ui/core/CardActionArea'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import ReactPlayer from 'react-player'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined'
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined'
import { makeStyles } from '@material-ui/core/styles'
import GridDisplay from '../../../GridDisplay'

import { isVideo, isImage } from '../../../../helpers/file'

const DEFAULT_COVER_IMAGE =
  'https://rabble-dev.s3.amazonaws.com/assets/reactangle.png'

const commonstyle = {
  width: '160px',
  height: '160px',
  borderRadius: '18px',
}
const commonlargeStyle = {
  width: '300px',
  height: '300px',
  borderRadius: '30px',
}

const useStyles = makeStyles((theme) => ({
  largeCardboard: {
    width: '300px',
    height: '300px',
    borderRadius: '30px',
    background: '#000',
    position: 'relative',
  },
  cardboard: {
    width: '137px',
    height: '128px',
    borderRadius: '25px',
    position: 'relative',
    textAlign: 'center',
    boxShadow: 'none',
    background: '#000',
  },
  actionarea: {
    width: '100%',
    height: '100%',
    textTransform: 'none',
  },
  largeMedia: {
    ...commonlargeStyle,
    paddingTop: '56.25%',
    opacity: 0.4,
  },
  media: {
    ...commonstyle,
    opacity: 0.4,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: '#111111',
    width: '100%',
    height: '100%',
    opacity: '0.5',
    textAlign: 'center',
    borderRadius: '30px',
  },
  cardcontent: {
    color: '#ffffff',
    position: 'absolute',
    top: '20px',
    color: '#ffffff',
  },
  checkbox: {
    position: 'absolute',
    top: '0px',
    right: '0px',
  },
  reactplayer: {
    opacity: 0.4,
  },
}))

const CardPlacement = ({
  cards,
  viewMethod,
  onCheckboxToDelOrAdd,
  selected,
  toggleValue,
  sortMethod,
}) => {
  const classes = useStyles()
  const router = useRouter()

  let sortedCards =
    sortMethod === 'recent'
      ? cards
      : cards.sort((fir, sec) => {
          const firTitle = fir.title.toUpperCase()
          const secTitle = sec.title.toUpperCase()

          if (firTitle < secTitle) return -1
          if (firTitle > secTitle) return 1
          return 0
        })

  for (let i = 0; i < sortedCards.length; i++) {
    if (
      sortedCards[i].downloadJpgFiles &&
      sortedCards[i].downloadJpgFiles.length > 0
    ) {
      sortedCards[i].coverimage = sortedCards[i].downloadJpgFiles[0].file.url
    }
    if (sortedCards[i].media) {
      sortedCards[i].coverimage = sortedCards[i].media
    }
  }
  // console.log(sortedCards)

  return <GridDisplay items={sortedCards} limit={40000} hideAuthor={true} />
}

export default CardPlacement
