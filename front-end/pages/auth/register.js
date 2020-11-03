import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'

import Layout from '../../components/Layout'
import getGeolocation from '../../helpers/location'
import * as authAPI from '../../api/auth'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#ffffff',
  },
  below: {
    marginTop: '20px',
  },
  image: {
    width: '100%',
    borderRadius: '4px',
  },
  brand: {
    padding: '20px',
  },
  brandtitle: {
    fontWeight: '800',
  },
  brandDesc: {
    marginTop: theme.spacing(1),
    fontSize: '10px',
    fontWeight: '200',
  },
  error: {
    color: '#ff0f0f',
  },
  text: {
    fontFamily: 'Suisse Intl Bold',
  },
  input: {
    display: 'none',
  },
  media: {
    height: '100%',
    width: '100%',
  },
  actionarea: {
    height: '100%',
    background: '#a5a5a5',
  },
  card: {
    height: '100%',
  },
  label: {
    width: '100px',
    height: '100px',
  },
}))

const FormikTextField = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const classes = useStyles()

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

export default function Register() {
  const classes = useStyles()
  const { users } = useSelector((state) => state)
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [userName, setUserName] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMessage, setErrMessage] = useState(null)
  const router = useRouter()
  const dispatch = useDispatch()

  if (users && users.isAuthorized) {
    router.push('/')
  }

  useEffect(() => {
    if (users && users.isAuthorized) {
      router.push('/')
    }
  }, [users])

  useEffect(() => {
    function success(position) {
      const { latitude, longitude } = position.coords

      getGeolocation({
        lat: latitude,
        lon: longitude,
      }).then((response) => {
        const { address_components } = response.results[0]

        const { long_name: userState } = address_components[5]
        const { long_name: userCity } = address_components[3]

        setState(userState)
        setCity(userCity)
      })
    }

    function error(err) {
      console.log('Unable to retrieve your location')
    }

    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser')
      return
    }
    navigator.geolocation.getCurrentPosition(success, error)
  }, [])

  const handleSubmit = (values) => {
    const { city, state, email, fullName, password, userName, file } = values

    const formData = new FormData()
    formData.append('file', file, file.name)
    formData.append('state', state)
    formData.append('city', city)
    formData.append('email', email)
    formData.append('fullName', fullName)
    formData.append('userName', userName)
    formData.append('password', password)

    authAPI.register({ formData }).then((result) => {
      const { user, profile, token, result: code } = result.data
      if (!code) {
        dispatch({
          type: 'USER_SIGNUP',
          payload: { user, profile, token },
        })
        router.push('/')
      } else {
        const { message: error } = result.data
        setErrMessage(error)
      }
    })
  }

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper className={classes.paper} elevation={3}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Formik
            enableReinitialize={true}
            initialValues={{
              userName,
              fullName,
              email,
              password,
              city,
              state,
              file: null,
              filePreview: '',
            }}
            validationSchema={Yup.object({
              userName: Yup.string()
                .max(30, 'Must be 30 characters or less')
                .min(5, 'Username must be at least 5 characters long')
                .required(),
              fullName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
              email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
              password: Yup.string()
                .required('Required')
                .min(8, 'Password is too short - should be 8 letters minimum.')
                .matches(
                  /[a-zA-Z0-9]/,
                  'Password can only contain Latin letters'
                ),
              city: Yup.string().required('Required'),
              state: Yup.string().required('Required'),
              file: Yup.mixed().required(),
              filePreview: Yup.string().required(),
            })}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values)
              setSubmitting(false)
            }}
          >
            {({ isSubmitting, isValid, values, setFieldValue }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormikTextField
                      name="userName"
                      variant="outlined"
                      id="userName"
                      placeholder="Username"
                      autoFocus
                      fullWidth
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormikTextField
                      autoComplete="fname"
                      name="fullName"
                      variant="outlined"
                      id="fullName"
                      placeholder="Full Name"
                      fullWidth
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormikTextField
                      variant="outlined"
                      fullWidth
                      id="email"
                      placeholder="Email Address"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormikTextField
                      variant="outlined"
                      fullWidth
                      name="password"
                      placeholder="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormikTextField
                      variant="outlined"
                      fullWidth
                      id="city"
                      placeholder="City"
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete="city"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormikTextField
                      variant="outlined"
                      fullWidth
                      id="state"
                      placeholder="State"
                      name="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      autoComplete="state"
                    />
                    {users.signUpFailed && (
                      <Typography className={classes.error} variant="subtitle1">
                        {users.message}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <span className={classes.text}>Avatar</span>
                      <span>&nbsp;(required)</span>
                    </Typography>
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={(event) => {
                        let reader = new FileReader()
                        if (event.currentTarget.files[0]) {
                          reader.onloadend = () => {
                            setFieldValue('filePreview', reader.result)
                          }
                          reader.readAsDataURL(event.currentTarget.files[0])
                          setFieldValue('file', event.currentTarget.files[0])
                        }
                      }}
                    />
                    <label
                      htmlFor="contained-button-file"
                      id="file"
                      name="file"
                      className={classes.label}
                    >
                      <Card className={classes.card}>
                        <CardActionArea
                          className={classes.actionarea}
                          component="span"
                        >
                          {values.filePreview && (
                            <CardMedia
                              image={values.filePreview}
                              className={classes.media}
                            />
                          )}
                        </CardActionArea>
                      </Card>
                    </label>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} container justify="center">
                  {errMessage && (
                    <Typography className={classes.error} variant="subtitle1">
                      {errMessage}
                    </Typography>
                  )}
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting || !isValid}
                  className={classes.submit}
                >
                  Register
                </Button>
                <Grid container justify="center">
                  <Grid item>
                    <Link href="/auth/login" variant="body2">
                      Have an account? Login
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
        <Paper elevation={3} className={classes.below}>
          <Box>
            <img src="/images/2.jpg" className={classes.image} />
          </Box>
          <Box className={classes.brand}>
            <Typography variant="h5" className={classes.brandtitle}>
              ~ Noam Chomsky
            </Typography>
            <Typography variant="h6" className={classes.brandDesc}>
              “Social action must be animated by a vision of a future society,
              and by explicit judgments of value concerning the character of
              this future society.”
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Layout>
  )
}
