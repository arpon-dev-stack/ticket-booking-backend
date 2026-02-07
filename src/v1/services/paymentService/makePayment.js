const makePayment = async (req, res) => {

    try {

        res.send('makePayment');

    } catch (error) {

        res.send('makePayment error');

    }
}

export default makePayment;