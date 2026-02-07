const signOutUser = async (req, res) => {

    try {

        res.send('signOut');

    } catch (error) {

        res.send('signOut error');

    }
}

export default signOutUser;