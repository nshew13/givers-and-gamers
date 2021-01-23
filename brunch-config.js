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
            'schedule.js': ['gng.js']
        }
    }
}
