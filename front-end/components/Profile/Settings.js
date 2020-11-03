import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'

import * as userAPI from '../../api/user'

const DEFAULT_AVATAR = 'https://rabble-dev.s3.amazonaws.com/assets/user.jpeg'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  card: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    boxShadow: 'none',
    margin: 'auto',
  },
  cardmedia: {
    height: '100%',
  },
  input: {
    display: 'none',
  },
  actionarea: {
    height: theme.spacing(10),
    width: theme.spacing(10),
  },
  avatarArea: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
  },
  textFields: {
    margin: 'auto',
    marginTop: '10px',
    width: '100%',
  },
  fieldArea: {
    width: '90%',
    margin: 'auto',
    marginTop: '5%',
  },
  submit: {
    textAlign: 'right',
    margin: '5% 5% 5% 5%',
  },
  submitBtn: {
    borderRadius: 0,
    background: '#000',
    color: '#fff',
    '&:focus, &:hover': {
      background: '#000',
      color: '#fff',
    },
  },
}))

const FormikTextField = (props) => {
  const [field, meta] = useField(props)

  return (
    <>
      <TextField
        {...props}
        {...field}
        error={meta.touched && meta.error ? true : false}
      />
    </>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Settings = ({
  onClose,
  open,
  onUpdateProfile,
  onSetProfileAvatar,
  avatar,
  ...settings
}) => {
  const classes = useStyles()
  const [profileAvatar, setProfileAvatar] = useState(DEFAULT_AVATAR)
  const [fullName, setFullName] = useState('')
  const [userName, setUserName] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [bio, setBio] = useState('')
  const { users } = useSelector((state) => state)

  useEffect(() => {
    setFullName(settings.fullName)
    setUserName(settings.userName)
    setCity(settings.city)
    setState(settings.state)
    setProfileAvatar(avatar)
    setBio(settings.bio)
  }, [settings])

  const HandleFileChange = (e) => {
    if (e.target.files[0]) {
      const formData = new FormData()
      formData.append('file', e.target.files[0])

      const { token, userId: userID } = users
      const Authorization = `Bearer ${token}`

      userAPI
        .uploadProfileAvatar({ Authorization, formData, userID })
        .then((result) => {
          const { avatar } = result.data
          onSetProfileAvatar(avatar)
        })
    }
  }

  const handleSubmit = (values) => {
    const { fullName, userName, city, bio, state } = values

    onUpdateProfile({
      profileBio: bio,
      profileFullName: fullName,
      profileCity: city,
      profileState: state,
      profileUserName: userName,
    })
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar} color="inherit">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <ArrowBackIosOutlinedIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Settings
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.avatarArea}>
          <Card className={classes.card}>
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              type="file"
              onChange={HandleFileChange}
            />
            <label htmlFor="contained-button-file">
              <CardActionArea className={classes.actionarea} component="span">
                <CardMedia
                  image={profileAvatar}
                  className={classes.cardmedia}
                />
              </CardActionArea>
            </label>
          </Card>
          <Typography variant="body1">Change Profile Photo</Typography>
        </div>
        <Formik
          initialValues={{
            fullName,
            userName,
            city,
            state,
            bio,
          }}
          enableReinitialize
          validationSchema={Yup.object({
            fullName: Yup.string().required(),
            userName: Yup.string().required(),
            city: Yup.string().required(),
            state: Yup.string().required(),
            bio: Yup.string().required(),
          })}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values)
            setSubmitting(false)
          }}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className={classes.form} autoComplete="off">
              {[
                {
                  fieldName: 'Name',
                  fieldSettings: {
                    id: 'fullName',
                    name: 'fullName',
                    autoComplete: 'fullName',
                    value: fullName,
                    onChange: (e) => setFullName(e.target.value),
                  },
                },
                {
                  fieldName: 'Username',
                  fieldSettings: {
                    id: 'userName',
                    name: 'userName',
                    autoComplete: 'userName',
                    value: userName,
                    onChange: (e) => setUserName(e.target.value),
                  },
                },
                {
                  fieldName: 'City',
                  fieldSettings: {
                    id: 'city',
                    name: 'city',
                    autoComplete: 'city',
                    value: city,
                    onChange: (e) => setCity(e.target.value),
                  },
                },
                {
                  fieldName: 'State',
                  fieldSettings: {
                    id: 'state',
                    name: 'state',
                    autoComplete: 'state',
                    value: state,
                    onChange: (e) => setState(e.target.value),
                  },
                },
                {
                  fieldName: 'Bio',
                  fieldSettings: {
                    id: 'bio',
                    name: 'bio',
                    autoComplete: 'bio',
                    multiline: true,
                    rows: 5,
                    value: bio,
                    onChange: (e) => setBio(e.target.value),
                  },
                },
              ].map((el, index) => (
                <div className={classes.fieldArea} key={index}>
                  <Typography variant="h6">{el.fieldName}</Typography>
                  <FormikTextField
                    className={classes.textFields}
                    variant="outlined"
                    {...el.fieldSettings}
                  />
                </div>
              ))}
              <div className={classes.submit}>
                <Button
                  type="submit"
                  autoFocus
                  color="inherit"
                  variant="outlined"
                  className={classes.submitBtn}
                  disabled={isSubmitting || !isValid}
                >
                  save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  )
}

export default Settings
