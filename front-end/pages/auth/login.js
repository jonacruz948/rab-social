import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import InstagramIcon from '@material-ui/icons/Instagram'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'

import auth0 from '../../helpers/auth0'
import Layout from '../../components/Layout'

const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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
  instagram: {
    backgroundColor: '#E1306C',
    borderColor: '#E1306C',
    '&:focus, &:hover': {
      backgroundColor: '#E1306C',
      borderColor: '#E1306C',
    },
  },
  facebook: {
    backgroundColor: '#4267B2',
    borderColor: '#4267B2',
    '&:focus, &:hover': {
      backgroundColor: '#4267B2',
      borderColor: '#4267B2',
    },
  },
  twitter: {
    backgroundColor: '#1DA1F2',
    borderColor: '#1DA1F2',
    '&:focus, &:hover': {
      backgroundColor: '#1DA1F2',
      borderColor: '#1DA1F2',
    },
  },
  box: {
    paddingTop: theme.spacing(2),
  },
}))

const FormikTextField = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const classes = useStyles()
  const { users } = useSelector((state) => state)

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

const Login = (props) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { users } = useSelector((state) => state)
  const router = useRouter()

  useEffect(() => {
    if (users.isAuthorized) {
      if (router.query?.redirectTo) {
        router.push(router.query.redirectTo)
      } else router.push('/')
    }
  }, [users.isAuthorized])

  const handleSubmit = (values) => {
    const { email, password } = values
    let payload
    if (regExp.test(email)) {
      payload = { email, password, userName: '' }
    } else {
      payload = { email: '', password, userName: email }
    }

    dispatch({ type: 'LOGIN_WATCHER', payload })
  }

  const loginWithSocial = (connection) => {
    auth0.authorize({
      connection,
      scope:
        connection === 'facebook' ? 'openid profile email' : 'user_profile',
      redirectUri: 'http://localhost:3000',
      responseType: 'token id_token',
    })
  }

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper className={classes.paper} elevation={3}>
          <Typography component="h1" variant="h5">
            Welcome Back
          </Typography>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .min(5, 'should be 8 letters minimum')
                .required('Required'),
              password: Yup.string()
                .required('Required')
                .min(8, 'Password is too short - should be 8 letters minimum.')
                .matches(/[a-zA-Z]/, 'Password can only contain Latin letters'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values)
              setSubmitting(false)
            }}
          >
            <Form className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormikTextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    placeholder="Username or email address"
                    name="email"
                    autoComplete="email"
                  />
                  {users.loginFailed && (
                    <Typography className={classes.error} variant="subtitle1">
                      The email or password is incorrect
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    placeholder="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
              >
                Login
              </Button>
              <Grid container justify="center">
                <Grid item>
                  <Link href="/auth/register">
                    <a>Don't have an account? Register for one</a>
                  </Link>
                </Grid>
              </Grid>
            </Form>
          </Formik>
          <Grid container className={classes.box}>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                className={classes.instagram}
                onClick={() => loginWithSocial('instagram')}
              >
                <InstagramIcon style={{ color: '#ffffff' }} />
              </Button>
            </Grid>
            <Grid container item xs={4} justify="center">
              <Button
                variant="outlined"
                className={classes.facebook}
                onClick={() => loginWithSocial('facebook')}
              >
                <FacebookIcon style={{ color: '#ffffff' }} />
              </Button>
            </Grid>
            <Grid container item xs={4} justify="flex-end">
              <Button
                variant="outlined"
                className={classes.twitter}
                onClick={() => loginWithSocial('twitter')}
              >
                <TwitterIcon style={{ color: '#ffffff' }} />
              </Button>
            </Grid>
          </Grid>
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

export default Login
