const deleteUser = async (req, res) => {

    try {

        res.send('delete');

    } catch (error) {

        res.send('delete error');

    }
}

export default deleteUser;