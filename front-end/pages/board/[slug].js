import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

import { BoardDataContextProvider } from '../../context/BoardDataContext'
import Layout from '../../components/Layout'
import BoardHead from '../../components/Boards/BoardHead'
import BoardAvatar from '../../components/Boards/BoardAvatar'
import BoardSpecific from '../../components/Boards/BoardSpecific'
import BoardMoreIdeas from '../../components/Boards/BoardMoreIdeas'
import BoardDescription from '../../components/Boards/BoardDescription'
import BoardMain from '../../components/Boards/BoardMain'
import BoardEditDialog from '../../components/EditOptions'
import JoinDiscussion from '../../components/JoinDiscussion'
import * as boardAPI from '../../api/boards'
import { TYPEFORM as t } from '../../constant'

const BoardView = ({ boardData }) => {
  const router = useRouter()
  const [toggleValue, setToggleValue] = useState('media')
  const [editDlgOpen, setEditDlgOpen] = useState(false)
  const [isEditBtnEnabled, setEditBtnEnabled] = useState(true)
  const [downloadCount, setDownloadCount] = useState(0)
  const { users } = useSelector((state) => state)
  const [cardsOfBoards, setCardsOfBoards] = useState([])
  const { userId: userID, token, isAuthorized } = users
  const Authorization = `Bearer ${token}`

  const { slug } = router.query
  const { board, cards, avatar, boardOwner } = boardData
  const {
    tags,
    name,
    bio,
    downloads,
    bookmark,
    coverimage,
    userID: boardCreatedUserID,
  } = board

  useEffect(() => {
    setCardsOfBoards(cards)
  }, [cards])
  if (!board.tags) board.tags = []

  useEffect(() => {
    setDownloadCount(downloads)
  }, [downloads])

  const handleDeleteCardsFromBoard = (cardsToDelete) => {
    const payload = {
      userID,
      cards: cardsToDelete,
      boardID: slug,
    }

    boardAPI
      .deleteCardsFromBoard({ Authorization, ...payload })
      .then((result) => {
        const cardIDsToDelete = cardsToDelete.map((el) => el.cardID)
        const uCards = cards.filter(
          (elCard) => !cardIDsToDelete.includes(elCard.id)
        )
        setCardsOfBoards(uCards)
      })
  }

  const handleEditDlgOpen = (isEnabled) => {
    if (isAuthorized) {
      setEditBtnEnabled(isEnabled)
      setEditDlgOpen(true)
    } else {
      router.push({
        pathname: '/auth/login',
        query: { redirectTo: `${window.location.pathname}` },
      })
    }
  }

  return (
    <BoardDataContextProvider>
      <Layout>
        <BoardHead
          steps={2}
          onEditDlgOpen={(isEnabled) => handleEditDlgOpen(isEnabled)}
          boardCreator={userID === boardCreatedUserID}
          boardCreatedUserID={boardCreatedUserID}
        />
        <BoardAvatar
          avatar={avatar}
          boardOwner={boardOwner}
          boardCreatedUserID={boardCreatedUserID}
        />
        <BoardSpecific downloads={downloadCount} bookmark={bookmark} />
        <BoardDescription />
        <BoardMain
          onMediaClick={() => setToggleValue('media')}
          onActionClick={() => setToggleValue('action')}
          toggleValue={toggleValue}
          name={name}
          bio={bio}
          tags={tags}
          boardID={slug}
          boardCreator={userID === boardCreatedUserID}
          coverimage={coverimage}
          cardsOnBoard={cardsOfBoards}
          onDeleteCardsFromBoard={handleDeleteCardsFromBoard}
        />
        <BoardMoreIdeas boardID={slug} />
        <JoinDiscussion
          title="Join the Discussion"
          formID={t.NEWS_FEEDS_AND_LEARNING_FORM_ID}
        />
        <BoardEditDialog
          open={editDlgOpen}
          boardID={slug}
          boardTitle={name}
          tags={tags}
          bio={bio}
          isEditBtnEnabled={isEditBtnEnabled}
          onUpdateDownloadCount={(down) => setDownloadCount(down)}
          onClose={() => setEditDlgOpen(false)}
        />
      </Layout>
    </BoardDataContextProvider>
  )
}

export const getServerSideProps = async ({ query }) => {
  const { data } = await boardAPI.getBoard(query.slug)

  return {
    props: {
      boardData: data,
    },
  }
}

export default BoardView
