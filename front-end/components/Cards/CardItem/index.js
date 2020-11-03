import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import axios from 'axios'
import ReactPlayer from 'react-player'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardActionArea from '@material-ui/core/CardActionArea'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Fade from '@material-ui/core/Fade'
import { red } from '@material-ui/core/colors'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import InsertLinkOutlinkedIcon from '@material-ui/icons/InsertLinkOutlined'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { Loading } from '../../elements'
import { getShortenURL } from '../../../api/cards'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    position: 'relative',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  shareicon: {
    position: 'absolute',
    top: 0,
    right: 0,
    background: '#c4183c',
    color: '#ffffff',
    '&:hover': {
      background: '#c4183c',
    },
  },
  visibilityicon: {
    position: 'absolute',
    top: 0,
    background: '#007bff',
    color: '#ffffff',
    '&:hover': {
      background: '#007bff',
    },
  },
  linkicon: {
    position: 'absolute',
    bottom: 0,
    background: '#17c671',
    color: '#ffffff',
    '&:hover': {
      background: '#17c671',
    },
  },
  container: {
    display: 'flex',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2,
    },
  },
}))

const CardItem = (props) => {
  const { card, plus, onAction, canRemove = false, onRemove } = props
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const [mediaType, setMediaType] = useState('image')

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const onViewClicked = (e) => {
    e.preventDefault()
    if (plus) Router.push(`/cards/new`)
    else Router.push(`/cards/${card.id}`)
  }

  const onShareClicked = (e) => {
    e.preventDefault()
    getShortenURL(`${process.env.mypath}/cards/${card.id}`)
      .then((res) => res.json())
      .then((parsed) => {
        var dummy = document.createElement('textarea')
        document.body.appendChild(dummy)
        dummy.value = parsed.shortUrl
        dummy.select()
        dummy.setSelectionRange(0, 999999)
        document.execCommand('copy')
        document.body.removeChild(dummy)
        onAction &&
          onAction(
            'Share Card',
            'You can share this card via Social Media, Email, Text!',
            true,
            card
          )
      })
  }

  const onDownloadClicked = (e) => {
    e.preventDefault()

    const extention = resourceUrl.substring(resourceUrl.lastIndexOf('.'))
    axios({
      url: resourceUrl,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `rabble${extention}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      onAction &&
        onAction(
          'Download Success',
          `You have downloaded a media from card "${card.title}", file name should be rabble${extention}`
        )
    })
  }

  const onCopyLinkClicked = async (e) => {
    e.preventDefault()
    getShortenURL(`${process.env.mypath}/cards/${card.id}`)
      .then((res) => res.json())
      .then((parsed) => {
        console.log(parsed.shortUrl)
        var dummy = document.createElement('textarea')
        document.body.appendChild(dummy)
        dummy.value = parsed.shortUrl
        dummy.select()
        dummy.setSelectionRange(0, 999999)
        document.execCommand('copy')
        document.body.removeChild(dummy)
        onAction &&
          onAction(
            'Copied Link',
            'The link to this card has been copied to your clipboard!'
          )
      })
  }

  const resourceUrl = card.media || card.downloadFields[0].file.url

  useEffect(() => {
    function getFileExtension(filename) {
      const parts = filename.split('.')
      return parts[parts.length - 1]
    }

    function isImage(filename) {
      const ext = getFileExtension(filename).toLowerCase()
      if (
        ext === 'jpg' ||
        ext === 'jpeg' ||
        ext === 'gif' ||
        ext === 'bmp' ||
        ext === 'png' ||
        ext === 'webp'
      )
        return true
      return false
    }

    function isVideo(filename) {
      const ext = getFileExtension(filename).toLowerCase()
      if (ext === 'mp4' || ext === 'avi' || ext === 'mpg' || ext === 'm4v')
        return true
      return false
    }

    if (isImage(resourceUrl)) setMediaType('image')
    if (isVideo(resourceUrl)) setMediaType('video')
  }, [resourceUrl])

  return (
    <Grid item xs={12} sm={12}>
      <Link href="/cards/[slug]" as={`/cards/${card.id}`}>
        <Card className={classes.root}>
          {mediaType === 'image' && (
            <CardMedia
              className={classes.media}
              image={resourceUrl}
              title="Paella dish"
            />
          )}
          {mediaType === 'video' && (
            <ReactPlayer
              url={resourceUrl}
              width="100%"
              height="100%"
              loop={true}
              style={{ maxHeight: '190px' }}
            />
          )}
        </Card>
      </Link>
    </Grid>
    // <div className="col-lg-4 col-md-6 col-sm-12 mb-4 board-item-wrapper">
    //   {!plus && (
    //     <Link href="/cards/[slug]" as={`/cards/${card.id}`}>
    //       <div className="board-item-actions row ml-0">
    //         {!canRemove && (
    //           <div className="row m-0 col-md-12">
    //             <button
    //               type="button"
    //               className="btn btn-pill btn-primary"
    //               onClick={onViewClicked}
    //             >
    //               <i className="fa fa-eye"></i>
    //             </button>
    //             <button
    //               type="button"
    //               className="btn btn-pill btn-danger"
    //               onClick={onShareClicked}
    //             >
    //               <i className="fa fa-share-alt"></i>
    //             </button>
    //           </div>
    //         )}
    //         {!canRemove && (
    //           <div className="row m-0 col-md-12">
    //             {card.type === 'media' && (
    //               <button
    //                 type="button"
    //                 className="btn btn-pill btn-primary"
    //                 onClick={onDownloadClicked}
    //               >
    //                 <i className="fa fa-download"></i>
    //               </button>
    //             )}
    //             <button
    //               type="button"
    //               className="btn btn-pill btn-success"
    //               onClick={onCopyLinkClicked}
    //             >
    //               <i className="fa fa-paperclip"></i>
    //             </button>
    //           </div>
    //         )}
    //         {canRemove && (
    //           <div className="row m-0 col-md-12 d-flex align-items-center justify-content-between">
    //             <button
    //               type="button"
    //               className="btn btn-pill btn-success"
    //               onClick={onViewClicked}
    //               style={{ position: 'absolute', left: '4rem' }}
    //             >
    //               <i className="fa fa-lg fa-eye"></i>
    //             </button>
    //             <button
    //               type="button"
    //               className="btn btn-pill btn-danger"
    //               onClick={(e) => {
    //                 e.preventDefault()
    //                 onRemove(card.id)
    //               }}
    //               style={{ position: 'absolute', right: '4rem' }}
    //             >
    //               <i className="fa fa-lg fa-trash"></i>
    //             </button>
    //           </div>
    //         )}
    //       </div>
    //     </Link>
    //   )}
    //   {card || plus ? (
    //     <Link href="#">
    //       {!plus ? (
    //         <div className="card">
    //           <img
    //             className="card-img-top"
    //             src={resourceUrl}
    //             alt="Card image cap"
    //           />
    //           <video
    //             autoPlay
    //             muted
    //             loop
    //             id="myVideo"
    //             className="card-img-top"
    //             style={{
    //               position: 'absolute',
    //               width: '100%',
    //               height: '100%',
    //               top: '0',
    //               left: '0',
    //               objectFit: 'fill',
    //             }}
    //           >
    //             <source src={resourceUrl} type="video/mp4" />
    //           </video>
    //           <div className="card-body card-img-overlay">
    //             <h4 className="card-title">{card.title}</h4>
    //           </div>
    //         </div>
    //       ) : (
    //         <div className="card btn btn-light board-card-plus">
    //           <i className="fa fa-lg fa-plus"></i>
    //         </div>
    //       )}
    //     </Link>
    //   ) : (
    //     <Loading></Loading>
    //   )}
    // </div>
  )
}

export default CardItem
