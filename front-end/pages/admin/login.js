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
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'

import * as adminAPI from '../../api/admin'
import Layout from '../../components/Layout'

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

const AdminLogin = (props) => {
  const classes = useStyles()
  const { users } = useSelector((state) => state)
  const router = useRouter()
  const [loginStatus, setLoginStatus] = useState(false)

  const handleSubmit = (values) => {
    adminAPI.adminLogin({ ...values }).then((result) => {
      const { result: code, admin_token } = result.data
      setLoginStatus(code)
      if (code === 0) {
        localStorage.setItem('admin_token', admin_token)
        router.push('/admin')
      } else {
        setLoginStatus(true)
      }
    })
  }
  useEffect(() => {
    console.log(localStorage.getItem('admin_token'))
    if (localStorage.getItem('admin_token')) router.push('/admin')
  }, [])

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper className={classes.paper} elevation={3}>
          <Typography component="h1" variant="h5">
            Admin Login
          </Typography>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email('Invalid email address')
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
                    label="Email Address"
                    placeholder="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                  {loginStatus && (
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
                    label="Password"
                    type="password"
                    placeholder="Password"
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
            </Form>
          </Formik>
        </Paper>
      </Container>
    </Layout>
  )
}

export default AdminLogin
