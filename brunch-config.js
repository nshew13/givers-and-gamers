module.exports = {
    files: {
        javascripts: {
            joinTo: 'schedule.js'
        },
        stylesheets: {
            joinTo: 'schedule.css'
        }
    },
    modules: {
        autoRequire: {
            // output: input
            'schedule.js': ['schedule.js']
        }
    }
}
