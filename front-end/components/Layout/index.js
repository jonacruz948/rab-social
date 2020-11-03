import React from 'react'
import Container from '@material-ui/core/Container'

import { UserContextProvider } from '../../context/UserContext'
import ScrollToTop from '../ScrollToTop'

const Layout = (props) => (
  <UserContextProvider>
    <div className="mainBody">
      <Container disableGutters={true} maxWidth="xs">
        {props.children}
      </Container>
      <ScrollToTop />
    </div>
  </UserContextProvider>
)

export default Layout
