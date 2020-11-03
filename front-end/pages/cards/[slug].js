import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Snackbar from '@material-ui/core/Snackbar'

import Layout from '../../components/Layout'
import CardComment from '../../components/Cards/CardComment'
import CardHead from '../../components/Cards/CardHead'
import CardTags from '../../components/Cards/CardTags'
import CardTitle from '../../components/Cards/CardTitle'
import CardActionsPart from '../../components/Cards/CardActionsPart'
import CardActionData from '../../components/Cards/CardActionData'
import AddCardToBoard from '../../components/AddCardToBoard'
import CardEditDialog from '../../components/EditOptions'
import { getCard } from '../../api/cards'
import { isImage, isVideo } from '../../helpers/file'
import * as userAPI from '../../api/user'

const DEFAULT_COVER_IMAGE =
  'https://rabble-dev.s3.amazonaws.com/assets/reactangle.png'

const useStyles = makeStyles((theme) => ({
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
  takeaction: {
    background: '#00a8b4',
    color: '#ffffff',
    textTransform: 'none',
    fontSize: '14px',
  },
  comment: {
    border: 'none',
  },
  previous: {
    position: 'absolute',
    top: '10px',
    left: '20px',
    background: 'none',
    boxShadow: 'none',
    '&:focus': {
      background: 'none',
      boxShadow: 'none',
    },
  },
}))

const CardView = ({ card, bookmark }) => {
  const router = useRouter()
  const classes = useStyles()
  const [isCardBoardOpen, setCardBoardOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [cardsToAdd, setCardsToAdd] = useState([])
  const [isDidAction, setDidaction] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [editDlgOpen, setEditDlgOpen] = useState(false)
  const [isBookmarked, setBookmarked] = useState(false)
  const [completed, setCompleted] = useState(0)

  const { users } = useSelector((state) => state)

  const { slug } = router.query
  const mediaUrl =
    card.type === 'media'
      ? card.downloadFields[0].file.url
      : card.media || DEFAULT_COVER_IMAGE

  useEffect(() => {
    if (isImage(mediaUrl)) setMediaType('image')
    if (isVideo(mediaUrl)) setMediaType('video')
  }, [mediaUrl])

  useEffect(() => {
    if (users.isAuthorized && bookmark) {
      setBookmarkCount(bookmark.bkUsers.length)
      setBookmarked(bookmark.bkUsers.includes(users.userId))
      setCompleted(bookmark.completed)
    }
  }, [bookmark])

  useEffect(() => {
    if (users.isAuthorized) {
      const { token, userId: userID } = users

      userAPI.getProfile(userID).then((res) => {
        const { actions: userActions } = res.data
        setDidaction(userActions.includes(card.id))
      })
    }
  }, [])

  const handleSavedToBoard = (message) => {
    setSnackMessage(message)
    setSnackOpen(true)
  }

  const handleBookmark = (bookmarkCount) => {
    setBookmarked(true)
    setBookmarkCount(bookmarkCount)
  }

  const handleCardsToAdd = (cardsToAdd) => {
    setCardsToAdd(cardsToAdd)
    setCardBoardOpen(true)
  }

  return (
    <Layout>
      <div>
        <CardHead
          mediaType={mediaType}
          url={mediaUrl}
          card={card}
          isBookmarked={isBookmarked}
          onSetBookmark={(isBookmark) => setBookmarked(isBookmark)}
          onCardBoardOpen={(cardsToAdd) => handleCardsToAdd(cardsToAdd)}
          onEditDlgOpen={() => setEditDlgOpen(true)}
          onSetCompletedCount={(comp) => setCompleted(comp)}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" style={{ fontWeight: 'bold' }}>
            {card.title}
          </Typography>
          <CardTitle
            cardType={card.type}
            organiationName={card.nonProfitsngOs}
            description={card.description}
            badge={card.badge}
            completed={completed}
            isDidAction={isDidAction}
            bookmarkCount={bookmarkCount}
          />
        </CardContent>
        {(card.dateOfEvent || card.location) && (
          <>
            <Divider />
            <CardActionData
              dateOfEvent={card.dateOfEvent}
              location={card.location}
            />
          </>
        )}
        <Divider />
        <CardActionsPart
          card={card}
          isDidAction={isDidAction}
          onSetDidAction={() => setDidaction(true)}
          onUpdateCompleteCount={(completeCount) => setCompleted(completeCount)}
        />
        <Divider />
        <CardComment slug={slug} />
        <CardTags card={card} />
        <AddCardToBoard
          open={isCardBoardOpen}
          cardsToAdd={cardsToAdd}
          isBookmarked={isBookmarked}
          cardType={card.type}
          onBookmarked={(bookmarkCount) => handleBookmark(bookmarkCount)}
          onHandleClose={() => setCardBoardOpen(false)}
          onHandleSavedToBoard={(message) => handleSavedToBoard(message)}
        />
        <SnackNotification
          snackOpen={snackOpen}
          onHandleSnackClose={() => setSnackOpen(false)}
          snackMessage={snackMessage}
        />
        <CardEditDialog
          open={editDlgOpen}
          boardID={slug}
          isEditBtnEnabled={false}
          onClose={() => setEditDlgOpen(false)}
        />
      </div>
    </Layout>
  )
}

const snackstyle = {
  color: '#ffffff',
  fontSize: '20px',
  textAlign: 'center',
}

const SnackNotification = ({ snackOpen, onHandleSnackClose, snackMessage }) => (
  <Snackbar
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    open={snackOpen}
    onClose={onHandleSnackClose}
    message={<span style={snackstyle}>{snackMessage}</span>}
    autoHideDuration={3000}
  />
)

export const getServerSideProps = async ({ query }) => {
  const res = await getCard(query.slug)
  const { card, bookmark } = await res.json()

  return {
    props: { card, bookmark },
  }
}

export default CardView
