
//import * as url from 'url';
import path from 'path';

const config = {
    SERVER: 'local',
    PORT: 8080,
    //DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')),
    get UPLOAD_DIR() {return `${this.DIRNAME}/public/img` },
    MONGODB_URI: 'mongodb://127.0.0.1:27017/PRIMER_ENTREGABLE'
};

export default config;