import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import { Collapse } from 'react-collapse'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import classnames from 'classnames'
import moment from 'moment'

import * as commentAPI from '../../../api/comments'

const useStyles = makeStyles((theme) => ({
  inline: {
    display: 'inline',
    fontSize: '14px',
  },
  comment: {
    verticalAlign: 'bottom',
    textTransform: 'none',
    fontSize: '13px',
    fontWeight: '900',
  },
  commentArea: {
    marginLeft: '12%',
  },
  leave: {
    marginLeft: '12%',
  },
  commentlist: {
    width: '100%',
  },
  commentctn: {
    maxHeight: '600px',
    overflowY: 'auto',
  },
  collapse: {
    textAlign: 'end',
  },
}))

const collapseTextStyle = {
  border: 'none',
  fontSize: '14px',
  lineHeight: 'initial',
  width: "300px"
}

const CardComment = ({ slug }) => {
  const { users } = useSelector((state) => state)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])
  const [commentLimit, setCommentLimit] = useState(2)
  const [isCollapseOpen, setCollapseOpen] = useState(false)
  const router = useRouter()

  const classes = useStyles()

  useEffect(() => {
    commentAPI.getComments(slug).then((result) => {
      const {
        data: { comments },
      } = result
      setComments(comments)
    })
  }, [])

  const handleLeaveComment = () => {
    if (!users.isAuthorized) {
      router.push({
        pathname: '/auth/login',
        query: { redirectTo: `${window.location.pathname}` },
      })
    } else {
      setCollapseOpen(true)
    }
  }

  const handleSaveComment = () => {
    if (users.isAuthorized) {
      const { token, userId } = users
      commentAPI.addComments(token, userId, slug, newComment).then((result) => {
        const {
          data: { comments },
        } = result
        setComments(comments)
        setNewComment('')
        setCollapseOpen(false)
      })
    }
  }

  const handleViewAllComments = () => {
    setCommentLimit(comments.length)
  }

  return (
    <div className={classes.commentctn}>
      <CardContent>
        <Typography variant="subtitle1">
          <strong>{comments.length} Comments</strong>
        </Typography>
      </CardContent>
      <CardActions>
        <List className={classes.commentlist}>
          {comments.map((item, index) => {
            return (
              index < commentLimit && (
                <ListItem alignItems="flex-start" key={index}>
                  <ListItemAvatar>
                    <Avatar
                      alt="comment"
                      src={item.avatar}
                      style={{ fontSize: '20px' }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<strong>{item.fullName}</strong>}
                    secondary={
                      <>
                        <Typography
                          variant="caption"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {item.message}
                        </Typography>
                      </>
                    }
                  />
                  
                </ListItem>
              )
            )
          })}
          <ListItem>
            <Button
              className={classnames(classes.comment, classes.leave)}
              onClick={handleLeaveComment}
            >
              Leave a comment
            </Button>
            <Button className={classes.comment} onClick={handleViewAllComments}>
              View all comments
            </Button>
          </ListItem>
          <ListItem>
            <Grid container spacing={1} className={classes.commentArea}>
              <Collapse isOpened={isCollapseOpen}>
                <Grid item xs={12}>
                  <TextField
                    id="input-with-icon-grid"
                    label="Leave a comment"
                    multiline={true}
                    inputProps={{
                      style: collapseTextStyle,
                    }}
                    fullwidth={true}
                    rows={3}
                    variant="outlined"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Grid>
                <Button
                  className={classes.comment}
                  onClick={() => setCollapseOpen(false)}
                >
                  Cancel
                </Button>
                <Button className={classes.comment} onClick={handleSaveComment}>
                  Save Comment
                </Button>
              </Collapse>
            </Grid>
          </ListItem>
          <Divider />
        </List>
      </CardActions>
    </div>
  )
}

export default CardComment
