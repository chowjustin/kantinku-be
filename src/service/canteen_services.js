const canteenReposiotry = require("../repositories/canteen_repository")


const createCanteen = async (canteenData) => {
    const { nama, departement, lat, lng } = canteenData

    const existingCanteen = await canteenReposiotry.getCanteenByLatandLng(lat, lng)
    if (existingCanteen) {
        throw new Error('canteen already exists');
    }

    const newCanteen = await canteenReposiotry.create({
        nama,
        departement,
        lat,
        lng
    })

    return newCanteen
}

module.exports = {
    createCanteen
}