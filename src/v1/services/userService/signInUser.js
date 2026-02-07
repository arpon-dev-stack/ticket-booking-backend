const signInUser = async (req, res) => {

    try {

        res.send('signin');

    } catch (error) {

        res.send('signin error');

    }
}

export default signInUser;