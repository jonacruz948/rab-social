import React, { useContext } from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import BoardDataContext from '../../../context/BoardDataContext'

const DEFAULT_USER_AVATAR = '/images/user.jpeg'

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: `70px`,
    textAlign: 'center',
    right: `10px`,
    justifyContent: 'center',
    marginTop: '10%',
  },
  avatar: {
    margin: 'auto',
    marginTop: theme.spacing(1),
  },
  boardOwner: {
    marginTop: theme.spacing(1),
    fontFamily: 'Suisse Intl Bold !important',
    fontSize: '14px',
    color: '#212529',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  boardTitle: {
    fontFamily: 'Suisse Intl Bold !important',
    marginBottom: theme.spacing(2),
  },
}))

const BoardAvatar = ({ avatar, boardOwner, boardCreatedUserID }) => {
  const classes = useStyles()
  const { state: boardState } = useContext(BoardDataContext)

  const { name, boardID } = boardState

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.boardTitle}>
        {name}
      </Typography>
      <Link href={`/profile/${boardCreatedUserID}`}>
        <a>
          <Avatar
            alt="User Avatar"
            className={classes.avatar}
            src={avatar ? avatar : DEFAULT_USER_AVATAR}
          />
          <Typography variant="body2" className={classes.boardOwner}>
            By {boardOwner}
          </Typography>
        </a>
      </Link>
    </div>
  )
}

export default BoardAvatar
