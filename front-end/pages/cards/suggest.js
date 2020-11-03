import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import IconButton from '@material-ui/core/IconButton'

import SuggestCardThanks from '../../components/Cards/SuggestCardThanks'

import * as cardAPI from '../../api/cards'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    // paddingTop: '10%',
  },
  suggestCard: {
    width: '100%',
    textAlign: 'center',
  },
  suggest: {
    fontWeight: '800',
    fontSize: '25px',
  },
  textFields: {
    margin: 'auto',
    marginTop: '10px',
    width: '100%',
  },
  boardfield: {
    width: '90%',
    margin: 'auto',
    marginTop: '10%',
  },
  next: {
    width: '90%',
    margin: 'auto',
    textAlign: 'end',
    marginTop: '5%',
  },
  nextbtn: {
    textTransform: 'none',
    background: '#999999',
    fontSize: '14px',
    color: '#cccccc',
    paddingLeft: '30px',
    paddingRight: '30px',
  },
  error: {
    color: '#ff0f0f',
  },
}))

const FormikBoardField = (props) => {
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

const Suggest = () => {
  const router = useRouter()
  const classes = useStyles()
  const [thanksDlgOpen, setThanksDlgOpen] = useState(false)
  const { users } = useSelector((state) => state)

  const handleSubmit = (values) => {
    const { cause, description } = values
    const { token, userId: userID } = users
    const Authorization = `Bearer ${token}`

    cardAPI
      .suggestCard({ Authorization, cause, description, userID })
      .then((result) => {
        setThanksDlgOpen(true)
        console.log(result.data)
      })
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => router.back()}>
        <CloseOutlinedIcon fontSize="large" />
      </IconButton>
      <div className={classes.suggestCard}>
        <Typography variant="subtitle1" className={classes.suggest}>
          Suggest a Card
        </Typography>
      </div>
      <Formik
        initialValues={{
          cause: '',
          description: '',
        }}
        validationSchema={Yup.object({
          cause: Yup.string().required(),
          description: Yup.string().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className={classes.form} autoComplete="off">
            <div className={classes.boardfield}>
              <Typography variant="h6">Cause</Typography>
              <FormikBoardField
                className={classes.textFields}
                variant="outlined"
                id="cause"
                name="cause"
                autoComplete="cause"
              />
            </div>
            <div className={classes.boardfield}>
              <Typography variant="h6">Description</Typography>
              <FormikBoardField
                className={classes.textFields}
                variant="outlined"
                id="description"
                name="description"
                autoComplete="description"
                multiline
                rows={5}
              />
            </div>
            <div className={classes.next}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !dirty || !isValid}
                className={classes.nextbtn}
              >
                Next
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <SuggestCardThanks
        open={thanksDlgOpen}
        onClose={() => setThanksDlgOpen(false)}
      />
    </div>
  )
}

export default Suggest
