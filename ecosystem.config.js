module.exports = {
    apps: [
        {
            name: 'matnpay_backend',
            script: 'app.js',
            exec_mode: 'cluster',
            intances: 3,
            watch: true,
            watch_delay: 1000,
            ignore_watch: ['node_modules'],
            exp_backoff_restart_delay: 100,
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            },
            // Log configuration
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            out_file: './logs/out.log',
            error_file: './logs/error.log',
            logRotate: true, // Enable log rotation
            max_size: '10M', // Max size of the log file before rotation
            retain: 5 // Number of rotated log files to keep
        }
    ]
};