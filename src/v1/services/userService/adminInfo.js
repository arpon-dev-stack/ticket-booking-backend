const adminInfo = async (req, res) => {
    try {
        res.status(200).json({message: "success"});
    } catch (error) {
        res.status(400).json({message: "failed"})
    }
}

export default adminInfo;