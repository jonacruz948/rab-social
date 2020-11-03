import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import VerticalAlignTopOutlinedIcon from '@material-ui/icons/VerticalAlignTopOutlined'

const useStyles = makeStyles((theme) => ({
  scrollToTop: {
    position: 'fixed',
    bottom: theme.spacing(15),
    right: theme.spacing(1),
    animation: `$fadeIn 700ms ${theme.transitions.easing.easeInOut} 1s both`,
    cursor: 'pointer',
  },
  scrollToTopbtn: {
    background: '#999999',
    width: '40px',
    height: '40px',
    boxShadow:
      '0 0.46875rem 2.1875rem rgba(90,97,105,.1), 0 0.9375rem 1.40625rem rgba(90,97,105,.1), 0 0.25rem 0.53125rem rgba(90,97,105,.12), 0 0.125rem 0.1875rem rgba(90,97,105,.1)',
    '&:focus': {
      background: '#999999',
    },
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
}))

const ScrollToTop = () => {
  const [isVisible, setVisible] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    document.addEventListener('scroll', toggleVisibility, true)
    return () => {
      document.removeEventListener('scroll', toggleVisibility, true)
    }
  }, [])

  const scrollToTop = () => {
    typeof window !== `undefined` &&
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
  }

  return (
    <div className={classes.scrollToTop}>
      {isVisible && (
        <IconButton onClick={scrollToTop} className={classes.scrollToTopbtn}>
          <VerticalAlignTopOutlinedIcon style={{ fontSize: '20px' }} />
        </IconButton>
      )}
    </div>
  )
}

export default ScrollToTop
