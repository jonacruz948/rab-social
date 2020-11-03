import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { AdminPanContextProvider } from '../../context/AdminPanContext'
import AdminNavbar from '../../components/Admin/Navbar'
import AdminAddSection from '../../components/Admin/AddSection'
import AdminSectionCreationDialog from '../../components/Admin/SectionCreationDialog'
import AdminSections from '../../components/Admin/Sections'
import SnackAlert from '../../components/SnackAlert'
import * as adminAPI from '../../api/admin'

const useStyles = makeStyles((theme) => ({
  submitArea: {
    textAlign: 'end',
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}))

const Admin = ({
  allBoards,
  allMediaCards,
  allActionCards,
  userData,
  sections,
}) => {
  const classes = useStyles()
  const [tags, setTags] = useState([])
  const [isAlertOpen, setAlertOpen] = useState(false)
  const [isSectionCreationOpen, setSectionCreationOpen] = useState(false)
  const [isEditMode, setEditMode] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) router.push('/admin/login')
  })
  const handleSubmit = () => {
    let tagsToArray = tags.replace(' ', '').split('#').slice(1)

    adminAPI
      .adminRegisterTags({ email: 'editor@admin.com', tags: tagsToArray })
      .then((resp) => {
        const { data } = resp
        setAlertOpen(true)
        console.log(data)
      })
  }

  const handleOpenEditDialog = () => {
    setEditMode(true)
    setSectionCreationOpen(true)
  }

  const handleCloseSectionCreationDialog = () => {
    setEditMode(false)
    setSectionCreationOpen(false)
  }

  return (
    <AdminPanContextProvider>
      <div className={classes.root}>
        <AdminNavbar />
        <AdminSections onOpenEditDialog={handleOpenEditDialog} />
        <AdminSectionCreationDialog
          open={isSectionCreationOpen}
          isEditMode={isEditMode}
          onClose={handleCloseSectionCreationDialog}
        />
        <SnackAlert
          open={isAlertOpen}
          vertical="top"
          horizontal="center"
          onClose={() => setAlertOpen(false)}
          message="Tags saved successfully"
        />
        <AdminAddSection
          onOpenSectionCreation={() => setSectionCreationOpen(true)}
          allBoards={allBoards}
          allMediaCards={allMediaCards}
          allActionCards={allActionCards}
          userData={userData}
          sections={sections}
        />
      </div>
    </AdminPanContextProvider>
  )
}

export const getServerSideProps = async () => {
  const {
    data: { boardData: allBoards },
  } = await adminAPI.getAllBoards()
  const {
    data: { cardData: allMediaCards, userData: mediaUsers },
  } = await adminAPI.getAllMediaCards()
  const {
    data: { cardData: allActionCards, userData: actionUsers },
  } = await adminAPI.getAllActionCards()

  const {
    data: { sections },
  } = await adminAPI.getAllSections()

  const userIDs = [
    ...new Set([
      ...mediaUsers.map((el) => el.userID),
      ...actionUsers.map((el) => el.userID),
    ]),
  ]

  const userData = userIDs.map((userID) =>
    [...mediaUsers, ...actionUsers].find((el) => el.userID === userID)
  )

  return {
    props: {
      allBoards,
      allMediaCards,
      allActionCards,
      userData,
      sections,
    },
  }
}

export default Admin
