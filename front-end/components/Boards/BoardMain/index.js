import React, { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Controlbar from './Controlbar'
import CardPlacement from './CardPlacement'
import SnackAlert from '../../SnackAlert'
import AddCardToBoard from '../../AddCardToBoard'
import BoardEditFilterOptions from '../EditFilterOptions'
import DeleteCardsFromBoard from '../DeleteCards'
import BoardDataContext from '../../../context/BoardDataContext'

const commonstyle = {
  width: '137px',
  height: '128px',
  borderRadius: '18px',
}
const commonlargeStyle = {
  width: '300px',
  height: '300px',
  borderRadius: '30px',
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(2),
  },
  cardboard: {
    width: '137px',
    height: '128px',
    borderRadius: '25px',
    position: 'relative',
    textAlign: 'center',
    boxShadow: 'none',
    background: '#aaaaaa',
  },
  cards: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  actionarea: {
    width: '100%',
    height: '100%',
    textTransform: 'none',
  },
  title: {
    color: '#ffffff',
    fontSize: '14px',
    marginTop: '20%',
    position: 'absolute',
  },
  toggle: {
    textAlign: 'center',
  },
  toggleGroup: {
    background: '#979797',
    borderRadius: '25px',
    border: 'none',
    padding: '10px',
  },
  toggleButton: {
    border: 'none',
    borderRadius: '15px',
    '&:focus, &:active': {
      background: '#ffffff',
      color: '#b8063e',
    },
  },
  rect: {
    width: '20px',
    height: '20px',
    background: '#000000',
    '&:focus': {
      width: '20px',
      height: '20px',
      background: '#000000',
    },
  },

  media: {
    ...commonstyle,
    paddingTop: '56.25%',
  },
  largeMedia: {
    ...commonlargeStyle,
    paddingTop: '56.25%',
  },
  largeCardboard: {
    width: '300px',
    height: '300px',
    borderRadius: '30px',
    background: '#aaaaaa',
    position: 'relative',
  },
  checkbox: {
    position: 'absolute',
    top: '0px',
    right: '0px',
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
  tab: {
    textTransform: 'none',
    fontSize: '14px',
    color: '#000',
  },
}))

