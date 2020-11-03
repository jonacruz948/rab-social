import React, { useState } from 'react'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'

import BoardHead from '../BoardHead'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    paddingTop: '10%',
  },
  textFields: {
    margin: 'auto',
    marginTop: '10px',
    width: '100%',
    fontFamily: 'Suisse-Intl-Regular',
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
    width: '100%',
    height: '160px',
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

const BoardCreate = ({ onNext, steps }) => {
  const classes = useStyles()

  const handleSubmit = (values) => {
    onNext({ ...values })
  }

  return (
    <>
      <BoardHead boardTitle={'Create Board'} steps={steps} />
      <Formik
        initialValues={{
          boardName: '',
          boardDesc: '',
          hashTags: '',
          file: '',
          filePreview: '',
        }}
        validationSchema={Yup.object({
          boardName: Yup.string().required('Board Name is required'),
          boardDesc: Yup.string().required('Board Description is required'),
          hashTags: Yup.string().required('Hashtags are required'),
          file: Yup.mixed(),
          filePreview: Yup.mixed(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting, isValid, dirty, values, setFieldValue }) => (
          <Form className={classes.form} autoComplete="off">
            <div className={classes.boardfield}>
              <Typography variant="body1" className={classes.text}>
                Board name
              </Typography>
              <FormikBoardField
                className={classes.textFields}
                variant="outlined"
                id="boardName"
                name="boardName"
                autoComplete="boardName"
              />
            </div>
            <div className={classes.boardfield}>
              <Typography variant="body1" className={classes.text}>
                Board Description
              </Typography>
              <FormikBoardField
                className={classes.textFields}
                variant="outlined"
                id="boardDesc"
                name="boardDesc"
                autoComplete="boardDesc"
                multiline
                rows={5}
              />
            </div>
            <div className={classes.boardfield}>
              <Typography variant="body1" className={classes.text}>
                Hashtags
              </Typography>
              <FormikBoardField
                className={classes.textFields}
                variant="outlined"
                id="hashTags"
                name="hashTags"
                autoComplete="boardDesc"
              />
            </div>
            <div className={classes.boardfield}>
              <Typography variant="body1" className={classes.text}>
                Board Image
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
    </>
  )
}

export default BoardCreate
