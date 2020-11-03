export const API_ENDPOINT = process.env.apiPath
export const GET_ALL_ACTION_CARDS = `${API_ENDPOINT}/api/cards`
export const GET_HOME_CAROUSELS = `${API_ENDPOINT}/api/cards/carousel`
export const GET_ALL_CONTENT_CARDS = `${API_ENDPOINT}/api/cards/allcontentcards`
export const UPDATE_ACTIONS_ON_PROFILE = `${API_ENDPOINT}/api/profile`
export const GET_ACTIONS_FROM_PROFILE = `${API_ENDPOINT}/api/profile`
export const GET_USER_BY_POINTS = `${API_ENDPOINT}/api/action/user-ranking`
export const CREATE_NEW_BOARD = `${API_ENDPOINT}/api/boards/createboard`
export const GET_BOARD_DATA = `${API_ENDPOINT}/api/boards`
export const GET_RECOMMENDATIONS = `${API_ENDPOINT}/api/boards/get-recommendations`
export const UPLOAD_BOARD_IMAGE = `${API_ENDPOINT}/api/boards/upload`
export const UPLOAD_PROFILE_AVATAR = `${API_ENDPOINT}/api/profile`
export const UPDATE_BOARD_MAIN_CONTENTS = `${API_ENDPOINT}/api/boards/update`
export const GET_USER_BOARDS = `${API_ENDPOINT}/api/users/me/boards`
export const DELETE_BOARD = `${API_ENDPOINT}/api/boards/remove`
export const UPDATE_BOARD_DOWNLOAD_COUNT = (boardID) =>
  `${API_ENDPOINT}/api/boards/${boardID}`
export const FIND_MORE_IDEAS = (boardID) =>
  `${API_ENDPOINT}/api/boards/${boardID}/more-ideas`
export const BOOKMARK_CARD_TO_BOARD = `${API_ENDPOINT}/api/cards/bookmark/add`
export const ADD_COMMENT_TO_CARD = `${API_ENDPOINT}/api/comments/add`
export const GET_COMMENTS_CARD = (cardID) =>
  `${API_ENDPOINT}/api/comments/${cardID}`
export const REMOVE_BOOKMARK_CARD_FROM_BOARD = `${API_ENDPOINT}/api/cards/bookmark/remove`
export const UPDATE_DOWNLOAD_COUNT = (cardID) =>
  `${API_ENDPOINT}/api/cards/${cardID}`
export const SUGGEST_CARD = `${API_ENDPOINT}/api/cards/suggest`
export const DELETE_CARDS_FROM_BOARD = `${API_ENDPOINT}/api/boards`
export const USER_SIGNUP = `${API_ENDPOINT}/api/users/register`
export const LOGIN_WITH_SOCIAL = `${API_ENDPOINT}/api/users/login-with-social`
export const USER_LOGIN = `${API_ENDPOINT}/api/users/login`
export const BOOKMARK_BOARD = `${API_ENDPOINT}/api/boards/bookmark/add`
export const REMOVE_BOOKMARK_BOARD = `${API_ENDPOINT}/api/boards/bookmark/remove`
export const GET_SHARABLE_LINK = `${API_ENDPOINT}/api/boards/getshortenurl`
export const UPDATE_PROFILE_INFO = `${API_ENDPOINT}/api/profile`
export const GET_PROFILE_BOARD_STATS = (userID) =>
  `${API_ENDPOINT}/api/profile/${userID}/boardstats`
export const GET_FEEDS_FROM_FEEDLY = `${API_ENDPOINT}/api/feedly`
export const GET_EXPLORE_PAGE_CAROUSEL = `${API_ENDPOINT}/api/explore`
export const GET_EXPLORE_PAGE_TRENDS = `${API_ENDPOINT}/api/explore/trends`
export const GET_EXPLORE_PAGE_TRENDS_BOARD = `${API_ENDPOINT}/api/explore/trendboards`
export const GET_EXPLORE_PAGE_CARDS_BY_BOARD = (userID) =>
  `${API_ENDPOINT}/api/explore/${userID}/cardsbyboardtags`
export const GET_EXPLORE_PAGE_CARDS_BY_LOCATION = (userID) =>
  `${API_ENDPOINT}/api/explore/${userID}/cardsbylocation`
export const GET_SEARCH_RESULTS = `${API_ENDPOINT}/api/explore/search`
export const GET_ACTION_PAGE_CAROUSEL = `${API_ENDPOINT}/api/action`
export const GET_ACTION_PAGE_ACTIONLIST = (userID) =>
  `${API_ENDPOINT}/api/action/${userID}/actionlist`

//admin API
export const ADMIN_LOGIN = `${API_ENDPOINT}/api/admin/login`
export const ADMIN_REGISTER = `${API_ENDPOINT}/api/admin/register-tags`
export const GET_ALL_BOARDS_ADMIN = `${API_ENDPOINT}/api/admin/allboards`
export const GET_ALL_MEDIA_CARDS_ADMIN = `${API_ENDPOINT}/api/admin/allmediacards`
export const GET_ALL_ACTION_CARDS_ADMIN = `${API_ENDPOINT}/api/admin/allactioncards`
export const GET_ALL_SECTIONS = `${API_ENDPOINT}/api/admin/get-all-sections`
export const CREATE_NEW_SECTION = `${API_ENDPOINT}/api/admin/create-new-section`
export const REMOVE_SECTION = `${API_ENDPOINT}/api/admin/remove-section`
export const UPDATE_SECTION = `${API_ENDPOINT}/api/admin/update-section`
export const GET_SECTION = (sectionID) =>
  `${API_ENDPOINT}/api/admin/${sectionID}/section`
