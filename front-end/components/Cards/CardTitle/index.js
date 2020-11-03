import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import DoneIcon from '@material-ui/icons/Done'

const style = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '15px',
}

const useStyles = makeStyles((theme) => ({
  orgIcon: {
    marginTop: '20px',
    fontSize: '16px'
  },
  avatar: {
    width: 56,
    height: 56,
  },
  secondary: {
    height: 65,
    width: '73%',
  },
  badges: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  property: {
    lineHeight: 1.4,
    fontFamily: 'Suisse-Intl-Regular',
  },
}))

const CardTitle = ({
  cardType,
  organiationName,
  description,
  bookmarkCount,
  badge,
  isDidAction,
  completed,
}) => {
  const classes = useStyles()

  return (
    <>
      {cardType === 'media' ? (
        <>
        <Typography variant="body1">
            <BookmarkIcon />
            &nbsp;&nbsp;{bookmarkCount}&nbsp;&nbsp;&nbsp;
            <DoneIcon />
            {completed} Completed
          </Typography>
          
          <Typography variant="h5" className={classes.orgIcon}>
            <Icon style={{marginRight: "-10px"}}>
              <img src="/images/orgnanization.svg" />
                &nbsp;&nbsp;&nbsp;{' '}
            </Icon>
            Rabble
          </Typography>
    
        </>
      ) : (
        <>
          <Typography variant="body1">
            <BookmarkIcon />
            &nbsp;&nbsp;{bookmarkCount}&nbsp;&nbsp;&nbsp;
            <DoneIcon />
            {completed} Completed
          </Typography>
          {organiationName && (
            <Typography variant="h5" className={classes.orgIcon}>
              <Icon style={{marginRight: "-10px"}}>
                <img src="/images/orgnanization.svg" />
                &nbsp;&nbsp;&nbsp;{' '}
              </Icon>
              {organiationName}
            </Typography>
          )}

          <Typography variant="subtitle1" style={{ marginTop: '20px' }}>
            <div dangerouslySetInnerHTML={{ __html: description }}></div>
          </Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  src={isDidAction ? badge.archieved : badge.unarchieved}
                  alt={badge.name}
                  className={classes.avatar}
                />
              </ListItemAvatar>
              <ListItemSecondaryAction className={classes.secondary}>
                <div className={classes.badges}>
                  <Typography variant="subtitle1" className={classes.property}>
                    <strong>{badge.name}</strong>
                  </Typography>
                  {!isDidAction && (
                    <Typography
                      variant="subtitle1"
                      className={classes.property}
                    >
                      5 points
                    </Typography>
                  )}
                  <Typography variant="subtitle1" className={classes.property}>
                    {isDidAction ? (
                      <span>
                        <DoneIcon />
                        completed
                      </span>
                    ) : (
                      <span>incomplete</span>
                    )}
                  </Typography>
                </div>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </>
      )}
    </>
  )
}

export default CardTitle
