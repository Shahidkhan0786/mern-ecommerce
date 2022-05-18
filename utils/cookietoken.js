
const cookietoken = (user , res) => {
    const token = user.getjwtToken();
    const options = {
        expiresIn: new Date(Date.now() + process.env.COOKIE_TIMEOUT || 2 *24*60*60*1000),
        httpOnly: true
    }
 
    user.password = undefined;
    res.status(200).cookie('token', token, options).json({
        success: true,
        token: token,
        data: user
    });
}

module.exports = cookietoken;