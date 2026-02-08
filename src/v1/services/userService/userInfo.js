const userInfo = async (req, res) => {
    try {
        res.status(200).json({ message: "userInfo" });
    } catch (error) {
        res.status(400).json({ message: "Bad request" })
    }
}

export default userInfo;