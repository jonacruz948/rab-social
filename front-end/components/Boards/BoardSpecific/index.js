import React from 'react'
import { useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import BookmarkOutlinedIcon from '@material-ui/icons/BookmarkOutlined'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

const BoardSpecific = ({ downloads, bookmark }) => {
  const { users } = useSelector((state) => state)
  const bookmarkCount = users.isAuthorized
    ? users.boards.length
    : bookmark.length

  return (
    <div style={{width: "100%", clear: "both", height: "40px"}}>
      <div style={{ fontSize: '20px', float: "left", color: "#333" }}>
        <BookmarkOutlinedIcon style={{ fontSize: '20px', marginLeft: "20px" }} />
        &nbsp;{bookmark.length}
      </div>
      <div style={{ fontSize: '20px', float: "left" , marginLeft: "20px", color: "#333" }}>
        <CloudDownloadIcon style={{ fontSize: '20px' }} />
        &nbsp;{downloads}
      </div>
    </div>
  )
}

export default BoardSpecific
