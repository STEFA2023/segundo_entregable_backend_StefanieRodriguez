import path from 'path';

const config = {
    SERVER: 'local',
    PORT: 8080,
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')),
    get UPLOAD_DIR() {return `${this.DIRNAME}/public/img` },
    //MONGODB_URI: 'mongodb://127.0.0.1:27017/PRIMER_ENTREGABLE'
    MONGODB_URI: 'mongodb+srv://stefacoder:stefacoder@proyectofinalbackend.ndjqtt3.mongodb.net/proyecto_final_backend',
    //MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,  REVISAR
    SECRET: 'coder_53160_abc1118',  
    PRODUCTS_PER_PAGE: 4,
    GITHUB_CLIENT_ID: 'Iv23liFfsDS6cOSV69RV',
    GITHUB_CLIENT_SECRET: '466cc12a949967b2ea1ee9ccfd9f60a43bde75f57',
    GITHUB_CALLBACK_URL: 'http://localhost:8080/api/sessions/ghlogincallback'
}

export default config;