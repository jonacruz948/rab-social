import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'next/link'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import CardHeader from '@material-ui/core/CardHeader'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import EditIcon from '@material-ui/icons/Edit'

import AdminPanContext from '../../../context/AdminPanContext'
import * as adminAPI from '../../../api/admin'

const SECTION_IMAGE =
  'https://rabble-dev.s3.amazonaws.com/assets/reactangle.png'

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    height: '500px',
    // width: '400px',
    borderRadius: '0',
  },
  cardMedia: {
    height: '100%',
  },
  actionArea: {
    height: '100%',
  },
  sectionTitle: {
    width: '80%',
    overflow: 'hidden',
  },
}))

const Section = ({ onOpenEditDialog }) => {
  const classes = useStyles()
  const { state: adminPanState, dispatch: adminPanDispatch } = useContext(
    AdminPanContext
  )

  const { sections } = adminPanState

  const handleDeleteSection = (sectionID) => {
    adminAPI.removeSection({ sectionID }).then((result) => {
      const sections = result.data
      adminPanDispatch({
        type: 'UPDATE_SECTIONS',
        payload: { sections },
      })
    })
  }

  const handleEditSection = (sectionID) => {
    const section = sections.find((el) => el._id === sectionID)

    const selectedBoards = {}
    const selectedCards = {}
    const selectedUser = {}

    section.boards.forEach((elBoard) => {
      selectedBoards[elBoard.board._id] = {
        boardID: elBoard.board._id,
        boardOwner: elBoard.boardOwner,
      }
    })

    section.cards.forEach((elCard) => {
      selectedCards[elCard.card.id] = elCard.bookmarker
      selectedUser[elCard.card.id] = {
        userID: elCard.bkID,
        avatar: elCard.avatar,
      }
    })

    adminPanDispatch({
      type: 'EDIT_SECTION_STATE',
      payload: {
        selectedCards,
        selectedUser,
        selectedBoards,
        tagCollection: section.tags,
        sectionID: section._id,
        sectionTitle: section.sectionTitle,
      },
    })

    onOpenEditDialog()
  }

  return (
    <Box m={3}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          {sections.map((section, index) => (
            <Grid
              item
              md={4}
              lg={3}
              xl={3}
              key={index}
              className={classes.grid}
            >
              <Card className={classes.cardRoot}>
                <CardHeader
                  action={
                    <>
                      <IconButton
                        onClick={() => handleEditSection(section._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteSection(section._id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  }
                  title={
                    <span className={classes.sectionTitle}>
                      {section.sectionTitle}
                    </span>
                  }
                />
                <Link href={`/admin/sections/${section._id}`}>
                  <CardActionArea className={classes.actionArea}>
                    <CardMedia
                      image={SECTION_IMAGE}
                      className={classes.cardMedia}
                    />
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Section
