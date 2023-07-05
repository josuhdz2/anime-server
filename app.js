const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const bodyParser=require('body-parser');
const app=express();
var port=process.env.PORT||3000;
const database='mongodb://127.0.0.1:27017/animes';
mongoose.set('strictQuery', false);
mongoose.connect(database)
.then(()=>
{
    console.log('Database connected...');
})
.catch((err)=>
{
    console.log('Error with database connection...\n');
});
const schema=new mongoose.Schema({
    nombre:{type:String, require:true},
    episodios:{type:String},
    imagen:{type:String, require:true},
    estudio:{type:String, require:true},
    genero:{type:String, require:true},
    anio:{type:String, require:true}
});
const AnimeModelo=mongoose.model('anime', schema);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
/*app.use((req, res, next)=>
{
    next(createError(404));//aqui hay un error que no se puede resolver
});*/
app.get('/', (req, res)=>
{
    res.send('Servidor en linea, listo para mandar datos...');
});
app.post('/crear', (req, res)=>
{
    AnimeModelo.create(req.body)
    .then((data)=>
    {
        console.log('success');
        res.json(data);
    })
    .catch((err)=>
    {
        console.log(err);
        res.send("Error en la base de datos");
    });
});
app.get('/animes', (req, res)=>
{
    AnimeModelo.find()
    .then((data)=>
    {
        res.json(data);
    })
    .catch((err)=>
    {
        console.log(err);
        res.send("error en la base de datos");
    });
});
app.get('/anime/:id', (req, res)=>
{
    AnimeModelo.findById(req.params.id)
    .then((data)=>
    {
        res.json(data);
    })
    .catch((err)=>
    {
        res.send("Error en la base de datos");
        console.log(err);
    });
});
app.put('/actualizar/:id', (req, res)=>
{
    console.log(req.params.id);
    console.log(req.body);
    AnimeModelo.findByIdAndUpdate(req.params.id, {$set:req.body})
    .then((data)=>
    {
        res.json(data);
    })
    .catch((err)=>
    {
        console.log(err);
        res.send("error en la base de datos");
    });
});
app.delete('/eliminar/:id', (req, res)=>
{
    AnimeModelo.findByIdAndRemove(req.params.id)
    .then((data)=>
    {
        res.json(data);
    })
    .catch((err)=>
    {
        console.log(err);
        res.send('error').statusCode(404);
    });
});
app.use(function(err, req, res, next)
{
    console.error(err.message);
    if(!err.statusCode) err.statusCode=500;
    res.status(err.statusCode).send(err.message);
});
app.listen(port, ()=>
{
    console.log('Server running on port: '+port+'...');
});