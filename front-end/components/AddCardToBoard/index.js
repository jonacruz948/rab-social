import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Fuse from 'fuse.js'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import FormControl from '@material-ui/core/FormControl'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import SearchIcon from '@material-ui/icons/Search'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined'

import * as cardAPI from '../../api/cards'
import * as userAPI from '../../api/user'
import { Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    margin: 'auto',
  },
  board: {
    borderRadius: '18px',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '18px',
    width: '90%',
  },
  list: {
    maxHeight: '400px',
    overflow: 'scroll',
    width: '100%',
  },
  cardmedia: {
    height: '100%',
    opacity: '0.4',
  },
  actionarea: {
    height: '100%',
    position: 'relative',
    background: '#333333',
  },
  margin: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  input: {
    border: 'none',
  },
  cardboard: {
    height: 140,
    borderRadius: 20,
    position: 'relative',
  },
  createboard: {
    backgroundColor: `#333333`,
  },
  titlebar: {
    display: 'flex',
  },
  title: {
    fontSize: '14px',
    textAlign: 'center',
    width: '80%',
    color: '#ffffff',
    position: 'absolute',
    top: '30%',
  },
  searchicon: {
    padding: 0,
  },
  btn: {
    margin: 'auto',
    borderRadius: 0,
    color: '#fff',
    background: '#000',
    '&:focus, &:hover': {
      color: '#fff',
      background: '#000',
    },
  },
}))

const AddCardToBoard = ({
  open,
  cardsToAdd,
  cardType,
  onBookmarked,
  onHandleClose,
  isBookmarked,
  onHandleSavedToBoard,
}) => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const classes = useStyles()
  const [userBoards, setUserBoards] = useState([])
  const [orgBoards, setOrgBoards] = useState([])
  const { users } = useSelector((state) => state)

  const { token, userId: userID } = users
  const Authorization = `Bearer ${token}`

  useEffect(() => {
    if (users.isAuthorized) {
      userAPI.getUserBoards({ userID, Authorization }).then((result) => {
        const { data } = result
        setUserBoards(data)
        setOrgBoards(data)
      })
    }
  }, [users.isAuthorized])

  const fuse = new Fuse(userBoards, { keys: ['name'], includeScore: true })

  const handleSaveCardToBoard = (el) => {
    const { name } = el

    const {
      cards: { action: actionCardsFromBoard, media: mediaCardsFromBoard },
    } = el

    const { action: actionCardsToAdd, media: mediaCardsToAdd } = cardsToAdd

    const uActionCardsToAdd = actionCardsToAdd.filter(
      (cardItem) => !actionCardsFromBoard.includes(cardItem)
    )

    const uMediaCardsToAdd = mediaCardsToAdd.filter(
      (cardItem) => !mediaCardsFromBoard.includes(cardItem)
    )

    cardAPI
      .bookmarkCardToBoard({
        Authorization,
        cards: {
          action: uActionCardsToAdd,
          media: uMediaCardsToAdd,
        },
        boardID: el._id,
        userID,
      })
      .then((result) => {
        const { bookmark } = result.data
        onHandleSavedToBoard(`Saved to ${name} board`)
        onBookmarked(bookmark[0].bookmarkUsers.length)
        onHandleClose()
      })
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    if (e.target.value) {
      const result = fuse.search(e.target.value).map((el) => el.item)
      setUserBoards(result)
    } else {
      setUserBoards(orgBoards)
    }
  }

  return (
    <div>
      <Modal
        className={classes.modal}
        open={open}
        onClose={onHandleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className={classes.titlebar}>
              <IconButton onClick={onHandleClose}>
                <CloseOutlinedIcon style={{ fontSize: '30px' }} />
              </IconButton>
              <Typography variant="h5" style={{ margin: 'auto' }}>
                Add To Board
              </Typography>
            </div>
            <FormControl
              fullWidth
              className={classes.margin}
              variant="outlined"
            >
              <OutlinedInput
                placeholder="Start typing..."
                value={search}
                onChange={handleSearchChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            <Grid container className={classes.root}>
              <Grid item xs={12}>
                <Grid container>
                  <Button
                    variant="contained"
                    onClick={() => router.push('/board/new')}
                    className={classes.btn}
                  >
                    <AddCircleOutlineOutlinedIcon
                      style={{ fontSize: '30px' }}
                    />
                    &nbsp;&nbsp;Create a Board
                  </Button>
                  <List className={classes.list}>
                    {userBoards.map((el) => (
                      <ListItem
                        key={el._id}
                        button
                        onClick={() => handleSaveCardToBoard(el)}
                      >
                        <ListItemText primary={<strong>{el.name}</strong>} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

export default AddCardToBoard
