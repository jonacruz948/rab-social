import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { TYPEFORM as t } from '../../../constant'
import * as typeformAPI from '../../../api/typeform'

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 0,
    background: '#000',
    color: '#fff',
    textTransform: 'none',
    fontSize: '14px',
    '&:focus, &:hover': {
      background: '#000',
      color: '#fff',
    },
    fontWeight: 600,
  },
}))

const Typeform = ({ title, formID }) => {
  const router = useRouter()
  const [typeformEmbed, setTypeformEmbed] = useState(null)
  const classes = useStyles()
  const { users } = useSelector((state) => state)

  useEffect(() => {
    const url = `${t.TYPEFORM_BASEURL}/${formID}`
    const typeformComponent = window.typeformEmbed
      ? window.typeformEmbed.makePopup(url, {
          autoOpen: false,
          autoClose: 2000,
          onSubmit: (event) => {
            // console.log(event)
            // console.log(event.response_id)
            const { response_id: responseID } = event
            const { token, userId: userID } = users
            const Authorization = `Bearer ${token}`

            //delay 10s to avoid the API call failure
            typeformAPI
              .getSpecificTypeformResponse({
                Authorization,
                formID,
                responseID,
                userID,
              })
              .then((result) => {
                const { data } = result
                console.log(data)
              })
          },
        })
      : null
    setTypeformEmbed(typeformComponent)
  }, [])

  const handleTypeformOpen = () => {
    if (!users.isAuthorized) return router.push('/auth/login')
    typeformEmbed.open()
  }

  return (
    <div className="typeform">
      <Button
        variant="outlined"
        className={classes.button}
        onClick={handleTypeformOpen}
      >
        {title}
      </Button>
    </div>
  )
}

export default Typeform
