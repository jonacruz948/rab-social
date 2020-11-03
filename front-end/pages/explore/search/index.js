import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'

import Layout from '../../../components/Layout'
import ExploreHead from '../../../components/Explore/Head'
import ExploreSearchResult from '../../../components/Explore/SearchResult'
import Navbar from '../../../components/Navbar'
import * as exploreAPI from '../../../api/explore'

const useStyles = makeStyles((theme) => ({
  head: {
    width: '90%',
    margin: 'auto',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}))

const Search = () => {
  const classes = useStyles()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [filterBoards, setFilterBoards] = useState([])
  const [filterCards, setFilterCards] = useState([])

  useEffect(() => {
    if (window.location.search) {
      const urlParams = new URLSearchParams(window.location.search)
      const queryParams = urlParams.get('q')
      if (queryParams) {
        setQuery(queryParams)
        search(queryParams)
      } else {
        setQuery('')
        search('')
      }
    } else {
      router.push('/explore')
    }
  }, [])

  const search = (searchWords) => {
    exploreAPI.getSearchResult({ searchWords }).then((result) => {
      const { data } = result
      const { cards, filteredBoards } = data
      setFilterBoards(filteredBoards)

      setFilterCards(cards)
    })
  }

  const handleSearchByWords = (searchWords) => {
    window.location.search = `?q=${searchWords}`
  }

  return (
    <Layout>
      <div className={classes.head}>
        <ExploreHead onSearchByWords={handleSearchByWords} showClose />
      </div>
      <ExploreSearchResult
        filterCards={filterCards}
        filterBoards={filterBoards}
        word={query}
      />
      <Navbar />
    </Layout>
  )
}

export default Search
