import abi from './abis/src/contracts/roomrental.sol/Roomrental.json'
import address from './abis/contractAddress.json'
import { getGlobalState, setGlobalState, useGlobalState } from './store'
import { ethers } from 'ethers'
import { resetWarned } from 'antd/es/_util/warning'
// import { logOutWithCometChat } from './services/Chat'

// const { ethereum } = window;
const contractAddress = address.address
const contractAbi = abi.abi
let ethereum, tx

if (typeof window !== 'undefined') ethereum = window.ethereum

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const getEtheriumContract = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, contractAbi, signer)
  return contract
}

const isWallectConnected = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    window.ethereum.on('chainChanged', (chainId) => window.location.reload())

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0])
      await isWallectConnected()
      // await logOutWithCometChat()
      setGlobalState('currentUser', null)
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      console.log('No accounts found.')
      setGlobalState('connectedAccount', '')
    }
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])
  } catch (error) {
    reportError(error)
  }
}

const disconnectWallet = async () => {
  try {
    setGlobalState('connectedAccount', null)
  } catch (error) {
    reportError(error)
  }
}
const createAppartment = async ({
  title,
  description,
  category,
  location,
  bathrooms,
  guests,
  rooms,
  images,
  price,
}) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    price = toWei(price)
    tx = await contract.createAppartment(
      title,
      description,
      images,
      category,
      location,
      bathrooms,
      guests,
      rooms,
      price,
      {
        from: connectedAccount,
      }
    )
    await tx.wait()
  } catch (err) {
    console.log(err)
  }
}

const updateApartment = async ({
  id,
  title,
  description,
  rooms,
  images,
  category,
  location,
  bathrooms,
  guests,
  price,
}) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    price = toWei(price)
    tx = await contract.updateAppartment(
      id,
      title,
      description,
      images,
      category,
      location,
      bathrooms,
      guests,
      rooms,
      price,
      {
        from: connectedAccount,
      }
    )
    await tx.wait()
    await loadAppartment(id)
  } catch (err) {
    console.log(err)
  }
}

const deleteAppartment = async (id) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    tx = await contract.deleteAppartment(id, { from: connectedAccount })
    await tx.wait()
    await loadAppartments()
  } catch (err) {
    console.log(err)
  }
}

const loadAppartments = async () => {
  try {
    const contract = await getEtheriumContract()
    const appartments = await contract.getApartments()
    const securityFee = await contract.securityFee()


    setGlobalState('appartments', structureAppartments(appartments))
    setGlobalState('securityFee', fromWei(securityFee))

    const appartmentsdata = getGlobalState("appartments");
    const connectedAccount = getGlobalState('connectedAccount');

    const myAppartments = appartmentsdata.filter(
      (item) => item.owner === connectedAccount
    );



    const t_reservatedAppartments = [];
    const t_allreservations = [];
    const all_hasfavorites = [];

    for (const item of appartmentsdata) {
      const reservation = await contract.getReservations(item.id, {
        from: connectedAccount,
      });

      const favorites = await contract.getFavorites(item.id, {
        from: connectedAccount
      });

      if (structedFavorites([favorites])[0].guest != connectedAccount)
        all_hasfavorites.push(false)
      else all_hasfavorites.push(structedFavorites([favorites])[0].hasfavorited)
      // console.log(structedFavorites([favorites])[0].guest, '-------------')
      if (structuredReservations(reservation).length !== 0) {
        t_reservatedAppartments.push(item);
        t_allreservations.push(structuredReservations(reservation));
      }
    }

    const favoritedAppartments = appartmentsdata.filter(
      (item) => all_hasfavorites[item.id - 1] == true
    );

    setGlobalState("reservatedAppartments", t_reservatedAppartments);
    setGlobalState("favoritedAppartments", favoritedAppartments);
    setGlobalState("all_reservations", t_allreservations);
    setGlobalState("all_hasfavorites", all_hasfavorites);
    setGlobalState("myappartments", myAppartments);

  } catch (err) {
    console.log(err)
  }
}

const loadAppartment = async (id) => {
  try {
    const contract = await getEtheriumContract()
    const appartment = await contract.getApartment(id)
    const reservated = await contract.tenantReservated(id)
    await loadReviews(id)
    setGlobalState('appartment', structureAppartments([appartment])[0])
    setGlobalState('reservated', reservated)
  } catch (error) {
    reportError(error)
  }
}

const appartmentReservation = async ({ id, datesArray, amount }) => {
  try {
    const contract = await getEtheriumContract()
    const connectedAccount = getGlobalState('connectedAccount')
    const securityFee = getGlobalState('securityFee')
    const all_reservations = getGlobalState("all_reservations");
    const reservatedApartments = getGlobalState('reservatedAppartments');

    tx = await contract.reservateApartment(id, datesArray, {
      from: connectedAccount,
      value: toWei(Number(amount) + Number(securityFee)),
    })

    await tx.wait()
    const reservatedAppartment = await contract.getApartment(id)
    reservatedApartments.push(structureAppartments([reservatedAppartment])[0])

    const reservations = await contract.getReservations(id, {
      from: connectedAccount,
    })

    all_reservations.push(structuredReservations(reservations));
    setGlobalState('all_reservated', all_reservated);
    setGlobalState('reservatedAppartments', reservatedApartments);
    await getUnavailableDates(id)
  } catch (err) {
    console.log(err)
  }
}

