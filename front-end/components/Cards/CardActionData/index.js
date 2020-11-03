import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined'
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined'
import moment from 'moment'
import Geocode from 'react-geocode'
import getGeolocation from '../../../helpers/location'

Geocode.setApiKey('AIzaSyAxnD5Yfll6FYErBZR1nMsQEjh67PDHvu0')
Geocode.setLanguage('en')
Geocode.setRegion('us')

const useStyles = makeStyles((theme) => ({
  dateOfEvent: {
    fontSize: '14px',
  },
  root: {
    width: '60%',
  },
}))

const CardActionData = ({ dateOfEvent, location }) => {
  const classes = useStyles()
  const [address, setAddress] = useState('')

  if (location) {
    const { lat, lon } = location

    getGeolocation({ lat, lon }).then((response) => {
      const { formatted_address } = response.results[0]
      setAddress(formatted_address)
    })
  }

  return (
    <List className={classes.root}>
      {dateOfEvent && (
        <ListItem>
          <ListItemIcon>
            <CalendarTodayOutlinedIcon style={{ fontSize: '30px' }} />
          </ListItemIcon>
          <ListItemText
            primary={
              <span className={classes.dateOfEvent}>
                {moment(dateOfEvent).format('LLLL')}
              </span>
            }
          />
        </ListItem>
      )}
      {location && (
        <ListItem>
          <ListItemIcon>
            <LocationOnOutlinedIcon style={{ fontSize: '30px' }} />
          </ListItemIcon>
          <ListItemText
            primary={<span className={classes.dateOfEvent}>{address}</span>}
          />
        </ListItem>
      )}
    </List>
  )
}

export default CardActionData
