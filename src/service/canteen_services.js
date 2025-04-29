const canteenRepository = require("../repositories/canteen_repository")


const createCanteen = async (canteenData) => {
    const { nama, departement, lat, lng } = canteenData

    const existingCanteen = await canteenRepository.getCanteenByLatandLng(lat, lng)
    if (existingCanteen) {
        throw new Error('canteen already exists');
    }

    const newCanteen = await canteenRepository.create({
        nama,
        departement,
        lat,
        lng
    })

    return newCanteen
};

const getAllCanteens = async () => {
    const canteens = await canteenRepository.getAllCanteens();

    if (!canteens || canteens.length === 0) throw new Error('No canteens found');

    return canteens;
}

module.exports = {
    createCanteen,
    getAllCanteens
}