import React, { useEffect, useRef, useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

import SnackAlert from '../../SnackAlert'
import Tabpan from './Tabpan'
import AdminPanContext from '../../../context/AdminPanContext'
import * as adminAPI from '../../../api/admin'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
}))

const SectionCreation = ({ open, onClose, isEditMode }) => {
  const classes = useStyles()
  const descriptionElementRef = useRef(null)
  const [snackOpen, setSnakOpen] = useState(false)
  const [sectionTitle, setSectionTitle] = useState('')
  const [snackMessage, setSnackMessage] = useState('')
  const [titleValidError, setTitleValidError] = useState(false)
  const { state: adminPanState, dispatch: adminPanDispatch } = useContext(
    AdminPanContext
  )

  const {
    boards,
    mediaCards,
    actionCards,
    selectedUser,
    selectedBoards,
    selectedCards,
    tagCollection,
    sectionID,
    sectionTitle: sectionTitleFromContext,
  } = adminPanState

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  useEffect(() => {
    setSectionTitle(sectionTitleFromContext)
  }, [sectionTitleFromContext])

  const handleCreateOrUpdateSection = () => {
    if (sectionTitle.length < 15) {
      return setTitleValidError(true)
    }
    if (!adminPanState.tagCollection.length > 0) {
      setSnackMessage('Tags are empty!')
      setSnakOpen(true)
      return
    } else {
      const boardIDs = Object.keys(selectedBoards)
        .map((el) => selectedBoards[el].boardID)
        .filter((el) => el)

      const cardIDs = Object.keys(selectedCards)
        .map((cardID) =>
          selectedCards[cardID]
            ? { cardID: cardID, bookmarker: selectedCards[cardID] }
            : ''
        )
        .filter((el) => !!el)

      const selectedBoardData = boardIDs.map((boardID) => {
        const boardInfo = boards.find((el) => el.board._id === boardID)
        const { board, boardOwner, cards, avatar } = boardInfo
        return {
          avatar,
          board,
          boardOwner,
          cards,
        }
      })

      const selectedCardData = cardIDs.map((cardEl) => ({
        card: [...mediaCards, ...actionCards].find(
          (el) => el.card.id === cardEl.cardID
        ).card,
        bookmarker: cardEl.bookmarker,
        bkAvatar: selectedUser[cardEl.cardID]['avatar'],
        bkID: selectedUser[cardEl.cardID]['userID'],
      }))

      const payload = {
        boards: selectedBoardData,
        cards: selectedCardData,
        tags: tagCollection,
        sectionTitle,
      }

      if (isEditMode) {
        adminAPI.updateSection({ ...payload, sectionID }).then((result) => {
          const sections = result.data
          adminPanDispatch({
            type: 'UPDATE_SECTIONS',
            payload: { sections },
          })
        })
      } else {
        adminAPI.createNewSection(payload).then((result) => {
          const { data } = result

          const {
            section: { _id },
          } = data
          adminPanDispatch({
            type: 'ADD_NEW_SECTION',
            payload: {
              ...payload,
              _id,
            },
          })
        })
      }

      setSectionTitle('')
      setTitleValidError(false)
      onClose()
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        scroll={'paper'}
        maxWidth="md"
        className={classes.root}
      >
        <DialogTitle>
          <TextField
            label="Section Title (at least 15 characters)"
            fullWidth
            error={titleValidError}
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
          />
        </DialogTitle>
        <DialogContent dividers>
          <Tabpan />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateOrUpdateSection} color="primary">
            {isEditMode ? 'Update Section' : 'Creat Section'}
          </Button>
        </DialogActions>
      </Dialog>
      <SnackAlert
        open={snackOpen}
        vertical="top"
        horizontal="right"
        onClose={() => setSnakOpen(false)}
        message={snackMessage}
      />
    </div>
  )
}

export default SectionCreation
