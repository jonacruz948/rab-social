import React, { createContext, useReducer } from 'react'

const initialAdminPanData = {
  selectedCards: {},
  selectedBoards: {},
  tagCollection: [],
  selectedUser: {},
  sections: [],
}

const AdminPanContext = createContext(initialAdminPanData)

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ADMIN_DATA':
      const {
        allBoards,
        allMediaCards,
        allActionCards,
        userData,
        sections,
      } = action.payload
      return {
        ...state,
        boards: allBoards,
        mediaCards: allMediaCards,
        actionCards: allActionCards,
        users: userData,
        sections,
        selectedCards: {},
        selectedBoards: {},
        tagCollection: [],
        selectedUser: {},
        sectionTitle: '',
      }
    case 'SET_CARDS_STATUS':
      const { selectedCards } = action.payload

      return {
        ...state,
        selectedCards,
      }
    case 'SET_BOARDS_STATUS':
      const { selectedBoards } = action.payload
      // console.log(selectedBoards)
      return {
        ...state,
        selectedBoards,
      }
    case 'SET_TAGS_STATUS':
      const { tagCollection } = action.payload
      return {
        ...state,
        tagCollection,
      }
    case 'SET_SELECTED_USERS':
      const { selectedUser } = action.payload
      return {
        ...state,
        selectedUser,
      }
    case 'ADD_NEW_SECTION':
      const { boards, cards, tags, sectionTitle, _id } = action.payload
      return {
        ...state,
        selectedCards: {},
        selectedBoards: {},
        tagCollection: [],
        selectedUser: {},
        sectionTitle: '',
        sections: [
          ...state.sections,
          { boards, cards, tags, sectionTitle, _id },
        ],
      }
    case 'UPDATE_SECTIONS':
      const { sections: uSections } = action.payload

      return {
        ...state,
        sections: [...uSections.sections],
      }
    case 'EDIT_SECTION_STATE':
      const {
        selectedBoards: selectedBoardForEdit,
        selectedCards: selectedCardsForEdit,
        selectedUser: selectedUserForEdit,
        tagCollection: tagCollectionForEdit,
        sectionTitle: sectionTitleForEdit,
        sectionID,
      } = action.payload
      return {
        ...state,
        selectedBoards: selectedBoardForEdit,
        selectedCards: selectedCardsForEdit,
        selectedUser: selectedUserForEdit,
        tagCollection: tagCollectionForEdit,
        sectionTitle: sectionTitleForEdit,
        sectionID,
      }
    default:
      return state
  }
}

const AdminPanContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialAdminPanData)
  let value = { state, dispatch }

  return (
    <AdminPanContext.Provider value={value}>
      {props.children}
    </AdminPanContext.Provider>
  )
}

const AdminPanContextConsumer = AdminPanContext.Consumer

export { AdminPanContextProvider, AdminPanContextConsumer }
export default AdminPanContext
