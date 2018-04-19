var env = process.env.NODE_ENV || 'development';
process.env.SENDGRID_API_KEY ='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'
console.log('env ::::::::::', env);
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://sarath:sarath@ds251727.mlab.com:51727/rentacar'
} else if (env === 'test') {
    process.env.PORT = 3000;
    // process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}