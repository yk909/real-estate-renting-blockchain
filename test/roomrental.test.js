const { expect } = require('chai')


const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const dates1 = [1678492800000, 1678579200000, 1678665600000]
const dates2 = [1678752000000, 1678838400000]

describe('Contracts', () => {
  let contract, result
  const id = 1
  const bookingId = 0
  const taxPercent = 7
  const securityFee = 5
  const title = 'First apartment'
  const newTitle = 'Update apartment'
  const description = 'Lorem Ipsum dalum'
  const category = 'Beach'
  const location = ['Asia', 'Afghanistan', 33, 65]
  const images = [
    'https://a0.muscache.com/im/pictures/miso/Hosting-3524556/original/24e9b114-7db5-4fab-8994-bc16f263ad1d.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/10d2c21f-84c2-46c5-b20b-b51d1c2c971a.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-584469386220279136/original/227d4c26-43d5-42da-ad84-d039515c0bad.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-610511843622686196/original/253bfa1e-8c53-4dc0-a3af-0a75728c0708.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-535385560957380751/original/90cc1db6-d31c-48d5-80e8-47259e750d30.jpeg?im_w=720',
  ]
  const rooms = 4
  const bathrooms = 2
  const guests = 3
  const price = 2.7
  const newPrice = 1.3

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory('Roomrental')
      ;[deployer, owner, tenant1, tenant2] = await ethers.getSigners()

    contract = await Contract.deploy(taxPercent, securityFee)
    await contract.deployed()
  })

  describe('Apartment', () => {
    beforeEach(async () => {
      await contract
        .connect(owner)
        .createAppartment(
          title,
          description,
          images.join(','),
          category,
          location.join(','),
          bathrooms,
          guests,
          rooms,
          toWei(price)
        )
    })

    it('Should confirm apartment in array', async () => {
      result = await contract.getApartments()
      expect(result).to.have.lengthOf(1)

      result = await contract.getApartment(id)
      expect(result.title).to.be.equal(title)
      expect(result.description).to.be.equal(description)
      expect(result.images).to.be.equal(images.join(','))
    })

    it('Should confirm apartment update', async () => {
      result = await contract.getApartment(id)
      expect(result.title).to.be.equal(title)
      expect(result.price).to.be.equal(toWei(price))

      await contract
        .connect(owner)
        .updateAppartment(
          id,
          newTitle,
          description,
          category,
          images.join(','),
          location.join(','),
          bathrooms,
          guests,
          rooms,
          toWei(newPrice)
        )

      result = await contract.getApartment(id)
      expect(result.title).to.be.equal(newTitle)
      expect(result.price).to.be.equal(toWei(newPrice))
    })

    it('Should confirm apartment deletion', async () => {
      result = await contract.getApartments()
      expect(result).to.have.lengthOf(1)

      result = await contract.getApartment(id)
      expect(result.deleted).to.be.equal(false)

      await contract.connect(owner).deleteAppartment(id)

      result = await contract.getApartments()
      expect(result).to.have.lengthOf(0)

      result = await contract.getApartment(id)
      expect(result.deleted).to.be.equal(true)
    })
  })

  describe('Reservation', () => {
    describe('Success', () => {
      beforeEach(async () => {
        await contract
          .connect(owner)
          .createAppartment(
            title,
            description,
            category,
            images.join(','),
            location.join(','),
            bathrooms,
            guests,
            rooms,
            toWei(price)
          )

        await contract.connect(tenant1).reservateApartment(id, dates1, {
          value: toWei(price * dates1.length + securityFee),
        })
      })

      it('Should confirm apartment reservation', async () => {
        result = await contract.getReservations(id)
        expect(result).to.have.lengthOf(dates1.length)

        result = await contract.getUnavailableDates(id)
        expect(result).to.have.lengthOf(dates1.length)
      })

      it('Should confirm apartment checking in', async () => {
        result = await contract.getReservation(id, bookingId)
        expect(result.checked).to.be.equal(false)

        result = await contract.connect(tenant1).tenantBooked(id)
        expect(result).to.be.equal(false)

        await contract.connect(tenant1).checkInApartment(id, bookingId)

        result = await contract.getReservation(id, bookingId)
        expect(result.checked).to.be.equal(true)

        result = await contract.connect(tenant1).tenantBooked(id)
        expect(result).to.be.equal(true)
      })

      it('Should return the security fee', async () => {
        result = await contract.securityFee()
        expect(result).to.be.equal(securityFee)
      })

      it('Should return the tax percent', async () => {
        result = await contract.taxPercent()
        expect(result).to.be.equal(taxPercent)
      })
    })

    describe('Failure', () => {
      beforeEach(async () => {
        await contract
          .connect(owner)
          .createAppartment(
            title,
            description,
            category,
            images.join(','),
            location.join(','),
            bathrooms,
            guests,
            rooms,
            toWei(price)
          )
      })

      it('Should prevent booking with wrong id', async () => {
        await expect(
          contract.connect(tenant1).reservateApartment(666, dates1, {
            value: toWei(price * dates1.length + securityFee),
          })
        ).to.be.revertedWith('Apartment not found!')
      })

      it('Should prevent booking with wrong pricing', async () => {
        await expect(
          contract.connect(tenant1).reservateApartment(id, dates1, {
            value: toWei(price * 0 + securityFee),
          })
        ).to.be.revertedWith('Insufficient fund!')
      })
    })
  })
})
