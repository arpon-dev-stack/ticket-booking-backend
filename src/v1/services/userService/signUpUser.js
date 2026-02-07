const signUpUser = async (req, res) => {

    try {

        res.send('signUp');

    } catch (error) {

        res.send('signUp error');

    }
}

export default signUpUser;