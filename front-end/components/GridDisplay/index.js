import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'next/link'
import classnames from 'classnames'

import CardPreview from './CardPreview'

const useStyles = makeStyles((theme) => ({
  itemgrid: {
    marginTop: '20px',
    display: 'grid',
    gridGap: '10px',
    gridAutoRows: '125px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  },
  itemgridboard: {
    gridRowEnd: 'span 3',
  },
  itemgridcard: {
    gridRowEnd: 'span 3',
  },
  noauthor: {
    gridAutoRows: '100px',
  },
}))

const GridDisplay = (props) => {
  const { items, limit, hideAuthor } = props
  const classes = useStyles()

  return (
    <div
      className={
        hideAuthor
          ? classnames(classes.itemgrid, classes.noauthor)
          : classes.itemgrid
      }
    >
      {items.slice(0, limit).map((item, index) => (
        <Link
          href={
            item.type === 'board' ? `/board/${item.id}` : `/cards/${item.slug}`
          }
          key={index}
        >
          <div
            className={
              item.type === 'board'
                ? classes.itemgridboard
                : classes.itemgridcard
            }
          >
            <CardPreview card={item} hideAuthor={hideAuthor} />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default GridDisplay
