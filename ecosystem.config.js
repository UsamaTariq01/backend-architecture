module.exports = {
    apps: [
        {
            name: 'matnpay_backend',
            script: 'app.js',
            exec_mode: 'cluster',
            intances: 3,
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            }
        }
    ]
};