module.exports = {
    apps: [
        {
            name: 'matnpay_backend',
            script: 'app.js',
            exec_mode: 'cluster',
            intances: 3,
            watch: true,
            watch_delay: 1000,
            ignore_watch: [ 'node_modules' ],
            exp_backoff_restart_delay: 100,
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            }
        }
    ]
};