const refund = async ({ id, reservationId, date }) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()

    tx = await contract.refundReservation(id, reservationId, date, {
      from: connectedAccount,
    })

    await tx.wait()
    await getUnavailableDates(id)
  } catch (err) {
    console.log(err)
  }
}

const claimFunds = async ({ id, reservationId }) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()

    tx = await contract.claimFunds(id, reservationId, {
      from: connectedAccount,
    })

    await tx.wait()
  } catch (err) {
    console.log
  }
}

const checkInApartment = async (id, reservationId) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    tx = await contract.checkInApartment(id, reservationId, {
      from: connectedAccount,
    })
    await tx.wait()
  } catch (err) {
    console.log(err)
  }
}

const getUnavailableDates = async (id) => {
  const contract = await getEtheriumContract()

  const unavailableDates = await contract.getUnavailableDates(id)
  const timestamps = unavailableDates.map((timestamp) => Number(timestamp))
  setGlobalState('timestamps', timestamps)
}

const hasReservatedDateReached = async ({ id, reservationId }) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    const result = await contract.hasReservatedDateReached(id, reservationId, {
      from: connectedAccount,
    })
    setGlobalState('status', result)
  } catch (err) {
    console.log(err)
  }
}

const getReservations = async (id) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    const reservations = await contract.getReservations(id, {
      from: connectedAccount,
    })

    setGlobalState('reservations', structuredReservations(reservations))
  } catch (err) {
    console.log(err)
  }
}

const getReservation = async ({ id, reservationId }) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()

    const reservation = await contract.getReservation(id, reservationId, {
      from: connectedAccount,
    })
    setGlobalState('reservations', structuredReservations([reservation])[0])
  } catch (err) {
    console.log(err)
  }
}

const addReview = async ({ id, reviewText, cleanliness, accuracy, check_in, communication, location_score, value }) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEtheriumContract()
    tx = await contract.addReview(id, reviewText, cleanliness, accuracy, check_in, communication, location_score, value)
    await tx.wait()

    await loadReviews(id)
  } catch (err) {
    console.log(err)
  }
}

const loadReviews = async (id) => {
  try {
    const contract = await getEtheriumContract()
    const reviews = await contract.getReviews(id)
    setGlobalState('reviews', structuredReviews(reviews))
  } catch (error) {
    reportError(error)
  }
}

const favoriteApartment = async ({ id, hasFavorited }) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    console.log(id, hasFavorited)
    tx = await contract.favoriteApartment(id, hasFavorited, {
      from: connectedAccount
    })

    await tx.wait()
  } catch (err) {
    console.log(err)
  }
}
const structureAppartments = (appartments) =>
  appartments.map((appartment) => ({
    id: Number(appartment.id),
    title: appartment.title,
    owner: appartment.owner.toLowerCase(),
    description: appartment.description,
    price: parseInt(appartment.price._hex) / 10 ** 18,
    deleted: appartment.deleted,
    images: appartment.images.split(','),
    category: appartment.category,
    location: appartment.location.split(','),
    bathrooms: Number(appartment.bathrooms),
    guests: Number(appartment.guests),
    rooms: Number(appartment.rooms),
    timestamp: new Date(appartment.timestamp * 1000).toDateString(),
    reservated: appartment.reservated,
  }))

const structuredReviews = (reviews) =>
  reviews.map((review) => ({
    id: review.id.toNumber(),
    appartmentId: review.appartmentId.toNumber(),
    reviewText: review.reviewText,
    cleanliness: review.cleanliness.toNumber(),
    accuracy: review.accuracy.toNumber(),
    check_in: review.check_in.toNumber(),
    communication: review.communication.toNumber(),
    location_score: review.location_score.toNumber(),
    value: review.value.toNumber(),
    owner: review.owner.toLowerCase(),
    timestamp: new Date(review.timestamp * 1000).toDateString(),
  }))

const structuredReservations = (reservations) =>
  reservations.map((reservation) => ({
    id: reservation.id.toNumber(),
    tenant: reservation.tenant.toLowerCase(),
    date: new Date(reservation.date.toNumber()).toDateString(),
    price: parseInt(reservation.price._hex) / 10 ** 18,
    checked: reservation.checked,
    cancelled: reservation.cancelled,
  }))

const structedFavorites = (favorites) =>
  favorites.map((favorite) => ({
    id: favorite.id.toNumber(),
    guest: favorite.guest.toLowerCase(),
    hasfavorited: favorite.hasfavorited,
  }))
export {
  isWallectConnected,
  connectWallet,
  disconnectWallet,
  createAppartment,
  loadAppartments,
  loadAppartment,
  updateApartment,
  deleteAppartment,
  appartmentReservation,
  loadReviews,
  addReview,
  getUnavailableDates,
  getReservations,
  getReservation,
  hasReservatedDateReached,
  refund,
  checkInApartment,
  claimFunds,
  favoriteApartment,
}