const BoardMain = ({
  toggleValue,
  name,
  bio,
  tags,
  boardID,
  boardCreator,
  cardsOnBoard,
  coverimage,
  onDeleteCardsFromBoard,
}) => {
  const classes = useStyles()
  const [selectedCard, setSelectedCard] = useState('media')
  const [viewMethod, setViewMethod] = useState(false)
  const [filterDlgOpen, setFilterDlgOpen] = useState(false)
  const [deleteDlgOpen, setDeleteDlgOpen] = useState(false)
  const [selected, setSelected] = useState(false)
  const [isCardBoardOpen, setCardBoardOpen] = useState(false)
  const [cardsToDelOrAdd, setcardsToDelOrAdd] = useState([])
  const [cardsToAdd, setCardsToAdd] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [sortMethod, setSortMethod] = useState('atoz')
  const { state: boardDataState, dispatch: boardDataDispatch } = useContext(
    BoardDataContext
  )
  const [message, setSnackMessage] = useState('')
  const [isSnackOpen, setSnackOpen] = useState(false)

  useEffect(() => {
    boardDataDispatch({
      type: 'SET_BOARD_DATA',
      payload: { name, bio, tags, coverimage, boardID },
    })
  }, [])

  const handleSelect = (e, select) => {
    setSelectedCard(select)
  }

  const handleFilterOptions = (filterOption) => {
    setFilterDlgOpen(false)
  }

  const handleDeleteCardsFromBoards = () => {
    setcardsToDelOrAdd([])
    setDeleteDlgOpen(false)
    setSelected(false)
    onDeleteCardsFromBoard(cardsToDelOrAdd)
  }

  const handleCheckedboxToDelOrAdd = (e, cardID, toggleValue) => {
    if (e.target.checked) {
      setcardsToDelOrAdd([
        ...cardsToDelOrAdd,
        { cardID, cardType: toggleValue },
      ])
    } else {
      let cardsNotToDelete = cardsToDelOrAdd
      cardsNotToDelete.splice(
        cardsNotToDelete.findIndex((item) => item.cardID === cardID),
        1
      )
      setcardsToDelOrAdd(cardsNotToDelete)
    }
  }

  const handleCardsToAdd = () => {
    let action = []
    let media = []
    cardsToDelOrAdd.forEach((el) =>
      el.cardType === 'media' ? media.push(el.cardID) : action.push(el.cardID)
    )

    setCardsToAdd({ action, media })
    setCardBoardOpen(true)
  }

  const handleSavedToBoard = (message) => {
    setSnackMessage(message)
    setSnackOpen(true)
    // setSavedToBoard(true)
  }

  const handleSortCards = (method) => {
    setSortMethod(method)
  }

  let mediaCards = []
  let actionCards = []

  cardsOnBoard.forEach((item) => {
    if (item.type === 'media') {
      mediaCards.push(item)
    } else {
      actionCards.push(item)
    }
  })

  const handleToggleSelect = () => {
    setcardsToDelOrAdd([])
    setSelected(!selected)
  }

  const controlBarSettings = {
    onSetViewMethod: (value) => setViewMethod(value),
    onToggleSelect: handleToggleSelect,
    selected: selected,
    boardCreator: boardCreator,
    onSetDlgOpen: () => setDeleteDlgOpen(true),
    onSetFileterDlgOpen: () => setFilterDlgOpen(true),
    cardsToDelOrAdd: cardsToDelOrAdd,
    handleCardsToAdd: handleCardsToAdd,
  }

  const cardPlacement = {
    viewMethod: viewMethod,
    onCheckboxToDelOrAdd: (e, ID, toggleValue) =>
      handleCheckedboxToDelOrAdd(e, ID, toggleValue),
    selected: selected,
    toggleValue: toggleValue,
    sortMethod,
  }

  const AntTabs = withStyles({
    root: {
      borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
      backgroundColor: '#1890ff',
    },
  })(Tabs);
  
  const AntTab = withStyles((theme) => ({
    root: {
      textTransform: 'none',
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: '#40a9ff',
        opacity: 1,
      },
      '&$selected': {
        color: '#1890ff',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#40a9ff',
      },
    },
    selected: {},
  }))((props) => <Tab disableRipple {...props} />);

  return (
    <div className={classes.root}>
      <div className={classes.toggle}>

          <AntTabs 
            value={tabValue}
            onChange={(e, newTabValue) => setTabValue(newTabValue)}
            variant="fullWidth"
          >
            {['View All', 'Media Cards', 'Action Cards'].map((el, index) => (
              <AntTab  label={el} key={index} className={classes.tab} />
            ))}
          </AntTabs>

      </div>
      {[
        {
          controlBarSettings,
          cardPlacement: {
            cards: [...mediaCards, ...actionCards],
            ...cardPlacement,
          },
        },
        {
          controlBarSettings,
          cardPlacement: {
            cards: mediaCards,
            ...cardPlacement,
          },
        },
        {
          controlBarSettings,
          cardPlacement: {
            cards: actionCards,
            ...cardPlacement,
          },
        },
      ].map((el, index) => (
        <TabPanel value={tabValue} key={index} index={index} style={{boxShadow: "none"}}>
          <Controlbar {...el.controlBarSettings} />
          <CardPlacement {...el.cardPlacement} />
        </TabPanel>
      ))}

      <BoardEditFilterOptions
        open={filterDlgOpen}
        handleClose={(filterOption) => handleFilterOptions(filterOption)}
        onSetSortMethod={(method) => handleSortCards(method)}
      />
      <DeleteCardsFromBoard
        open={deleteDlgOpen}
        handleDelete={() => handleDeleteCardsFromBoards()}
        handleClose={() => setDeleteDlgOpen(false)}
      />
      <AddCardToBoard
        open={isCardBoardOpen}
        cardsToAdd={cardsToAdd}
        onHandleClose={() => setCardBoardOpen(false)}
        onHandleSavedToBoard={(message) => handleSavedToBoard(message)}
        onBookmarked={(bookmarkCount) => console.log(bookmarkCount)}
      />
      <SnackAlert
        open={isSnackOpen}
        vertical="top"
        horizontal="center"
        onClose={() => setSnackOpen(false)}
        message={message}
      />
    </div>
  )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`card-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export default BoardMain
