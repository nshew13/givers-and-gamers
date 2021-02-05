module.exports = {
    files: {
        javascripts: {
            joinTo: {
                'schedule.js': 'app/schedule.js',
                'leaderboard.js': 'app/leaderboard.js'
            }
        },
        stylesheets: {
            joinTo: {
                'schedule.css': 'app/schedule.scss',
                'leaderboard.css': 'app/leaderboard.scss'
            }
        }
    },
    modules: {
        autoRequire: {
            // output: input
            'schedule.js': ['schedule.js'],
            'leaderboard.js': ['leaderboard.js']
        }
    }
}
