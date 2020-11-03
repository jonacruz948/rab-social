import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { purple } from '@material-ui/core/colors'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

import { LEVELS } from '../../constant/points'
import * as userAPI from '../../api/user'

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
  },
  colorPrimary: {
    backgroundColor: purple[theme.palette.type === 'light' ? 100 : 700],
  },
  bar: {
    backgroundColor: '#6200ee',
  },
}))(LinearProgress)

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  secondary: {
    height: 40,
    width: '70%',
  },
  badges: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  avatar: {
    width: '60px',
    height: '60px',
  },
  badgeCollectionRoot: {
    paddingBottom: theme.spacing(10),
    paddingTop: theme.spacing(2),
  },
  badgeProgress: {
    marginTop: theme.spacing(2),
  },
  gridItem: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  points: {
    width: '80%',
    margin: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  boardstats: {
    paddingTop: theme.spacing(2),
  },
}))

const Dashboard = ({ points, badgeData, badges }) => {
  const classes = useStyles()

  const badgeCounts = {}
  const uniqueBadges = [...new Set(badges)]
  uniqueBadges.forEach((el) => {
    badgeCounts[el] = badgeData.filter(
      (item) => item.actionKeyword === el
    ).length
  })

  const badgesToDisplay = uniqueBadges.map((el) => ({
    ...badgeData.find((item) => item.actionKeyword === el),
    counts: badgeCounts[el],
    points: 5 * badgeCounts[el],
  }))

  return (
    <div className={classes.root}>
      <ProgressBar points={points} />
      <BoardStats />
      <BadgeProgress badgesToDisplay={badgesToDisplay} />
      <BadgeCollection badgesToDisplay={badgesToDisplay} />
    </div>
  )
}

const ProgressBar = ({ points }) => {
  const classes = useStyles()
  const index = LEVELS.findIndex((level) => points < level)
  const levelMaxPoint = LEVELS[index] + LEVELS[index - 1]
  const pointValue = (100 / levelMaxPoint) * (points - LEVELS[index - 1])

  return (
    <div className={classes.progress}>
      <Typography variant="subtitle1">Progress</Typography>
      <div className={classes.points}>
        <BorderLinearProgress variant="determinate" value={pointValue} />
        <Typography variant="body2">
          {levelMaxPoint - points} more points until level {index + 1}!
        </Typography>
      </div>
      <Divider />
    </div>
  )
}

const data = [
  { name: 'Page A', saves: 1000, shares: 2400, amt: 2400 },
  { name: 'Page B', saves: 3000, shares: 1398, amt: 2210 },
  { name: 'Page C', saves: 2000, shares: 4800, amt: 2290 },
  { name: 'Page D', saves: 2400, shares: 2200, amt: 2290 },
]

const BoardStats = () => {
  const classes = useStyles()
  const [period, setPeriod] = useState('This Week')
  const [saves, setSaves] = useState([])
  const [shares, setShares] = useState([])
  const { users } = useSelector((state) => state)
  const { token, userId: userID } = users
  const Authorization = `Bearer ${token}`

  useEffect(() => {
    userAPI.getBoardStats({ Authorization, userID }).then((result) => {
      const {
        data: { bkBoardsTimestamp, shares: bkShares },
      } = result
      setSaves(bkBoardsTimestamp)
      setShares(bkShares)
    })
  }, [])

  return (
    <div className={classes.boardstats}>
      <Typography variant="subtitle1">Board Stats</Typography>
      <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
        <MenuItem value={'This Week'}>This Week</MenuItem>
        <MenuItem value={'This Month'}>This Month</MenuItem>
        <MenuItem value={'This Year'}>This Year</MenuItem>
      </Select>
      <LineChart
        width={350}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          bottom: 5,
        }}
      >
        <Tooltip />
        <Line dataKey="shares" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line dataKey="saves" stroke="#82ca9d" />
      </LineChart>
      <List>
        <ListItem>
          <Typography variant="h5" color="secondary">
            {saves.length}
          </Typography>
          &nbsp;
          <Typography variant="body2">&nbsp;Saves </Typography>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Typography variant="h5" color="secondary">
            {shares.length}
          </Typography>
          &nbsp;
          <Typography variant="body2">&nbsp;Shares </Typography>
        </ListItem>
      </List>
      <Divider />
    </div>
  )
}

const BadgeProgress = ({ badgesToDisplay }) => {
  const classes = useStyles()

  return (
    <div className={classes.badgeProgress}>
      <Typography variant="subtitle1">Badge Progress</Typography>
      <List>
        {badgesToDisplay.map((item, index) => {
          const points = item.points
          const indexLevel = LEVELS.findIndex((level) => points < level)
          const levelMaxPoint = LEVELS[indexLevel] + LEVELS[indexLevel - 1]
          const pointValue =
            (100 / levelMaxPoint) * (points - LEVELS[indexLevel - 1])

          return (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar src={item.archieved} />
              </ListItemAvatar>
              <ListItemSecondaryAction className={classes.secondary}>
                <div className={classes.badges}>
                  <Typography variant="subtitle1">
                    {item.name} - Lvl {indexLevel}
                  </Typography>
                  <BorderLinearProgress
                    variant="determinate"
                    value={pointValue}
                  />
                </div>
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      </List>
      <Divider />
    </div>
  )
}

const BadgeCollection = ({ badgesToDisplay }) => {
  const classes = useStyles()
  return (
    <div className={classes.badgeCollectionRoot}>
      <div>
        <Typography variant="subtitle1">Badge Collection</Typography>
      </div>
      <Grid container>
        {badgesToDisplay.map((item, index) => (
          <Grid item xs={4} sm={4} key={index} className={classes.gridItem}>
            <Badge
              className={classes.badge}
              overclap="circle"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              badgeContent={
                <span className={classes.badgeLevel}>{item.counts}</span>
              }
            >
              <Avatar
                src={item.archieved}
                alt="Avatar"
                className={classes.avatar}
              />
            </Badge>
            <Typography variant="body2">{item.name}</Typography>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Dashboard
