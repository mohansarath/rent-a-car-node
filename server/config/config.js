var env = process.env.NODE_ENV || 'development';
console.log('env ::::::::::', env);
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://sarath:sarath@ds251727.mlab.com:51727/rentacar'
} else if (env === 'test') {
    process.env.PORT = 3000;
    // process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}