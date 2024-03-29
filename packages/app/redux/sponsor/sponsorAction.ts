import { GET_SPONSOR, SET_SPONSOR } from './sponsorTypes'

const getSponsor = () => {
  return {
    type: GET_SPONSOR
  }
}

const setSponsor = (data) => {
  return {
    type: SET_SPONSOR,
    payload: data
  }
}

const sponsorAction = { getSponsor, setSponsor }

export default sponsorAction
