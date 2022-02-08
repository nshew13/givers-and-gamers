import baseOptions from '../../vite.base.config';
import path from "path";

const moduleName = '';

const combinedOptions = {
    ...baseOptions,
    base: path.posix.normalize(baseOptions.base + `${moduleName}/`),
    publicDir: path.relative(__dirname, baseOptions.publicDir),
    build: {
        ...baseOptions.build,
        outDir: path.relative(__dirname, baseOptions.build.outDir) + path.sep + moduleName,
    },
};

export default combinedOptions;

console.log('result', combinedOptions);
