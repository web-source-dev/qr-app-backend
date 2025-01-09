const useragent = require('express-useragent');
const geoip = require('geoip-lite');

const analyticsMiddleware = async (req, res, next) => {
    try {
        const userAgent = useragent.parse(req.headers['user-agent']);
        const ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : req.connection.remoteAddress;

        // Check if the IP is valid and not local
        const isLocalIp = (ip) => /^127\.|^0\.|^10\./.test(ip); // Matches local IPs

        if (isLocalIp(ip)) {
            return next(); // Skip geolocation lookup for local IPs
        }

        // Look up the geolocation of the IP
        const geo = geoip.lookup(ip);

        // Fallback values for geo if lookup fails
        const country = geo ? geo.country : 'Unknown';
        const region = geo ? geo.region : 'Unknown';
        const city = geo ? geo.city : 'Unknown';
        const latitude = geo && geo.ll ? geo.ll[0] : null;
        const longitude = geo && geo.ll ? geo.ll[1] : null;

        const analyticsData = {
            // Basic Request Data
            ip: ip,
            url: req.originalUrl,
            method: req.method,
            headers: req.headers, // Full headers for detailed analytics (use with caution if storing sensitive data)
            referrer: req.headers.referer || 'Direct Access',
            queryParams: req.query, // Any query parameters passed in the URL
            bodyData: req.body, // Body payload (only if POST/PUT requests and using body-parser middleware)
            timestamp: new Date().toISOString(),

            // User-Agent Information
            browser: userAgent.browser || 'Unknown',
            version: userAgent.version || 'Unknown',
            os: userAgent.os || 'Unknown',
            platform: userAgent.platform || 'Unknown',
            device: userAgent.isMobile ? 'Mobile' : userAgent.isTablet ? 'Tablet' : 'Desktop',
            renderingEngine: userAgent.engine || 'Unknown', // Rendering engine (e.g., WebKit, Blink)

            // Geolocation Data
             country: country,
            region: region,
            city: city,
            postal: 'Unknown', // Avoid collecting postal information
            latitude: latitude,
            longitude: longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Timezone from system
            isp: geo ? geo.org : 'Unknown', // Internet Service Provider (from geoip-lite, if available)

            // Device Performance & Screen Info (Collected on frontend and passed to backend, if needed)
            screenResolution: req.headers['x-screen-resolution'] || 'Unknown', // Pass this from the frontend
            colorDepth: req.headers['x-color-depth'] || 'Unknown', // Pass this from the frontend

            // Behavioral Data (if collected on frontend and sent to backend)
            sessionId: req.cookies ? req.cookies.sessionId : 'Unknown', // Requires cookie-parser middleware
            userId: req.user ? req.user.id : 'Guest', // Assuming JWT or user session is decoded in `req.user`
            timeOnPage: req.headers['x-time-on-page'], // Duration (in seconds), sent from frontend
            clickEvents: req.headers['x-click-events'] || [], // Array of events sent from frontend

            // Network Data
            connectionType: req.headers['x-connection-type'] || 'Unknown', // Pass this from frontend if needed
            protocol: req.protocol, // HTTP or HTTPS
            secureConnection: req.secure, // Boolean: true if HTTPS
            host: req.headers.host, // Hostname

            // Security Data
            isBot: userAgent.isBot || false, // Detect if the request is from a bot
            csrfToken: req.headers['x-csrf-token'] || 'Unknown', // CSRF token if implemented
        };

        // Save the analytics data to the request object for use in the route
        req.analytics = analyticsData;

        // Optionally, log or save the data to a database
        console.log("Enhanced Analytics Data:", analyticsData);

        next();
    } catch (error) {
        console.error("Error capturing analytics data:", error);
        next(); // Don't block the request if an error occurs
    }
};

module.exports = analyticsMiddleware;
