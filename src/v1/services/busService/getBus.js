const getBus = async (req, res) => {

    try {

        res.send('bus');

    } catch (error) {

        res.send('bus error');

    }
}

export default getBus;