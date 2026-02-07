const getBuses = async (req, res) => {

    try {

        res.send('buses');

    } catch (error) {

        res.send('buses error');

    }
}

export default getBuses;