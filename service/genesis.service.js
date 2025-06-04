// routes/oauth.routes.js
const express = require("express");
const request = require("request");
const router = express.Router();

const REDIRECT_URI = "http://localhost:3000/redirect";
const clientId = "89129d4e-0634-422a-b82f-506d977a75aa";
const clientSecret = "OWeJHCpose9h181gSRsAh4ZqqQ80Ix1NOHywlHDZ5tUTGcZj";
const basicToken = "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

const loginUrl =
    `https://accounts.genesis.com/api/authorize/ccsp/oauth` +
    `?clientId=${clientId}` +
    `&host=${encodeURIComponent("http://localhost:3000")}` +
    `&response_type=code` +
    `&state=teststate`;

const tokenUrl = "https://accounts.genesis.com/api/account/ccsp/user/oauth2/token";
const profile_url = 'https://prd-kr-ccapi.genesis.com:8081/api/v1/user/profile';
const mycarlist_url = 'https://dev-kr-ccapi.genesis.com:8081/api/v1/car/profile/carlist';

router.get("/login", (req, res) => {
    res.redirect(loginUrl);
});

router.get("/access", (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ success: false, message: "Missing authorization code" });
    }

    const requestBody = {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI
    };

    const options = {
        url: tokenUrl,
        method: "POST",
        form: requestBody,
        headers: {
            Authorization: basicToken,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    request.post(options, (error, response, body) => {
        if (error) return res.status(500).json({ success: false, error });
        try {
            const parsed = JSON.parse(body);
            res.status(response.statusCode).json(parsed);
        } catch (e) {
            res.status(response.statusCode).send(body);
        }
    });
});

router.get('/refresh', (req, res) => {
    const refreshToken = req.query.refresh_token;
    if (!refreshToken) return res.status(400).send("Refresh token is missing");

    const requestBody = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        redirect_uri: REDIRECT_URI
    };

    const options = {
        url: tokenUrl,
        method: 'POST',
        form: requestBody,
        headers: {
            Authorization: basicToken,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    request.post(options, (error, response, body) => {
        if (error) return res.status(500).send("Refresh Token request failed");
        try {
            const parsed = JSON.parse(body);
            res.status(response.statusCode).json(parsed);
        } catch (err) {
            res.status(response.statusCode).send(body);
        }
    });
});

router.get('/delete', (req, res) => {
    const access_token = req.query.access_token;
    if (!access_token) return res.status(400).json({ success: false, message: "Access token is missing" });

    const request_body = {
        grant_type: "delete",
        access_token,
        redirect_uri: REDIRECT_URI
    };

    const options = {
        url: tokenUrl,
        method: 'POST',
        form: request_body,
        headers: {
            Authorization: basicToken,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    request.post(options, (error, response, body) => {
        if (error) return res.status(500).json({ success: false, error });
        try {
            const result = JSON.parse(body);
            res.status(response.statusCode).json(result);
        } catch (e) {
            res.status(response.statusCode).send(body);
        }
    });
});

router.get('/profile', (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Authorization header is missing' });
    const authHeader = auth.startsWith('Bearer ') ? auth : `Bearer ${auth}`;

    request.get({
        url: profile_url,
        headers: { 'Authorization': authHeader }
    }, (error, response, body) => {
        if (error) return res.status(500).json({ error: '요청 실패', details: error });
        try {
            const parsed = JSON.parse(body);
            res.status(response.statusCode).json(parsed);
        } catch (e) {
            res.status(500).json({ error: '응답 파싱 실패', raw: body });
        }
    });
});

router.get('/mycarlist', (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Authorization header is missing' });
    const authHeader = auth.startsWith('Bearer ') ? auth : `Bearer ${auth}`;

    request.get({
        url: mycarlist_url,
        headers: { 'Authorization': authHeader },
        timeout: 5000
    }, (error, response, body) => {
        if (error) return res.status(500).json({ error: '요청 실패', details: error.message });
        try {
            const parsed = JSON.parse(body);
            res.status(response.statusCode).json(parsed);
        } catch (e) {
            res.status(500).json({ error: '응답 파싱 실패', raw: body });
        }
    });
});

module.exports = router;
