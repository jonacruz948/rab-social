import { isVideo, isImage } from '../../../helpers/file'
import ReactPlayer from 'react-player/lazy'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles((theme) => ({
  reactPlayer: {
    objectFit: 'cover',
  },
  cardImage: {
    height: '200px',
  },
}))

const CardPreview = (props) => {
  const { card, hideAuthor } = props
  const classes = useStyles

  return (
    <div className={card.type === 'board' ? 'boardPreview' : 'cardPreview'}>
      {card.type != 'board' && (
        <div>
          {card.coverimage && isImage(card.coverimage) && (
            <div
              style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),url(${card.coverimage}) center top / cover no-repeat`,
              }}
              className="imageBackground"
            >
              <div className="title">
                {card.title}
                {card.name}
              </div>
            </div>
          )}
          {card.coverimage && isVideo(card.coverimage) && (
            <div className="videoBackground">
              <ReactPlayer
                url={card.coverimage}
                loop={true}
                height="100%"
                width="100%"
              />
            </div>
          )}
          {!card.coverimage && (
            <div className="blankBackground">
              <div className="title">{card.title}</div>
            </div>
          )}
          {hideAuthor !== true && card.owner && (
            <div>
              <Avatar src={card.avatar} />
              <div className="name">
                {' '}
                By <strong>{card.owner}</strong>{' '}
              </div>
            </div>
          )}
        </div>
      )}
      {card.type === 'board' && (
        <div
          className="background"
          style={
            card.coverimage
              ? {
                  background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),url(${card.coverimage}) center top / cover no-repeat`,
                }
              : null
          }
        >
          <div className="title">
            {card.name}
            {card.title}
          </div>
          <div className="author">
            {hideAuthor !== true && (
              <div>
                <Avatar src={card.avatar} />
                <div className="name">
                  {' '}
                  By <strong>{card.owner}</strong>{' '}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CardPreview
