import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { BoardDataContextProvider } from '../../context/BoardDataContext'
import Layout from '../../components/Layout'
import BoardCreate from '../../components/Boards/BoardCreate'
import BoardInit from '../../components/Boards/BoardInit'
import * as boardAPI from '../../api/boards'

const useStyles = makeStyles((theme) => ({}))

const NewBoard = () => {
  const router = useRouter()
  const classes = useStyles()
  const { users } = useSelector((state) => state)
  const [boardName, setBoardName] = useState('')
  const [boardDesc, setBoardDesc] = useState('')
  const [hashTags, setHashTags] = useState('')
  const [fileToUpload, setFileToUpload] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [steps, setSteps] = useState(0)

  const { token, isAuthorized } = users
  const Authorization = `Bearer ${token}`

  useEffect(() => {
    if (!isAuthorized)
      router.push({
        pathname: '/auth/login',
        query: { redirectTo: `${window.location.pathname}` },
      })
  })

  const handleNext = ({ boardName, boardDesc, hashTags, file }) => {
    const Authorization = `Bearer ${token}`
    let tags = hashTags.replace(' #', ',').replace('#', '')

    boardAPI
      .getRecommendations({ Authorization, hashTags: tags })
      .then((res) => {
        setSteps(1)
        setBoardName(boardName)
        setBoardDesc(boardDesc)
        setHashTags(hashTags)
        setFileToUpload(file)
        setRecommendations(res.data)
      })
  }

  return (
    <BoardDataContextProvider>
      <Layout>
        {steps === 0 && <BoardCreate onNext={handleNext} steps={steps} />}
        {steps === 1 && (
          <BoardInit
            boardName={boardName}
            boardDesc={boardDesc}
            hashTags={hashTags}
            file={fileToUpload}
            onPrevious={() => setSteps(0)}
            onNext={() => setSteps(2)}
            recommendations={recommendations}
            steps={steps}
          />
        )}
      </Layout>
    </BoardDataContextProvider>
  )
}

export default NewBoard
